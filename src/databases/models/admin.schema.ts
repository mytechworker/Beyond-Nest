import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongooseSoftDelete from 'soft-delete-mongoose';

@Schema({ timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' } })
export class Admin {
  @Prop({ required: false })
  fullName: string;

  @Prop({ default: null })
  avatar: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: ['1', '2'], default: '2' })
  role: string;

  @Prop({ enum: ['active', 'inactive'], default: 'active' })
  status: string;

  @Prop({ required: false })
  otp: number;

  @Prop({ default: false })
  otpVerify: boolean;

  @Prop({ required: false })
  lastLogin: Date;

  @Prop({ default: Date.now })
  createdDate: Date;

  @Prop({ default: Date.now })
  updatedDate: Date;
}

export type AdminDocument = Admin & Document;
export const AdminSchema = SchemaFactory.createForClass(Admin);

AdminSchema.plugin(mongooseSoftDelete, {
  paranoid: true,
});
