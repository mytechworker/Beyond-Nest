import { BadRequestException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, SortOrder } from 'mongoose';
import { User, UserDocument } from '../databases/models/user.schema';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { HelperService } from 'src/helpers/helper.service';
import { MailService } from '../helpers/mail.service';
import locals from '../locals/en.json';
import * as geoip from 'geoip-lite';
import { Journey, JourneyDocument } from 'src/databases/models/journey.schema';
import { FocusArea, FocusAreaDocument } from 'src/databases/models/focusarea.schema';
import { JourneyGuide, JourneyGuideDocument } from 'src/databases/models/journeyguide.schema';
import { MyThoughtsAndInspirations, MyThoughtsAndInspirationsDocument } from 'src/databases/models/mythoughtsandinspirations.schema';
import { InspiringMedia, InspiringMediaDocument } from 'src/databases/models/inspiringmedia.schema';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
@Injectable()
export class UserService {

  private refreshTokens: string[] = [];
  private accessTokens: string[] = [];
  
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Journey.name) private readonly journeyModel: Model<JourneyDocument>,
    @InjectModel(FocusArea.name) private readonly focusAreaModel: Model<FocusAreaDocument>,
    @InjectModel(JourneyGuide.name) private readonly journeyGuideModel: Model<JourneyGuideDocument>,
    @InjectModel(MyThoughtsAndInspirations.name) private readonly myThoughtsAndInspirationsModel: Model<MyThoughtsAndInspirationsDocument>,
    @InjectModel(InspiringMedia.name) private readonly inspiringMediaModel: Model<InspiringMediaDocument>,
    private readonly jwtService: JwtService,
    private readonly helperService: HelperService,
    private readonly mailService: MailService,
  ) { }

  private generateAccessToken(admin: any): string {
    const accessToken = this.jwtService.sign(admin, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: '5d',
    });
    this.accessTokens.push(accessToken);
    return accessToken;
  }

  private generateRefreshToken(admin: any): string {
    const refreshToken = this.jwtService.sign(admin, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: '2y',
    });
    this.refreshTokens.push(refreshToken);
    return refreshToken;
  }

  async otpSendIntoEmail(req, res): Promise<void> {
    let message: string;
    const locals = this.helperService.getLocaleMessages();
    if (req.body.type === 'sendOtp') {
      message = locals.resend_otp;
      message = message.replace('%OTP%', req.body.emailOtp);
      req.body.subject = locals.resend_otp_subject;
    } else if (req.body.type === 'signupOtp') {
      message = locals.signup_otp;
      message = message.replace('%OTP%', req.body.emailOtp);
      req.body.subject = locals.signup_otp_subject;
    }

    req.body.msg = message;
    await this.mailService.sendEmail(req);
  }

  async newSignUp(req: any): Promise<any> {
    const locals = this.helperService.getLocaleMessages();
    try {
      const { email, phoneNumber, password } = req.body;
      if (email || phoneNumber || password) {
        let userEmailCheck = await this.userModel.findOne({ email: req.body.email });

        if (userEmailCheck && userEmailCheck.deleted) {
          return { message: locals.user_account_delete, success: false, data: {} };
        }

        if (userEmailCheck) {
          return { message: locals.available_email, success: false, data: null };
        }

        req.body.emailOtp = this.helperService.generateSixDigitRandomNumber();
        req.body.phoneOtp = this.helperService.generateSixDigitRandomNumber();
        req.body.phoneOtpDateTime = new Date();

        if (req.body.password) {
          req.body.password = await bcrypt.hash(req.body.password, 10);
          req.body.oldPassword = [req.body.password];
        }

        req.body.latitude = '00.00';
        req.body.longitude = '00.00';
        req.body.location = { type: 'Point', coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)] };

        const currentTime = Date.now();
        const futureTime = currentTime + 30 * 60 * 1000;
        req.body.emailOtpDateTime = futureTime;

        await this.userModel.create(req.body);

        req.body.type = 'signupOtp';
        await this.otpSendIntoEmail(req, null);

        return { message: locals.otp_send, success: true, data: null };
      } else {
        await this.userModel.updateOne({ email: req.body.userEmail, deleted: false }, { $set: req.body });
        return { message: locals.record_create, success: true, data: null };
      }
    } catch (err) {
      console.error(err);
      return { message: locals.something_went_wrong, success: false, data: null };
    }
  }

  async checkUser(req: any): Promise<any> {
    const locals = this.helperService.getLocaleMessages();
    try {
      let whereCondition = req.body;
      if (!req.body.phoneNumber && !req.body.email) {
        throw new BadRequestException(locals.enter_all_field);
      }

      let emailOtp = await this.helperService.generateSixDigitRandomNumber();
      if (req.body.userEmail) {
        whereCondition = {
          phoneNumber: req.body.phoneNumber,
          countryCode: req.body.countryCode,
        };
      }

      let userNameCheck = await this.userModel.findOne(whereCondition);
      if (userNameCheck) {
        if (req.body.phoneNumber) {
          if (userNameCheck.email !== req.body.userEmail) {
            return { message: locals.available_phone, success: false, data: null };
          } else {
            await this.userModel.updateOne(
              { email: req.body.userEmail },
              { $set: { phoneNumber: req.body.phoneNumber, countryCode: req.body.countryCode, phoneOtp: emailOtp, phoneOtpDateTime: new Date() } },
            );
            return { message: locals.otp_send, success: true, data: null };
          }
        } else if (req.body.email) {
          if (userNameCheck.isRegistrationCompleted === true) {
            return { message: locals.available_email, success: false, data: null };
          } else if (userNameCheck.isVerifyEmailOtp === false && !userNameCheck.password && !userNameCheck.displayName) {
            return {
              message: locals.available_email,
              success: false,
              data: {
                isVerifyEmailOtp: userNameCheck.isVerifyEmailOtp,
                password: userNameCheck.password,
                displayName: userNameCheck.displayName,
                isVerifyPhoneOtp: userNameCheck.isVerifyPhoneOtp,
                userName: userNameCheck.userName,
                bio: userNameCheck.bio,
                phoneNumber: userNameCheck.phoneNumber,
                coverImage: userNameCheck.coverImage,
                profileImage: userNameCheck.profileImage,
              },
            };
          } else {
            return { message: locals.user_email_not_valid, success: false, data: null };
          }
        }
      } else {
        if (req.body.email) {
          req.body.latitude = '00.00';
          req.body.longitude = '00.00';
          req.body.location = {
            type: 'Point',
            coordinates: [req.body.longitude, req.body.latitude],
          };
          const currentTime = Date.now();
          const futureTime = currentTime + 30 * 60 * 1000;
          await this.userModel.create({ email: req.body.email, emailOtp: emailOtp, location: req.body.location, emailOtpDateTime: futureTime });
          req.body.type = 'signupOtp';
          await this.otpSendIntoEmail(req, null);
          return { message: locals.otp_send, success: true, data: null };
        } else {
          await this.userModel.updateOne(
            { email: req.body.userEmail },
            { $set: { phoneNumber: req.body.phoneNumber, countryCode: req.body.countryCode, phoneOtp: emailOtp, phoneOtpDateTime: new Date() } },
          );
          return { message: locals.otp_send, success: true, data: null };
        }
      }
    } catch (err) {
      throw new BadRequestException(locals.something_went_wrong);
    }
  }

  async signup(signupDto: SignupDto): Promise<any> {
    const locals = this.helperService.getLocaleMessages();
    const { email, phoneNumber, password } = signupDto;

    // Validate email or phone number presence
    if (!email && !phoneNumber) {
      throw new BadRequestException('Email or phone number is required.');
    }

    // Generate OTPs if required
    let emailOtp, phoneOtp;
    if (email) {
      emailOtp = this.helperService.generateSixDigitRandomNumber();
    }
    if (phoneNumber) {
      phoneOtp = this.helperService.generateSixDigitRandomNumber();
    }

    // Hash password if provided
    let hashedPassword = '';
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Set default location
    const location = { type: 'Point', coordinates: [0, 0] };

    // Create condition object for updating/creating user
    const condition = {
      ...signupDto,
      password: hashedPassword,
      emailOtp,
      phoneOtp,
      location,
      phoneOtpDateTime: phoneOtp ? new Date() : null,
      emailOtpDateTime: emailOtp ? new Date(Date.now() + 30 * 60 * 1000) : null,
    };

    // Check if email already exists
    const userEmailCheck = await this.userModel.findOne({ email });
    if (userEmailCheck && userEmailCheck.deleted) {
      return { message: locals.user_account_delete, success: false, data: {} };
    }
    if (userEmailCheck) {
      return { message: locals.available_email, success: false, data: null };
    }

    // Create user object
    const user = new this.userModel(condition);

    // Save user to database
    await user.save();

    // Prepare the request for sending OTP
    const otpRequest = {
      body: {
        email: email,
        emailOtp,
        type: 'signupOtp',
      },
    };

    // Send OTP using otpSendIntoEmail of UserService
    await this.otpSendIntoEmail(otpRequest, null);

    // Return appropriate response
    if (email) {
      return { message: locals.otp_send, success: true, data: null };
    } else if (phoneNumber) {
      // Handle phone OTP sending if required
      return { message: locals.otp_send, success: true, data: null };
    } else if (password) {
      return { message: locals.password_created, success: true, data: null };
    } else if (signupDto.displayName) {
      return { message: locals.display_name_created, success: true, data: null };
    } else if (signupDto.profileImage) {
      return { message: locals.profile_saved, success: true, data: null };
    } else if (signupDto.coverImage) {
      return { message: locals.cover_saved, success: true, data: null };
    } else if (signupDto.userName) {
      return { message: locals.user_name_created, success: true, data: null };
    } else if (signupDto.bio) {
      return { message: locals.bio_created, success: true, data: null };
    } else if (signupDto.notificationStatus) {
      return { message: locals.notifications_activated, success: true, data: null };
    } else {
      return { message: locals.record_create, success: true, data: null };
    }
  }

  async login(req: any, loginDto: LoginDto): Promise<any> {
    const locals = this.helperService.getLocaleMessages();
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });

    if (!user) {
      return { message: locals.user_not_found, success: false, data: null };
    }

    // Check if user account is deleted or deactivated
    if (user.deleted) {
      return { message: locals.user_account_delete, success: false, data: {} };
    }

    if (user.status === 'deactive') {
      return { message: locals.user_deactivated, success: false, data: { user, accessToken: "", refreshToken: "" } };
    }

    // Send OTP if email is not verified
    if (!user.isVerifyEmailOtp) {
      await this.otpSendIntoEmail(req, { body: { emailOtp: user.emailOtp, type: 'sendOtp' } });
      return { message: locals.otp_not_verify, success: false, data: { user, accessToken: "", refreshToken: "" } };
    }

    // Handle the case where password is not set
    if (!user.password) {
      return { message: locals.password_not_set, success: false, data: { user, accessToken: "", refreshToken: "" } };
    }

    // Check password validity
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { message: locals.wrong_password, success: false, data: null };
    }

    // Generate tokens
    const accessToken = await this.generateAccessToken({ userId: user._id });
    const refreshToken = await this.generateRefreshToken({ userId: user._id });

    // Update user's last login and tracking details
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Ensure userAgent is defined before accessing its properties
    const browser = userAgent ? userAgent.family : 'Unknown';
    const os = userAgent && userAgent.os ? userAgent.os.toString() : 'Unknown';
    const platform = userAgent ? userAgent.platform : 'Unknown';
    const source = userAgent ? userAgent.source : 'Unknown';

    user.lastLogin = new Date();
    user.tracking = {
      ip,
      device: {
        browser,
        os,
        platform,
        source,
      },
    };
    await user.save();

    return {
      message: locals.login_success,
      success: true,
      data: { user, accessToken, refreshToken },
    };
  }

  async verifyOtp(req: any): Promise<any> {
    const locals = this.helperService.getLocaleMessages();
    try {
      const { otp, email, phoneNumber } = req.body;

      if (![otp].every(Boolean) || (!email && !phoneNumber)) {
        return { message: locals.enter_all_field, success: false, data: null };
      }

      let condition: any;
      let checkUserExist: any;

      if (email) {
        checkUserExist = await this.userModel.findOne({ email: email });
        condition = { emailOtp: 0, isVerifyEmailOtp: false, emailOtpDateTime: 0 };
      } else {
        checkUserExist = await this.userModel.findOne({ countryCode: req.body.countryCode, phoneNumber: phoneNumber });
      }

      if (!checkUserExist) {
        return { message: email ? locals.valid_email : locals.valid_phone, success: false, data: null };
      }

      if (email && checkUserExist.deleted) {
        return { message: locals.user_account_delete, success: false, data: {} };
      }

      if (email && new Date().getTime() > checkUserExist.emailOtpDateTime) {
        await this.userModel.updateOne({ _id: checkUserExist._id }, { $set: condition });
        return { message: locals.otp_time_expired, success: false, data: null };
      }

      const storedOTP = checkUserExist.emailOtp.toString().trim();
      const enteredOTP = otp.toString().trim();

      if (email && storedOTP !== enteredOTP) {
        return { message: locals.otp_not_match, success: false, data: null };
      }

      if (email) {
        await this.userModel.updateOne({ _id: checkUserExist._id }, { $set: { isVerifyEmailOtp: true, emailOtp: 0, emailOtpDateTime: 0 } });
        return { message: locals.verify_otp, success: true, data: null };
      } else {
        const date1 = new Date(checkUserExist.phoneOtpDateTime);
        const date2 = new Date();

        const timeDifference = date2.getTime() - date1.getTime();
        const isTimeDifferenceLessThan10Minutes = timeDifference > 0 && timeDifference < 10 * 60 * 1000;

        if (!isTimeDifferenceLessThan10Minutes) {
          return { message: locals.otp_time_expired, success: false, data: null };
        }

        await this.userModel.updateOne({ _id: checkUserExist._id }, { $set: { isVerifyPhoneOtp: true, phoneOtp: 0 } });
        return { message: locals.verify_phone_otp, success: true, data: null };
      }
    } catch (err) {
      console.error(err);
      return { message: locals.something_went_wrong, success: false, data: null };
    }
  }


  async sendOtp(req: any): Promise<any> {
    const locals = this.helperService.getLocaleMessages();
    try {
      if (!req.body.phoneNumber && !req.body.email) {
        return { message: locals.enter_all_field, success: false, data: null };
      }
      if (req.body.email) {
        let checkUserExist = await this.userModel.findOne({
          email: req.body.email,
          // deleted: false,
        });
        if (!checkUserExist)
          return { message: locals.valid_email, success: false, data: null };

        if (checkUserExist.deleted == true) {
          return { message: locals.user_account_delete, success: false, data: {} };
        }
        const emailOtp = await this.helperService.generateSixDigitRandomNumber();
        const futureTime = Date.now() + (30 * 60 * 1000);
        let condition: any = { emailOtp: emailOtp, emailOtpDateTime: futureTime };
        if (req.body.isVerifyEmailOtp == false) condition.isVerifyEmailOtp = false;
        await this.userModel.updateOne(
          { _id: checkUserExist._id },
          { $set: condition }
        );
        req.body.emailOtp = emailOtp;
        req.body.type = "sendOtp";
        await this.otpSendIntoEmail(req, null);
      } else {
        let checkUserExist = await this.userModel.findOne({
          countryCode: req.body.countryCode,
          phoneNumber: req.body.phoneNumber,
          deleted: false,
        });
        if (!checkUserExist)
          return { message: locals.user_not_found, success: false, data: null };
        const randomNumber = "123456"; //await this.helperService.generateSixDigitRandomNumber();
        await this.userModel.updateOne(
          { _id: checkUserExist._id },
          { $set: { phoneOtp: randomNumber, isVerifyPhoneOtp: false, phoneOtpDateTime: new Date() } }
        );
      }
      return { message: locals.otp_send, success: true, data: null };
    } catch (err) {
      console.error(err);
      return { message: locals.something_went_wrong, success: false, data: null };
    }
  }

  async updatePassword(req: any): Promise<any> {
    const locals = this.helperService.getLocaleMessages();
    try {
        const { email, password } = req.body;
        if (![email, password].every(Boolean)) {
            return { message: locals.enter_all_field, success: false, data: null };
        }
        const checkUserExist = await this.userModel.findOne({ email, deleted: false });
        if (!checkUserExist) {
            return { message: locals.valid_email, success: false, data: null };
        }
        const passwordHash = password ? await bcrypt.hash(password, 10) : false;
        if (checkUserExist.oldPassword.length >= 10) {
            checkUserExist.oldPassword.shift();
        }
        checkUserExist.oldPassword.push(passwordHash);
        await this.userModel.updateOne(
            { _id: checkUserExist._id },
            { $set: { password: passwordHash, oldPassword: checkUserExist.oldPassword } }
        );
        return { message: locals.password_update, success: true, data: null };
    } catch (err) {
        console.error(err);
        return { message: locals.something_went_wrong, success: false, data: null };
    }
}

