import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Admin, AdminDocument } from '../databases/models/admin.schema';
import { User, UserDocument } from '../databases/models/user.schema';
import { validate } from 'class-validator';

@Injectable()
export class HelperService {
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService
  ) {}

  makeId(length: number): string {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  generateSixDigitRandomNumber(): number {
    const min = 100000;
    const max = 999999;
    const range = max - min;
    const byteLength = Math.ceil(Math.log2(range + 1) / 8);
    const randomBytes = crypto.randomBytes(byteLength);
    const randomNumber = randomBytes.readUIntBE(0, byteLength) % range + min;
    return randomNumber;
  }

  getLocaleMessages(language: string = 'en'): any {
    const filePath = join(__dirname, '..', 'locals', `${language}.json`);
    const data = readFileSync(filePath, 'utf-8');  // Specify encoding here
    return JSON.parse(data);
  }

  // async validateAdminToken(authorization: string): Promise<AdminDocument> {
  //   if (!authorization || typeof authorization !== 'string') {
  //     throw new UnauthorizedException('Authorization header missing or invalid.');
  //   }

  //   const token = authorization.split(' ')[1];
  //   const decoded = this.jwtService.verify(token, { secret: process.env.ACCESS_TOKEN_SECRET });

  //   if (decoded.admin) {
  //     const userDetails = await this.adminModel.findOne({ _id: decoded.admin });
  //     if (!userDetails) {
  //       throw new UnauthorizedException('Admin not found.');
  //     }
  //     return userDetails;
  //   } else {
  //     throw new UnauthorizedException('Invalid token.');
  //   }
  // }

  async validateAdminToken(authorization: string): Promise<AdminDocument> {
    if (!authorization || typeof authorization !== 'string') {
      throw new UnauthorizedException('Authorization header missing or invalid.');
    }

    const token = authorization.split(' ')[1];
    const decoded = this.jwtService.verify(token, { secret: process.env.ACCESS_TOKEN_SECRET });

    if (decoded.admin) {
      const userDetails = await this.adminModel.findOne({ _id: decoded.admin });
      if (!userDetails) {
        throw new UnauthorizedException('Admin not found.');
      }
      return userDetails;
    } else {
      throw new UnauthorizedException('Invalid token.');
    }
  }

  async validateDto(dto: any): Promise<string[]> {
    const errors = await validate(dto);
    return errors.map(error => Object.values(error.constraints)).flat();
  }

  // async validateUser(req: any): Promise<UserDocument> {
  //   const locals = this.getLocaleMessages();
  //   const userToken = req.headers.authorization;
  //   if (!userToken) {
  //     throw new UnauthorizedException(locals.authorization_missing || 'Authorization header is missing.');
  //   }
  //   const tokenParts = userToken.split(' ');
  //   if (tokenParts.length !== 2) {
  //     throw new UnauthorizedException(locals.invalid_token_format || 'Invalid token format.');
  //   }
  //   const token = tokenParts[1];
  //   try {
  //     const decoded = this.jwtService.verify(token, { secret: process.env.ACCESS_TOKEN_SECRET });
  //     if (decoded.userId) {
  //       const userData = await this.userModel.findOne({ _id: decoded.userId });
  //       if (!userData) {
  //         throw new UnauthorizedException(locals.user_not_found || 'User not found.');
  //       }
  //       return userData;
  //     } else {
  //       throw new UnauthorizedException(locals.invalid_token || 'Invalid token.');
  //     }
  //   } catch (error) {
  //     throw new UnauthorizedException(locals.invalid_token || 'Invalid token.');
  //   }
  // }

  // async validateUser(req: any): Promise<UserDocument> {
  //   const locals = this.getLocaleMessages();
  //   const userToken = req.headers.authorization;
  //   if (!userToken) {
  //     throw new UnauthorizedException(locals.authorization_missing || 'Authorization header is missing.');
  //   }
  //   const tokenParts = userToken.split(' ');
  //   if (tokenParts.length !== 2) {
  //     throw new UnauthorizedException(locals.invalid_token_format || 'Invalid token format.');
  //   }
  //   const token = tokenParts[1];
  //   try {
  //     const decoded = this.jwtService.verify(token, { secret: process.env.ACCESS_TOKEN_SECRET });
  //     console.log('Decoded token:', decoded);
  //     if (decoded.userId) {
  //       const userData = await this.userModel.findOne({ _id: decoded.userId });
  //       if (!userData) {
  //         throw new UnauthorizedException(locals.user_not_found || 'User not found.');
  //       }
  //       return userData;
  //     } else {
  //       throw new UnauthorizedException(locals.invalid_token || 'Invalid token.');
  //     }
  //   } catch (error) {
  //     console.error('Token verification error:', error);
  //     throw new UnauthorizedException(locals.invalid_token || 'Invalid token.');
  //   }
  // }

  // async validateUser(req: any): Promise<UserDocument> {
  //   const authHeader = req.headers.authorization;

  //   if (!authHeader || !authHeader.startsWith('Bearer ')) {
  //     throw new UnauthorizedException('Authorization header is missing or invalid.');
  //   }

  //   const token = authHeader.split(' ')[1];

  //   try {
  //     const decoded: any = this.jwtService.verify(token, { secret: process.env.ACCESS_TOKEN_SECRET });

  //     if (!decoded || !decoded.userId) {
  //       throw new UnauthorizedException('Invalid token structure.');
  //     }

  //     const userData = await this.userModel.findById(decoded.userId);

  //     if (!userData) {
  //       throw new UnauthorizedException('User not found.');
  //     }

  //     return userData;
  //   } catch (error) {
  //     console.error('Token verification error:', error);
  //     throw new UnauthorizedException('Invalid token or user not authorized.');
  //   }
  // }
  
    async validateUser(input: any): Promise<UserDocument> {
    let userId: string;

    if (typeof input === 'string') {
      // Input is userId
      userId = input;
    } else if (input.headers && input.headers.authorization) {
      // Input is request object (req)
      const authHeader = input.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('Authorization header is missing or invalid.');
      }

      const token = authHeader.split(' ')[1];

      try {
        const decoded: any = this.jwtService.verify(token, { secret: process.env.ACCESS_TOKEN_SECRET });

        if (!decoded || !decoded.userId) {
          throw new UnauthorizedException('Invalid token structure.');
        }

        userId = decoded.userId;
      } catch (error) {
        console.error('Token verification error:', error);
        throw new UnauthorizedException('Invalid token or user not authorized.');
      }
    } else {
      throw new UnauthorizedException('Invalid input provided for user validation.');
    }

    const userData = await this.userModel.findById(userId);

    if (!userData) {
      throw new UnauthorizedException('User not found.');
    }

    return userData;
  }

  addHours(numOfHours: number, date: Date = new Date()): Date {
    date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);
    return date;
  }
}


// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import * as crypto from 'crypto';
// import { readFileSync } from 'fs';
// import { join } from 'path';
// import { Admin, AdminDocument } from '../databases/models/admin.schema';
// import { User, UserDocument } from '../databases/models/user.schema';

// @Injectable()
// export class HelperService {
//   constructor(
//     @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
//     @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
//     private readonly jwtService: JwtService
//   ) {}

//   makeId(length: number): string {
//     let result = '';
//     const characters = '0123456789';
//     const charactersLength = characters.length;
//     for (let i = 0; i < length; i++) {
//       result += characters.charAt(Math.floor(Math.random() * charactersLength));
//     }
//     return result;
//   }

//   generateSixDigitRandomNumber(): number {
//     const min = 100000;
//     const max = 999999;
//     const range = max - min;
//     const byteLength = Math.ceil(Math.log2(range + 1) / 8);
//     const randomBytes = crypto.randomBytes(byteLength);
//     const randomNumber = randomBytes.readUIntBE(0, byteLength) % range + min;
//     return randomNumber;
//   }

//   getLocaleMessages(language: string = 'en'): any {
//     const filePath = join(__dirname, '..', 'locals', `${language}.json`);
//     const data = readFileSync(filePath, 'utf-8');  // Specify encoding here
//     return JSON.parse(data);
//   }

//   async validateAdminToken(authorization: string): Promise<AdminDocument> {
//     if (!authorization || typeof authorization !== 'string') {
//       throw new UnauthorizedException('Authorization header missing or invalid.');
//     }

//     const token = authorization.split(' ')[1];
//     const decoded = this.jwtService.verify(token, { secret: process.env.ACCESS_TOKEN_SECRET });

//     if (decoded.admin) {
//       const userDetails = await this.adminModel.findOne({ _id: decoded.admin });
//       if (!userDetails) {
//         throw new UnauthorizedException('Admin not found.');
//       }
//       return userDetails;
//     } else {
//       throw new UnauthorizedException('Invalid token.');
//     }
//   }

//   async validateUser(req: Request): Promise<UserDocument> {
//     const locals = this.getLocaleMessages();
//     const userToken = req.headers['authorization']; // Access authorization header correctly

//     if (!userToken || typeof userToken !== 'string') {
//       throw new UnauthorizedException(locals.authorization_missing || 'Authorization header is missing.');
//     }

//     const tokenParts = userToken.split(' ');
//     if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
//       throw new UnauthorizedException(locals.invalid_token_format || 'Invalid token format.');
//     }

//     const token = tokenParts[1];
//     try {
//       const decoded = this.jwtService.verify(token, { secret: process.env.ACCESS_TOKEN_SECRET });
//       if (decoded.userId) {
//         const userData = await this.userModel.findOne({ _id: decoded.userId });
//         if (!userData) {
//           throw new UnauthorizedException(locals.user_not_found || 'User not found.');
//         }
//         return userData;
//       } else {
//         throw new UnauthorizedException(locals.invalid_token || 'Invalid token.');
//       }
//     } catch (error) {
//       console.error('Token verification error:', error);
//       throw new UnauthorizedException(locals.invalid_token || 'Invalid token.');
//     }
//   }

//   addHours(numOfHours: number, date: Date = new Date()): Date {
//     date.setTime(date.getTime(s) + numOfHours * 60 * 60 * 1000);
//     return date;
//   }
// }
