import { Injectable, BadRequestException, UnauthorizedException, NotFoundException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, ObjectId, SortOrder } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Admin, AdminDocument } from '../databases/models/admin.schema';
import { LoginDto } from './dto/login.dto';
import { HelperService } from 'src/helpers/helper.service';
import { SetPasswordDto } from './dto/setpassword.dto';
import { MailService } from '../helpers/mail.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { SendOtpDto } from './dto/send-opt.dto';
import * as jwt from 'jsonwebtoken';
import { User, UserDocument } from 'src/databases/models/user.schema';
import { Journey, JourneyDocument } from 'src/databases/models/journey.schema';
import { LinksManagement, LinksManagementModelName } from 'src/databases/models/links-management.schema';
import { FocusArea, FocusAreaDocument } from 'src/databases/models/focusarea.schema';
import { JourneyGuide } from 'src/databases/models/journeyguide.schema';
import { MyThoughtsAndInspirations } from 'src/databases/models/mythoughtsandinspirations.schema';
import { InspiringMedia } from 'src/databases/models/inspiringmedia.schema';
import { DeleteUserAccountDto } from './dto/delete-user-account.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AddAbundanceAreaDto } from './dto/add-abundance-area.dto';
import { AbundanceArea } from 'src/databases/models/abundancearea.schema';
import { UpdateAbundanceAreaDto } from './dto/update-abundance-area.dto';
import { ActionArea, ActionAreaDocument } from 'src/databases/models/actionarea.schema';
import { UpdateActionAreaDto } from './dto/update-action-area.dto';
import { GetActionAreaListingDto } from './dto/getactionarea-listing.dto';
import { Area, AreaDocument } from 'src/databases/models/area.schema';
import { QuoteManagement, QuoteManagementDocument } from 'src/databases/models/quote-management.schema';
import { JourneyInstruction, JourneyInstructionDocument } from 'src/databases/models/journeyInstruction.schema';
import { CreateSubAdminDto } from './dto/createsubadmin.dto';
import { UpdateSubAdminDto } from './dto/update-subadmin.dto';
import { UpdateSubAdminStatusDto } from './dto/update-subadmin-ststus.dto';
import { GetQuoteListDto } from './dto/get-quote-list.dto';