async checkPassword(req: any): Promise<any> {
  const locals = this.helperService.getLocaleMessages();
  try {
      const { newPassword, email } = req.body;
      if (![newPassword, email].every(Boolean)) {
          return { message: locals.enter_all_field, success: false, data: null };
      }
      let checkPasswordExist = true;
      const result = await this.userModel.findOne({ email });
      for (let index = 0; index < result.oldPassword.length; index++) {
          if (await bcrypt.compare(newPassword, result.oldPassword[index])) {
              checkPasswordExist = false;
              break;
          }
      }
      if (checkPasswordExist) {
          return { message: locals.password_valid, success: true, data: null };
      } else {
          return { message: locals.password_already_used, success: false, data: null };
      }
  } catch (err) {
      console.error(err);
      return { message: locals.something_went_wrong, success: false, data: null };
  }
}

async changePassword(req: any): Promise<any> {
  const locals = this.helperService.getLocaleMessages();
  try {
    const userData = await this.helperService.validateUser(req);
    const { newPassword, oldPassword } = req.body;
    if (![newPassword, oldPassword].every(Boolean)) {
      return { message: locals.enter_all_field, success: false, data: null };
    }
    const passwordHash = newPassword ? await bcrypt.hash(newPassword, 10) : false;
    const result = await this.userModel.findOne({ _id: userData._id });
    if (result.oldPassword.length >= 10) {
      result.oldPassword.shift();
    }
    result.oldPassword.push(passwordHash);
    if (await bcrypt.compare(oldPassword, result.password)) {
      await this.userModel.updateOne(
        { _id: userData._id },
        { $set: { password: passwordHash, oldPassword: result.oldPassword } }
      );
      return { message: locals.password_change, success: true, data: null };
    } else {
      return { message: locals.wrong_password, success: false, data: null };
    }
  } catch (err) {
    console.error(err);
    return { message: locals.something_went_wrong, success: false, data: null };
  }
}

