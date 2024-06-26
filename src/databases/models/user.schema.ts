import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongooseSoftDelete from 'soft-delete-mongoose';

@Schema()
export class User {
  
  @Prop({ default: '' })
  email: string;

  @Prop({ default: '' })
  phoneNumber: string;

  @Prop({ default: '' })
  countryCode: string;

  @Prop({ default: null })
  emailOtp: number;

  @Prop({ default: null })
  phoneOtp: number;

  @Prop({ default: null })
  emailOtpDateTime: number;

  @Prop()
  phoneOtpDateTime: Date;

  @Prop({ default: false })
  isVerifyEmailOtp: boolean;

  @Prop({ default: false })
  isVerifyPhoneOtp: boolean;

  @Prop({ enum: ['active', 'deactive', 'deleted'], default: 'active' })
  status: string;

  @Prop({ default: Date.now })
  createdDate: Date;

  @Prop({ default: Date.now })
  updatedDate: Date;

  @Prop({ default: '' })
  password: string;

  @Prop({ default: [] })
  oldPassword: string[];

  @Prop({ default: '' })
  lastLogin: Date;

  @Prop({ default: '' })
  userName: string;

  @Prop({ default: '' })
  displayName: string;

  @Prop({ default: '' })
  bio: string;

  @Prop({ default: '' })
  profileImage: string;

  @Prop({ default: '' })
  coverImage: string;

  @Prop({ default: false })
  notificationStatus: boolean;

  @Prop({ default: false })
  isRegistrationCompleted: boolean;

  @Prop({ type: { type: String, enum: ['Point'], default: 'Point' }, coordinates: [Number] })
  location: { type: string; coordinates: number[] };

  @Prop({ default: false })
  deleted: boolean;

  @Prop({ type: Object })
  tracking: {
    ip: string;
    device: {
      browser: string;
      os: string;
      platform: string;
      source: string;
    };
  };
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

// Configure the soft-delete plugin with the required options
UserSchema.plugin(mongooseSoftDelete, {
  paranoid: true,
  deletedAt: true,
  overrideMethods: 'all',
});
