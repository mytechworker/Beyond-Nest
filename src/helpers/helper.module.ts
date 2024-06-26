import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { Admin, AdminSchema } from '../databases/models/admin.schema';
import { User, UserSchema } from '../databases/models/user.schema';
import { HelperService } from './helper.service';
import { MailService } from '@sendgrid/mail';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [HelperService, MailService],
  exports: [HelperService],
})
export class HelperModule {}