async updateProfile(req: any): Promise<any> {
  const locals = this.helperService.getLocaleMessages();
  try {
    const userData = await this.helperService.validateUser(req);
    await this.userModel.updateOne({ _id: userData._id }, { $set: req.body });

    if (req.body.userName) {
      await this.journeyModel.updateMany(
        { userId: userData._id },
        { $set: { ownerName: req.body.userName, createrName: req.body.userName } }
      );
    }

    const data = await this.userModel.findOne({ _id: userData._id });
    return {
      message: locals.profile_update,
      success: true,
      data: data,
    };
  } catch (err) {
    return {
      message: locals.something_went_wrong,
      success: false,
      data: null,
    };
  }
}


async logout(req: any): Promise<{ message: string; success: boolean; data: any }> {
  const locals = this.helperService.getLocaleMessages();
  try {
    const userData = await this.helperService.validateUser(req);
    const { refreshToken, accessToken } = req.body;

    if (!refreshToken || !accessToken) {
      return { message: locals.enter_token, success: false, data: null };
    }

    this.refreshTokens = this.refreshTokens.filter((c) => c !== refreshToken);
    this.accessTokens = this.accessTokens.filter((c) => c !== accessToken);

    await this.userModel.updateOne(
      { _id: userData._id },
      {
        $set: {
          deviceToken: null,
          accessToken: null,
          refreshToken: null,
          deviceType: null,
        },
      },
    );

    return { message: locals.logout, success: true, data: null };
  } catch (err) {
    console.error(err);
    return { message: locals.something_went_wrong, success: false, data: null };
  }
}