@Injectable()
export class AdminService {
  private accessTokens: string[] = [];
  private refreshTokens: string[] = [];
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Journey.name) private readonly journeyModel: Model<JourneyDocument>,
    @InjectModel(LinksManagementModelName) private readonly linksManagementModel: Model<LinksManagement>,
    @InjectModel(FocusArea.name) private readonly focusAreaModel: Model<FocusArea>,
    @InjectModel(JourneyGuide.name) private readonly journeyGuideModel: Model<JourneyGuide>,
    @InjectModel(MyThoughtsAndInspirations.name) private readonly myThoughtsAndInspirationsModel: Model<MyThoughtsAndInspirations>,
    @InjectModel(InspiringMedia.name) private readonly inspiringMediaModel: Model<InspiringMedia>,
    @InjectModel(AbundanceArea.name) private readonly abundanceAreaModel: Model<AbundanceArea>,
    @InjectModel(ActionArea.name) private readonly actionAreaModel: Model<ActionArea>,
    @InjectModel(Area.name) private readonly areaModel: Model<AreaDocument>,
    @InjectModel(QuoteManagement.name) private readonly quoteManagementModel: Model<QuoteManagementDocument>,
    @InjectModel(JourneyInstruction.name) private readonly journeyInstructionModel: Model<JourneyInstructionDocument>,
    private readonly jwtService: JwtService,
    private readonly helperService: HelperService,
    private readonly mailService: MailService,
  ) {}

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

  async otpSendIntoEmail(req): Promise<void> {
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
    await this.mailService.sendEmail(req); // This line sends the email
  }

  async login(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;
    const locals = this.helperService.getLocaleMessages();

    if (!email || !password) {
      return { message: locals.enter_username_password, success: false, data: null };
    }

    try {
      const admin = await this.adminModel.findOne({ email, deleted: false });

      if (!admin) {
        const checkRecord = await this.adminModel.findOne({ deleted: false });

        if (checkRecord) {
          return { message: locals.valid_email, success: false, data: null };
        } else {
          const hashedPassword = await bcrypt.hash(password, 10);
          const createRecord = await this.adminModel.create({
            email,
            password: hashedPassword,
            role: "1",
          });

          const accessToken = this.generateAccessToken({ admin: createRecord._id });
          const refreshToken = this.generateRefreshToken({ admin: createRecord._id });

          return {
            message: locals.admin_success,
            success: true,
            accessToken,
            refreshToken,
            user: createRecord,
            userType: "ADMIN",
          };
        }
      }

      if (admin.status === 'inactive') {
        return { message: locals.user_deactivated, success: false, data: {} };
      }

      const isPasswordValid = await bcrypt.compare(password, admin.password);

      if (!isPasswordValid) {
        return { message: locals.wrong_password, success: false, data: {} };
      }

      const accessToken = this.generateAccessToken({ admin: admin._id });
      const refreshToken = this.generateRefreshToken({ admin: admin._id });

      admin.lastLogin = new Date();
      await admin.save();

      return {
        message: locals.admin_success,
        success: true,
        accessToken,
        refreshToken,
        user: admin,
        userType: 'ADMIN',
      };

    } catch (error) {
      console.error('Error during login:', error);
      return { message: locals.something_went_wrong, success: false, data: {} };
    }
  }

  async setPassword(setPasswordDto: SetPasswordDto): Promise<any> {
    const locals = this.helperService.getLocaleMessages();

    try {
      const { email, password } = setPasswordDto;
      if (!email || !password) {
        return { message: locals.enter_all_field, success: false, data: null };
      }

      const checkUserExist = await this.adminModel.findOne({ email, deleted: false });
      if (!checkUserExist) {
        return { message: locals.user_not_found, success: false, data: null };
      }

      if (checkUserExist.otpVerify !== true) {
        return { message: locals.otp_not_verify, success: false, data: null };
      }

      const passwordHash = await bcrypt.hash(password, 10);
      await this.adminModel.updateOne({ _id: checkUserExist._id }, { $set: { password: passwordHash } });

      return { message: locals.password_update, success: true, data: null };
    } catch (error) {
      console.error('Error during setPassword:', error);
      return { message: locals.something_went_wrong, success: false, data: null };
    }
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<any> {
    const { email, otp } = verifyOtpDto;
    const locals = this.helperService.getLocaleMessages();

    if (!email || !otp) {
      return { message: locals.enter_all_field, success: false, data: null };
    }

    const checkUserExist = await this.adminModel.findOne({ email, deleted: false });

    if (!checkUserExist) {
      return { message: locals.user_not_found, success: false, data: null };
    }

    if (checkUserExist.otp != otp) { // Use loose equality here
      return { message: locals.otp_not_match, success: false, data: null };
    }

    await this.adminModel.updateOne(
      { _id: checkUserExist._id },
      { $set: { otp: 0, otpVerify: true } },
    );

    return { message: locals.verify_otp, success: true, data: null };
  }

  async sendOtp(sendOtpDto: SendOtpDto): Promise<any> {
    const locals = this.helperService.getLocaleMessages();

    const { email } = sendOtpDto;

    if (!email) {
      return {
        message: locals.enter_all_field,
        success: false,
        data: null,
      };
    }

    // Check if there are other fields provided in the DTO
    const fieldsCount = Object.keys(sendOtpDto).length;
    if (fieldsCount > 1) {
      return {
        message: locals.enter_all_field,
        success: false,
        data: null,
      };
    }

    try {
      const checkUserExist = await this.adminModel.findOne({ email, deleted: false });

      if (!checkUserExist) {
        throw new NotFoundException(locals.user_not_found);
      }

      const otp = await this.helperService.generateSixDigitRandomNumber();

      await this.otpSendIntoEmail({
        body: {
          type: 'sendOtp',
          emailOtp: otp,
          email,
        },
      });

      await this.adminModel.updateOne(
        { _id: checkUserExist._id },
        { $set: { otp, otpVerify: false } },
      );

      return {
        message: locals.otp_send,
        success: true,
        data: otp,
      };
    } catch (error) {
      console.error('Error during sendOtp:', error);
      throw new UnauthorizedException(locals.something_went_wrong);
    }
  }


  async updatePassword(email: string, password: string): Promise<any> {
    try {
      if (!email || !password) {
        return { message: 'Please enter both email and password', success: false, data: null };
      }

      const checkUserExist = await this.adminModel.findOne({ email, deleted: false });
      if (!checkUserExist) {
        return { message: 'User not found', success: false, data: null };
      }

      const passwordHash = password ? await bcrypt.hash(password, 10) : false;

      await this.adminModel.updateOne(
        { _id: checkUserExist._id },
        { $set: { password: passwordHash } },
      );
      return { message: 'Password updated successfully', success: true, data: null };
    } catch (err) {
      return { message: 'Something went wrong', success: false, data: null };
    }
  }

  async createSubAdmin(createSubAdminDto: CreateSubAdminDto): Promise<{ message: string; success: boolean; data: Admin }> {
    const locals = this.helperService.getLocaleMessages();

    const { fullName, email, password } = createSubAdminDto;

    if (![fullName, email, password].every(Boolean)) {
      throw new BadRequestException(locals.enter_all_field);
    }

    const existingAdmin = await this.adminModel.findOne({ email });
    if (existingAdmin) {
      throw new BadRequestException(locals.available_email);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newAdmin = await this.adminModel.create({
      fullName,
      email,
      password: passwordHash,
      role: 2,
      status: 'active',
    });

    return { message: locals.subadmin_added, success: true, data: newAdmin };
  }

  async updateSubAdmin(
    id: string,
    updateSubAdminDto: UpdateSubAdminDto
  ): Promise<{ message: string; success: boolean; data: any }> {
    const locals = this.helperService.getLocaleMessages();

    const { fullName, email, password } = updateSubAdminDto;

    if (![fullName, email].every(Boolean)) {
      throw new BadRequestException(locals.enter_all_filed);
    }

    const adminData = await this.adminModel.findById(id);
    if (!adminData) {
      throw new NotFoundException(locals.user_not_found);
    }

    const passwordHash = password ? await bcrypt.hash(password, 10) : adminData.password;

    const updatedSubAdmin = await this.adminModel.findByIdAndUpdate(
      id,
      {
        $set: {
          fullName,
          email,
          password: passwordHash,
        },
      },
      { new: true }
    );

    if (updatedSubAdmin) {
      return { message: locals.subadmin_updated, success: true, data: updatedSubAdmin };
    } else {
      throw new NotFoundException(locals.user_not_found);
    }
  }

  async updateProfileImage(id: string, avatar: string): Promise<{ message: string; success: boolean; data: any }> {
    try {
      const userData = await this.userModel.findByIdAndUpdate(
        id,
        { $set: { profileImage: avatar || '' } },
        { new: true }
      );

      if (userData) {
        return {
          message: 'Profile image updated successfully.',
          success: true,
          data: null,
        };
      } else {
        throw new NotFoundException('User not found.');
      }
    } catch (err) {
      console.error('Error in updating profile image:', err);
      throw new Error('Something went wrong. Please try again.');
    }
  }

  async getSubAdminDetails(id: string): Promise<{ message: string; success: boolean; data: AdminDocument }> {
    const locals = this.helperService.getLocaleMessages();

    // Check if sub-admin exists
    const adminUser = await this.adminModel.findById(id);
    if (!adminUser) {
      throw new NotFoundException(locals.user_not_found);
    }

    return { message: locals.subadmin_information, success: true, data: adminUser };
  }

  async getSubAdminUsers(
    page: number = 1,
    limit: number = 10,
    search: string = ''
  ): Promise<{ message: string; success: boolean; data: AdminDocument[]; totalPages: number; count: number; perPageData: number }> {
    const locals = this.helperService.getLocaleMessages();
    const sort: { [key: string]: SortOrder } = { createdDate: -1 }; // Sorting in descending order based on createdDate field
    let query;

    if (search) {
      query = {
        $or: [
          { fullName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { status: { $regex: search, $options: 'i' } },
        ],
        role: '2',
        deleted: false,
      };
    } else {
      query = { role: '2', deleted: false };
    }

    const skip = (page - 1) * limit;

    try {
      const results = await this.adminModel.find(query).skip(skip).limit(limit).sort(sort).exec();
      const count = await this.adminModel.countDocuments(query);
      const totalPages = Math.ceil(count / limit);

      return {
        success: true,
        message: locals.subadmin_user_list,
        data: results,
        totalPages,
        count,
        perPageData: limit,
      };
    } catch (error) {
      throw new BadRequestException(locals.something_went_wrong);
    }
  }

  async updateSubAdminStatus(id: string, updateSubAdminStatusDto: UpdateSubAdminStatusDto): Promise<{ message: string; success: boolean }> {
    const admin = await this.adminModel.findByIdAndUpdate(id, { status: updateSubAdminStatusDto.status });

    if (!admin) {
      throw new BadRequestException('User not found');
    }

    return { message: 'Sub admin status updated', success: true };
  }

  async deleteSubAdmin(id: string): Promise<{ message: string; success: boolean; data: null }> {
    const locals = this.helperService.getLocaleMessages();
    try {
      const admin = await this.adminModel.findByIdAndDelete(id).exec();
      if (!admin) {
        throw new NotFoundException(locals.record_not_found);
      }

      return { message: locals.subadmin_deleted, success: true, data: null };
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err; // Rethrow NotFoundException to handle it in the controller
      } else {
        throw new NotFoundException(locals.something_went_wrong); // Generic error message
      }
    }
  }


  async logout(authorizationHeader: string | undefined, requestBody: any): Promise<{ message: string; success: boolean; data: null }> {
    const locals = this.helperService.getLocaleMessages();

    try {
      if (!authorizationHeader) {
        throw new UnauthorizedException(locals.authorization_missing || 'Authorization header is missing.');
      }

      const adminUserData = await this.helperService.validateAdminToken(authorizationHeader);

      if (!requestBody || !requestBody.refreshToken || !requestBody.accessToken) {
        return {
          message: locals.enter_token,
          success: false,
          data: null,
        };
      }

      // Verify if both tokens exist in the respective arrays
      const validRefreshToken = this.refreshTokens.includes(requestBody.refreshToken);
      const validAccessToken = this.accessTokens.includes(requestBody.accessToken);

      if (!validRefreshToken || !validAccessToken) {
        return {
          message: locals.invalid_token,
          success: false,
          data: null,
        };
      }

      // Remove tokens from arrays
      this.refreshTokens = this.refreshTokens.filter((token) => token !== requestBody.refreshToken);
      this.accessTokens = this.accessTokens.filter((token) => token !== requestBody.accessToken);

      return {
        message: locals.logout,
        success: true,
        data: null,
      };
    } catch (err) {
      console.error('Error during logout:', err);
      throw new UnauthorizedException(locals.something_went_wrong);
    }
  }

  async generateTokenByRefreshToken(refreshToken: string): Promise<{ message: string; success: boolean; accessToken?: string; refreshToken?: string; userType?: string }> {
    const locals = this.helperService.getLocaleMessages();

    try {
      if (!refreshToken) {
        throw new BadRequestException(locals.enter_all_field || 'Please provide a refresh token.');
      }

      return new Promise((resolve, reject) => {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded: any) => {
          if (err) {
            reject(new UnauthorizedException(locals.token_invalid || 'Invalid refresh token.'));
          } else {
            const adminUser = await this.adminModel.findOne({ _id: decoded.admin });

            if (!adminUser) {
              reject(new UnauthorizedException(locals.user_not_found || 'Admin user not found.'));
            }

            const newAccessToken = this.generateAccessToken({ admin: adminUser._id });
            const newRefreshToken = this.generateRefreshToken({ admin: adminUser._id });

            resolve({
              message: locals.admin_refresh_token || 'New tokens generated successfully.',
              success: true,
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
              userType: 'ADMIN',
            });
          }
        });
      });
    } catch (error) {
      console.error('Error during token generation:', error);
      throw new BadRequestException(locals.something_went_wrong || 'Something went wrong.');
    }
  }


  async changePassword(req: any, oldPassword: string, newPassword: string): Promise<{ message: string; success: boolean; data: null }> {
    const locals = this.helperService.getLocaleMessages();

    try {
      const adminUserData = await this.helperService.validateAdminToken(req.headers.authorization);

      if (![newPassword, oldPassword].every(Boolean)) {
        throw new BadRequestException(locals.enter_all_filed || 'Please enter all fields.');
      }

      const adminDoc = await this.adminModel.findOne({ _id: adminUserData._id });

      if (!adminDoc) {
        throw new UnauthorizedException(locals.user_not_found || 'Admin user not found.');
      }

      const passwordMatch = await bcrypt.compare(oldPassword, adminDoc.password);

      if (passwordMatch) {
        const passwordHash = await bcrypt.hash(newPassword, 10);
        await this.adminModel.updateOne(
          { _id: adminUserData._id },
          { $set: { password: passwordHash } }
        );

        return {
          message: locals.password_change || 'Password changed successfully.',
          success: true,
          data: null,
        };
      } else {
        throw new UnauthorizedException(locals.wrong_password || 'Incorrect old password.');
      }
    } catch (error) {
      throw new BadRequestException(error.response || 'Something went wrong.');
    }
  }


  async list(): Promise<any> {
    const locals = this.helperService.getLocaleMessages();

    try {
      const userCount = await this.userModel.countDocuments({ deleted: false });

      const journeyCounts = await Promise.all([
        this.journeyModel.countDocuments({ deleted: false }),
        this.journeyModel.countDocuments({ deleted: false, status: "active" }),
        this.journeyModel.countDocuments({ deleted: false, status: "paused" }),
        this.journeyModel.countDocuments({ deleted: false, status: "completed" }),
        this.journeyModel.countDocuments({ deleted: false, status: "archived" }),
      ]);

      return {
        message: locals.master_data_fetched || 'Master data fetched successfully.',
        success: true,
        data: {
          userCount,
          journeyTotalCount: journeyCounts[0],
          journeyActiveCount: journeyCounts[1],
          journeyPausedCount: journeyCounts[2],
          journeyCompleteCount: journeyCounts[3],
          journeyArchiveCount: journeyCounts[4],
          teamCount: 0, // Placeholder for team count
        },
      };
    } catch (error) {
      console.error('Error during list:', error);
      throw new BadRequestException(locals.something_went_wrong || 'Something went wrong.');
    }
  }

  async linkAddUpdate(req: any): Promise<any> {
    const locals = this.helperService.getLocaleMessages();

    try {
      // Validate admin token using helper service
      let adminUserData = await this.helperService.validateAdminToken(req.headers.authorization);

      // Set updatedDate to current date
      req.body.updatedDate = new Date();

      if (req.body.id) {
        // Update existing document
        await this.linksManagementModel.updateOne({ _id: req.body.id }, { $set: req.body });
        return { message: locals.link_management_updated, success: true, data: null };
      } else {
        // Create new document
        await this.linksManagementModel.create(req.body);
        return { message: locals.link_management_added, success: true, data: null };
      }
    } catch (err) {
      console.error('Error in linkAddUpdate:', err);
      throw new BadRequestException(locals.something_went_wrong);
    }
  }

  async linkget(): Promise<any> {
    const locals = this.helperService.getLocaleMessages();

    try {
      let link: LinksManagement | null = await this.linksManagementModel.findOne().sort({ createdDate: -1 }).exec();

      if (!link) {
        link = new this.linksManagementModel({
          privacy_policy: '',
          terms_conditions: '',
        });
      }

      return {
        message: locals.link_management_fetched,
        success: true,
        data: link,
      };
    } catch (err) {
      console.error('Error in linkGet:', err);
      throw new BadRequestException(locals.something_went_wrong);
    }
  }

  async addAbundanceArea(addAbundanceAreaDto: AddAbundanceAreaDto): Promise<any> {
    const locals = this.helperService.getLocaleMessages();

    const { title, status, colourCode } = addAbundanceAreaDto;
    if (![title, status, colourCode].every(Boolean)) {
      return {
        message: locals.enter_all_filed,
        success: false,
        data: null,
      };
    }

    const existRecord = await this.abundanceAreaModel.findOne({ title: addAbundanceAreaDto.title });
    if (existRecord) {
      return {
        message: locals.record_exists,
        success: false,
        data: null,
      };
    }

    await this.abundanceAreaModel.create(addAbundanceAreaDto);
    return {
      message: locals.abundance_area_created,
      success: true,
      data: null,
    };
  }

  async updateAbundanceArea(
    authorization: string,
    id: string,
    updateData: Partial<UpdateAbundanceAreaDto>
  ): Promise<{ message: string; success: boolean }> {
    const { title, status, colourCode, description, helpText } = updateData;

    // Validate admin token
    const adminUserData = await this.helperService.validateAdminToken(authorization);

    // Get localized messages
    const locals = this.helperService.getLocaleMessages();

    // Check if all required fields are present
    if (![id, title, status, colourCode].every(Boolean)) {
      return { message: locals.enter_all_field, success: false };
    }

    // Find the existing record by ID
    const existingRecord = await this.abundanceAreaModel.findById(id);
    if (!existingRecord) {
      return { message: locals.record_not_found, success: false };
    }

    // Check if the new title already exists for other records
    const titleExists = await this.abundanceAreaModel.exists({ title, _id: { $ne: id } });
    if (titleExists) {
      return { message: locals.record_exists, success: false };
    }

    // Update the record
    existingRecord.title = title;
    existingRecord.status = status;
    existingRecord.description = description || '';
    existingRecord.helpText = helpText || '';

    await existingRecord.save();

    return { message: locals.abundance_area_updated, success: true };
  }

  async deleteAbundanceArea(id: string): Promise<{ message: string; success: boolean; data: null }> {
    try {
      const locals = this.helperService.getLocaleMessages();

      const result = await this.abundanceAreaModel.deleteOne({ _id: id }).exec();
      if (result.deletedCount === 0) {
        throw new NotFoundException(locals.record_not_found);
      }

      return { message: locals.abundance_area_deleted, success: true, data: null };
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      } else {
        const locals = this.helperService.getLocaleMessages();
        throw new NotFoundException(locals.something_went_wrong);
      }
    }
  }

  async getAbundanceAreaDetails(id: string): Promise<{ message: string; success: boolean; data: AbundanceArea }> {
    try {
      const isRecordExists = await this.abundanceAreaModel
        .findById(id)
        .populate('userId', ['userName', 'email'])
        .select(['title', 'status', 'colourCode', 'createdDate', 'description', 'helpText', 'type', 'userId']);

      if (!isRecordExists) {
        return { message: 'Abundance area not found', success: false, data: null };
      }

      return { message: 'Focus area details', success: true, data: isRecordExists };
    } catch (err) {
      console.error('Error fetching abundance area details:', err);
      throw new Error('Something went wrong');
    }
  }

  async getAbundanceAreaListing(page: number = 1, limit: number = 10, titleFilter: string = '') {
    try {
      // Calculate offset
      const offset = (page - 1) * limit;

      // Filter the data by title
      const filteredData = await this.abundanceAreaModel
        .find({
          title: { $regex: titleFilter, $options: 'i' },
          deleted: false,
        })
        .populate('userId', ['userName', 'email'])
        .sort({ createdDate: -1 })
        .select(['title', 'status', 'colourCode', 'createdDate', 'description', 'helpText', 'type', 'userId']);

      // Paginate the filtered data
      const paginatedData = filteredData.slice(offset, offset + limit);

      return {
        message: 'Abundance area listing',
        success: true,
        page: page,
        limit: limit,
        totalItems: filteredData.length,
        totalPages: Math.ceil(filteredData.length / limit),
        data: paginatedData,
      };
    } catch (err) {
      console.error('Error fetching abundance area listing:', err);
      throw new Error('Something went wrong');
    }
  }

  async addFocusArea(data: Partial<FocusArea>): Promise<{ message: string; success: boolean; data: null }> {
    try {
      // Check required fields
      const { title, status, abundanceAreaId } = data;
      if (![title, status, abundanceAreaId].every(Boolean)) {
        return { message: 'Please enter all fields', success: false, data: null };
      }

      // Check if title already exists
      const checkTitleExist = await this.focusAreaModel.findOne({ title, type: 'admin', deleted: false });
      if (checkTitleExist) {
        return { message: 'Record already exists', success: false, data: null };
      }

      // Create new focus area
      await this.focusAreaModel.create(data);
      return { message: 'Focus area created successfully', success: true, data: null };
    } catch (err) {
      console.error('Error adding focus area:', err);
      throw new Error('Something went wrong');
    }
  }

  async updateFocusArea(data: Partial<FocusArea>): Promise<{ message: string; success: boolean; data: null }> {
    try {
      const { id, title, status } = data as { id: ObjectId; title: string; status: string };

      // Validate required fields
      if (![id, title, status].every(Boolean)) {
        return { message: 'Please enter all fields', success: false, data: null };
      }

      // Check if the record exists
      const recordExists = await this.focusAreaModel.findOne({ _id: id, type: 'admin', deleted: false });
      if (!recordExists) {
        return { message: 'Record not found', success: false, data: null };
      }

      // Check if the new title already exists for other records
      const titleExists = await this.focusAreaModel.exists({ title, _id: { $ne: id } });
      if (titleExists) {
        return { message: 'Record with this title already exists', success: false, data: null };
      }

      // Update the focus area
      recordExists.title = title;
      recordExists.status = status;
      recordExists.helpText = data.helpText || recordExists.helpText;
      recordExists.description = data.description || recordExists.description;
      await recordExists.save();

      return { message: 'Focus area updated successfully', success: true, data: null };
    } catch (err) {
      console.error('Error updating focus area:', err);
      throw new Error('Something went wrong');
    }
  }

  async deleteFocusArea(id: string): Promise<{ message: string; success: boolean; data: null }> {
    const locals = this.helperService.getLocaleMessages();
    try {

      const result = await this.focusAreaModel.deleteOne({ _id: id }).exec();
      if (result.deletedCount === 0) {
        throw new NotFoundException(locals.record_not_found);
      }

      return { message: locals.focus_area_deleted, success: true, data: null };
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err; // Rethrow NotFoundException to handle it in the controller
      } else {
        const locals = this.helperService.getLocaleMessages();
        throw new NotFoundException(locals.something_went_wrong); // Generic error message
      }
    }
  }

  async getFocusAreaDetails(id: string): Promise<{ message: string; success: boolean; data: FocusAreaDocument | null }> {
    const locals = this.helperService.getLocaleMessages();
    try {
      const isRecordExists = await this.focusAreaModel
        .findById(id)
        .populate({
          path: 'abundanceAreaId',
          select: 'title name status createdDate description helpText type userId',
        })
        .populate('userId', ['userName', 'email'])
        .select(['title', 'status', 'createdDate', 'description', 'helpText', 'type', 'userId']);

      if (!isRecordExists) {
        return { message: locals.record_not_found, success: false, data: null };
      }

      return { message: locals.focus_area_details, success: true, data: isRecordExists };
    } catch (err) {
      console.error('Error fetching focus area details:', err);
      throw new Error(locals.something_went_wrong);
    }
  }


  async getFocusAreaListing(queryParams: any): Promise<any> {
    const locals = this.helperService.getLocaleMessages();
    try {
      // Get query parameters
      const condition: any = { deleted: false };
      const page = parseInt(queryParams.page, 10) || 1;
      const limit = parseInt(queryParams.limit, 10) || 10;

      if (queryParams.abundanceAreaId) {
        condition.abundanceAreaId = queryParams.abundanceAreaId;
      }
      if (queryParams.title) {
        condition.title = { $regex: queryParams.title, $options: 'i' };
      }

      // Calculate offset
      const offset = (page - 1) * limit;

      // Fetch filtered data with population
      const filteredData = await this.focusAreaModel
        .find(condition)
        .populate({
          path: 'abundanceAreaId',
          select: 'title name status createdDate description helpText type userId',
        })
        .populate('userId', ['userName', 'email'])
        .sort({ createdDate: -1 })
        .select(['title', 'status', 'createdDate', 'description', 'helpText', 'type', 'userId'])
        .exec();

      // Paginate the filtered data
      const paginatedData = filteredData.slice(offset, offset + limit);

      // Send the paginated and filtered data as the API response
      return {
        message: locals.focus_area_listing,
        success: true,
        page: page,
        limit: limit,
        totalItems: filteredData.length,
        totalPages: paginatedData.length === 0 ? 1 : Math.ceil(filteredData.length / limit),
        data: paginatedData,
      };
    } catch (err) {
      console.error('Error fetching focus area listing:', err);
      throw new Error(locals.something_went_wrong);
    }
  }

  async addActionArea(data: Partial<ActionArea>): Promise<{ message: string; success: boolean; data: null }> {
    try {
      const { title, status, focusAreaId } = data;
      if (![title, status, focusAreaId].every(Boolean)) {
        return { message: 'Please enter all fields', success: false, data: null };
      }

      const checkTitleExist = await this.actionAreaModel.findOne({ title, type: 'admin', deleted: false });
      if (checkTitleExist) {
        return { message: 'Record already exists', success: false, data: null };
      }

      await this.actionAreaModel.create(data);

      return { message: 'Action area created successfully', success: true, data: null };
    } catch (err) {
      console.error('Error adding action area:', err);
      throw new Error('Something went wrong');
    }
  }

  async updateActionArea(updateActionAreaDto: UpdateActionAreaDto): Promise<{ message: string; success: boolean; data: null }> {
    try {
      const { id, title, status, description, helpText } = updateActionAreaDto;

      // Find the action area by id
      const actionArea = await this.actionAreaModel.findOne({ _id: id, type: 'admin', deleted: false });

      // If action area not found, return error response
      if (!actionArea) {
        return { message: 'Record not found', success: false, data: null };
      }

      // Check if the new title already exists for other records
      const titleExists = await this.actionAreaModel.exists({ title, _id: { $ne: id } });

      if (titleExists) {
        return { message: 'Record with this title already exists', success: false, data: null };
      }

      // Update action area fields
      actionArea.title = title;
      actionArea.status = status;
      actionArea.description = description;
      actionArea.helpText = helpText;

      // Save updated action area
      await actionArea.save();

      return { message: 'Action area updated successfully', success: true, data: null };
    } catch (error) {
      console.error('Error updating action area:', error);
      throw new Error('Something went wrong');
    }
  }

  async deleteActionArea(id: string): Promise<{ message: string; success: boolean; data: null }> {
    const locals = this.helperService.getLocaleMessages();
    try {

      const result = await this.actionAreaModel.deleteOne({ _id: id }).exec();
      if (result.deletedCount === 0) {
        throw new NotFoundException(locals.record_not_found);
      }

      return { message: locals.focus_area_deleted, success: true, data: null };
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err; // Rethrow NotFoundException to handle it in the controller
      } else {
        const locals = this.helperService.getLocaleMessages();
        throw new NotFoundException(locals.something_went_wrong); // Generic error message
      }
    }
  }

  async getActionAreaDetails(id: string): Promise<{ message: string; success: boolean; data: ActionAreaDocument | null }> {
    const locals = this.helperService.getLocaleMessages();

    try {
      const isRecordExists = await this.actionAreaModel
        .findById(id)
        .populate({
          path: 'focusAreaId',
          select: 'title name status createdDate description helpText type userId',
        })
        .populate('userId', ['userName', 'email'])
        .select(['title', 'status', 'createdDate', 'description', 'helpText', 'type', 'userId'])
        .exec();


      if (!isRecordExists) {
        return { message: locals.record_not_found, success: false, data: null };
      }

      return { message: locals.action_area_details, success: true, data: isRecordExists };
    } catch (err) {
      console.error('Error fetching action area details:', err);
      throw new Error(locals.something_went_wrong);
    }
  }

  async getActionAreaListing(query: GetActionAreaListingDto): Promise<any> {
    const locals = this.helperService.getLocaleMessages();
    const { title, focusAreaId, page = 1, limit = 10 } = query;
    const condition: any = { deleted: false };

    if (focusAreaId) condition.focusAreaId = focusAreaId;
    if (title) condition.title = { $regex: title, $options: 'i' };

    const skip = (page - 1) * limit;

    try {
      console.log('Fetching action area with condition:', condition); // Log the condition
      const totalItems = await this.actionAreaModel.countDocuments(condition);
      const paginatedData = await this.actionAreaModel
        .find(condition)
        .populate({
          path: 'focusAreaId',
          select: 'title name status createdDate description helpText type userId',
        })
        .populate('userId', ['userName', 'email'])
        .sort({ createdDate: -1 })
        .select(['title', 'status', 'createdDate', 'description', 'helpText', 'type', 'userId'])
        .skip(skip)
        .limit(limit)
        .exec();

      console.log('Total items:', totalItems);
      console.log('Paginated data:', paginatedData);
      console.log('ActionAreaModel:', this.actionAreaModel);
      console.log('Condition:', condition);

      return {
        message: locals.action_area_listing,
        success: true,
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        data: paginatedData,
      };
    } catch (err) {
      console.error('Error fetching action area listing:', err);
      throw new Error(locals.something_went_wrong);
    }
  }

  async getUserListing(): Promise<{ message: string; success: boolean; data: User[] }> {
    const locals = this.helperService.getLocaleMessages();
    try {
      const userData = await this.userModel
        .find({ deleted: false })
        .sort({ createdDate: -1 })
        .select('userName')
        .exec();

      return {
        message: locals.user_list,
        success: true,
        data: userData,
      };
    } catch (err) {
      console.error('Error fetching user list:', err);
      throw new Error(locals.something_went_wrong);
    }
  }

  async updateJourney(id: string, updateDto: any): Promise<{ message: string; success: boolean; data: any }> {
    const locals = this.helperService.getLocaleMessages();
    try {
      if (!id) {
        return {
          message: locals.enter_all_filed,
          success: false,
          data: null,
        };
      }

      updateDto.updatedDate = new Date();

      await this.journeyModel.updateOne({ _id: id }, { $set: updateDto });

      return {
        message: locals.journey_updated,
        success: true,
        data: null,
      };
    } catch (err) {
      console.error('Error updating journey:', err);
      throw new Error(locals.something_went_wrong);
    }
  }


  async updateUser(updateUserDto: UpdateUserDto, files: any): Promise<any> {
    const locals = this.helperService.getLocaleMessages();

    const { id } = updateUserDto;
    if (![id].every(Boolean)) {
      return {
        message: locals.id_required,
        success: false,
        data: null,
      };
    }

    if (files) {
      if (files.profileImage) updateUserDto.profileImage = files.profileImage[0].filename;
    }

    const userExist = await this.userModel.findById(id);
    if (!userExist) {
      return {
        message: locals.user_not_found,
        success: false,
        data: null,
      };
    }

    if (updateUserDto.status == 'active') {
      updateUserDto.deleted = false;
      updateUserDto.deletedAt = null;
    }

    const userData = await this.userModel.updateOne({ _id: userExist._id }, { $set: updateUserDto });
    if (userData) {
      return {
        message: locals.user_profile_updated,
        success: true,
        data: {},
      };
    } else {
      return {
        message: locals.user_not_found,
        success: false,
        data: null,
      };
    }
  }

  async deleteUserAccount(deleteUserAccountDto: DeleteUserAccountDto): Promise<any> {
    const locals = this.helperService.getLocaleMessages();
    const { userId } = deleteUserAccountDto;

    const userData = await this.userModel.findOne({ _id: userId });
    if (!userData) {
      throw new BadRequestException(locals.user_not_found);
    }

    await this.userModel.updateOne({ _id: userId }, { $set: { deleted: true, deletedAt: Date.now(), status: "deleted" } });
    await this.focusAreaModel.updateOne({ userId: userId }, { $set: { deleted: true, deletedAt: Date.now() } });
    await this.journeyModel.updateOne({ userId: userId }, { $set: { deleted: true, deletedAt: Date.now() } });
    await this.journeyGuideModel.updateOne({ userId: userId }, { $set: { deleted: true, deletedAt: Date.now() } });
    await this.myThoughtsAndInspirationsModel.updateOne({ userId: userId }, { $set: { deleted: true, deletedAt: Date.now() } });
    await this.inspiringMediaModel.updateOne({ userId: userId }, { $set: { deleted: true, deletedAt: Date.now() } });

    return {
      message: locals.delete_account,
      success: true,
      data: null,
    };
  }

  async listOfArea(): Promise<{ message: string; success: boolean; data: any }> {
    const locals = this.helperService.getLocaleMessages();
    try {
      const areas = await this.areaModel.find({ status: 'active' }).select(['areaName', 'status']).exec();
      return {
        message: locals.record_fetch,
        success: true,
        data: areas,
      };
    } catch (err) {
      console.error('Error fetching list of areas:', err);
      throw new Error(locals.something_went_wrong);
    }
  }


  // async quoteAddUpdate(data: any): Promise<{ message: string; success: boolean; data: any }> {
  //   const locals = this.helperService.getLocaleMessages();
  //   try {
  //     if (data.journeyscreenarea) {
  //       let areaExist;

  //       if (data.created) {
  //         areaExist = await this.areaModel.create(data);
  //         return {
  //           message: locals.record_create,
  //           success: true,
  //           data: areaExist,
  //         };
  //       }

  //       if (data.deleted) {
  //         areaExist = await this.areaModel.deleteOne({ areaName: data.areaName });
  //         return {
  //           message: locals.record_delete,
  //           success: true,
  //           data: areaExist,
  //         };
  //       }
  //     }

  //     const { quote, author, areaId } = data;

  //     if (![quote, author, areaId].every(Boolean)) {
  //       return {
  //         message: locals.id_required,
  //         success: false,
  //         data: null,
  //       };
  //     }

  //     const area = await this.areaModel.findById(areaId);

  //     if (!area) {
  //       return {
  //         message: locals.enter_valid_Id,
  //         success: false,
  //         data: null,
  //       };
  //     }

  //     if (!data.id) {
  //       await this.quoteManagementModel.create(data);
  //     } else {
  //       await this.quoteManagementModel.updateOne({ _id: data.id }, { $set: data });
  //     }

  //     const newQuote = await this.quoteManagementModel.create(data);
  //     return {
  //       message: locals.quote_added,
  //       success: true,
  //       data: newQuote,
  //     };
  //   } catch (err) {
  //     console.error('Error in quoteAddUpdate:', err);
  //     throw new Error(locals.something_went_wrong);
  //   }
  // }

  // async quoteAddUpdate(data: any): Promise<{ message: string; success: boolean; data: any }> {
  //   const locals = this.helperService.getLocaleMessages();
  //   try {
  //     const { quote, author, areaId, id } = data;

  //     // Validate required fields for adding a new quote
  //     if (![quote, author, areaId].every(Boolean)) {
  //       throw new BadRequestException(locals.id_required);
  //     }

  //     // Check if an id is provided; if yes, update the existing quote
  //     if (id) {
  //       const updatedQuote = await this.quoteManagementModel.findByIdAndUpdate(id, data, { new: true });

  //       if (!updatedQuote) {
  //         throw new BadRequestException(locals.enter_valid_Id); // Handle if the quote with given id is not found
  //       }

  //       return {
  //         message: locals.quote_updated,
  //         success: true,
  //         data: updatedQuote,
  //       };
  //     }

  //     // If no id is provided, create a new quote
  //     const newQuote = await this.quoteManagementModel.create(data);

  //     return {
  //       message: locals.quote_added,
  //       success: true,
  //       data: newQuote,
  //     };
  //   } catch (err) {
  //     console.error('Error in quoteAddUpdate:', err);
  //     throw new BadRequestException(locals.something_went_wrong); // Handle generic error
  //   }
  // }


  async quoteAddUpdate(data: any): Promise<{ message: string; success: boolean; data: any }> {
    const locals = this.helperService.getLocaleMessages();
    try {
      const { id, quote, author, areaId } = data;

      // If `id` is provided, update existing quote; otherwise, create new quote
      if (id) {
        const existingQuote = await this.quoteManagementModel.findById(id);

        if (!existingQuote) {
          throw new BadRequestException(locals.enter_valid_Id);
        }

        // Update existing quote fields
        existingQuote.quote = quote;
        existingQuote.author = author;
        existingQuote.areaId = areaId;

        await existingQuote.save();

        return {
          message: locals.quote_updated,
          success: true,
          data: existingQuote,
        };
      } else {
        // Create new quote if `id` is not provided
        const newQuote = await this.quoteManagementModel.create({
          quote,
          author,
          areaId,
        });

        return {
          message: locals.quote_added,
          success: true,
          data: newQuote,
        };
      }
    } catch (err) {
      console.error('Error in quoteAddUpdate:', err);
      throw new BadRequestException(locals.something_went_wrong);
    }
  }

  

  async quoteListByAreaId(areaId: string, page: number = 1, limit: number = 10, dto: GetQuoteListDto): Promise<any> {
    try {
      const areaExist = await this.areaModel.findById(areaId);
      if (!areaExist) {
        throw new NotFoundException('Invalid areaId provided.');
      }

      const { status, quote } = dto;
      const conditions: any = { deleted: false, areaId };

      if (status) {
        conditions.status = status;
      }

      if (quote) {
        conditions.quote = { $regex: quote, $options: 'i' };
      }

      this.logger.log(`Query condition: ${JSON.stringify(conditions)}`);

      const totalItems = await this.quoteManagementModel.countDocuments(conditions);
      const totalPages = Math.ceil(totalItems / limit);
      const offset = (page - 1) * limit;

      const data = await this.quoteManagementModel.find(conditions)
        .select('author quote source areaId status date')
        .skip(offset)
        .limit(limit)
        .exec();

      this.logger.log(`Total items found: ${totalItems}`);
      this.logger.log(`Data fetched: ${JSON.stringify(data)}`);

      return {
        message: 'Data fetch Successfully',
        success: true,
        page,
        limit,
        totalItems,
        totalPages,
        data,
      };
    } catch (err) {
      this.logger.error(`Error in quoteListByAreaId: ${err.message}`);
      throw new BadRequestException('Failed to fetch quotes. Please try again later.');
    }
  }


  async configKey(keyId: string): Promise<any> {
    try {
      const configDetailsKey = process.env.CONFIG_DETAILS_KEY;

      if (!keyId) {
        throw new Error('Please provide a keyId');
      }

      if (!configDetailsKey) {
        throw new Error('Configuration key not found in environment variables');
      }

      const isValidKey = await bcrypt.compare(configDetailsKey, keyId);

      if (isValidKey) {
        return {
          message: 'Configuration details fetched successfully.',
          success: true,
          data: {
            "AWS_ACCESS_KEY_ID": process.env.AWS_ACCESS_KEY_ID,
            "AWS_SECRET_ACCESS_KEY": process.env.AWS_SECRET_ACCESS_KEY,
            "AWS_REGION": process.env.AWS_REGION,
            "AWS_BUCKET": process.env.AWS_BUCKET,
            "AWS_ENDPOINT": process.env.AWS_ENDPOINT,
            "CDN_URL": process.env.CDN_URL,
            "ACL": process.env.ACL
          }
        };
      } else {
        return {
          message: 'Invalid configuration key provided.',
          success: false,
          data: null,
        };
      }
    } catch (err) {
      console.error('Error fetching configuration details:', err);
      throw new Error('Failed to fetch configuration details. Please try again later.');
    }
  }

  async addJourneyInstruction(instructionData: JourneyInstruction): Promise<any> {
    try {
      const { instruction, title, id, sequence } = instructionData;

      if (![instruction, title].every(Boolean)) {
        throw new Error('Please enter all required fields.');
      }

      if (id) {
        const existingInstruction = await this.journeyInstructionModel.findById(id);
        if (!existingInstruction) {
          throw new NotFoundException('Instruction not found.');
        }

        // Update fields
        existingInstruction.instruction = instruction;
        existingInstruction.title = title;
        existingInstruction.sequence = sequence || existingInstruction.sequence; // Update sequence if provided
        existingInstruction.updatedDate = new Date();

        // Save updated instruction
        const updatedInstruction = await existingInstruction.save();

        return {
          message: 'Instruction updated successfully.',
          success: true,
          data: updatedInstruction,
        };
      } else {
        // Create new instruction
        const newInstruction = await this.journeyInstructionModel.create(instructionData);

        return {
          message: 'Instruction created successfully.',
          success: true,
          data: newInstruction,
        };
      }
    } catch (err) {
      console.error('Error in addJourneyInstruction:', err);
      throw new Error('Something went wrong. Please try again.');
    }
  }

  async listJourneyInstruction(): Promise<{ message: string; success: boolean; data: JourneyInstruction[] }> {
    try {
      const data = await this.journeyInstructionModel.find({ deleted: false }).exec();
      return {
        message: 'Instruction list fetched successfully.',
        success: true,
        data: data,
      };
    } catch (err) {
      console.error('Error in listing journey instructions:', err);
      throw new Error('Failed to fetch journey instructions. Please try again later.');
    }
  }
}