async deleteUserAccount(deleteId: string): Promise<{ message: string; success: boolean; data: any }> {
  const locals = this.helperService.getLocaleMessages();
  try {
    if (!mongoose.Types.ObjectId.isValid(deleteId)) {
      console.error(`Invalid ObjectId: ${deleteId}`);
      return { message: locals.invalid_user_id, success: false, data: null };
    }

    const userObjectId = new mongoose.Types.ObjectId(deleteId);
    console.log(`Valid ObjectId: ${userObjectId}`);

    const user = await this.userModel.findById(userObjectId);
    if (!user) {
      console.error(`User does not exist: ${userObjectId}`);
      return { message: locals.user_not_found, success: false, data: null };
    }

    await this.userModel.deleteOne({ _id: userObjectId });
    await this.focusAreaModel.deleteMany({ userId: userObjectId });
    await this.journeyGuideModel.deleteMany({ userId: userObjectId });
    await this.myThoughtsAndInspirationsModel.deleteMany({ userId: userObjectId });
    await this.inspiringMediaModel.deleteMany({ userId: userObjectId });

    return { message: locals.delete_account, success: true, data: null };
  } catch (err) {
    console.error(err);
    return { message: locals.something_went_wrong, success: false, data: null };
  }
}

async refreshToken(refreshToken: string): Promise<any> {
  try {
    if (!refreshToken) {
      throw new UnauthorizedException('Please provide a refresh token');
    }

    // Decode the refresh token
    const decoded: any = this.jwtService.verify(refreshToken);

    // Verify if the decoded token contains the userId
    if (!decoded || typeof decoded !== 'object' || !('userId' in decoded)) {
      throw new UnauthorizedException('Invalid token payload');
    }

    // Extract the userId from the decoded token
    const userId = decoded.userId;

    // Ensure userId is properly formatted as ObjectId
    let userIdObj;
    try {
      userIdObj = new mongoose.Types.ObjectId(userId);
    } catch (error) {
      throw new UnauthorizedException('Invalid user ID format');
    }

    // Retrieve the user from the database
    const user = await this.userModel.findById(userIdObj);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Generate new access token and refresh token
    const accessToken = this.jwtService.sign({ userId: user._id });
    const newRefreshToken = this.jwtService.sign({ userId: user._id }, { expiresIn: '2y' });

    return {
      message: 'Tokens refreshed successfully',
      accessToken,
      refreshToken: newRefreshToken,
    };
  } catch (error) {
    console.error('Error refreshing token:', error.message);
    throw new UnauthorizedException('Invalid token');
  }
}

async profileFetch(req: any): Promise<any> {
  try {
    let userData = await this.helperService.validateUser(req);
    let details = await this.userModel.findOne({ _id: userData._id });
    // Add logic to prepend API_URL to image URLs if needed
    return {
      success: true,
      message: 'User information fetched successfully',
      data: details,
    };
  } catch (err) {
    return {
      message: 'Something went wrong',
      success: false,
      data: null,
    };
  }
}

async getUsersList(queryParams: any): Promise<any> {
  try {
    // Define pagination and sorting options
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 10;
    const sort: { [key: string]: 'asc' | 'desc' } = { createdDate: 'desc' };
    let query;

    if (queryParams.search) {
      // Define a query condition with multiple columns
      query = {
        $or: [
          { userName: { $regex: queryParams.search, $options: 'i' } },
          { email: { $regex: queryParams.search, $options: 'i' } },
        ],
      };
    }

    const skip = (page - 1) * limit;
    const users = await this.userModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .select([
        '_id',
        'userName',
        'email',
        'phoneNumber',
        'countryCode',
        'status',
        'displayName',
        'bio',
        'profileImage',
        'coverImage',
        'location',
        'tracking',
        'lastLogin',
      ]);

    const totalItems = await this.userModel.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    return {
      success: true,
      message: 'User list fetched successfully',
      users,
      totalPages,
      totalItems,
      limit,
      page,
    };
  } catch (err) {
    throw new Error('Something went wrong');
  }
}
}