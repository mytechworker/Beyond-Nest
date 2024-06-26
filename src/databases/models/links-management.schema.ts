// src/admin/schemas/links-management.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongooseSoftDelete from 'soft-delete-mongoose';

@Schema({ timestamps: true })
export class LinksManagement extends Document {
  @Prop({ default: '' })
  privacy_policy: string;

  @Prop({ default: '' })
  terms_conditions: string;

  @Prop({ default: Date.now })
  createdDate: Date;

  @Prop({ default: Date.now })
  updatedDate: Date;
}

export const LinksManagementSchema = SchemaFactory.createForClass(LinksManagement);
LinksManagementSchema.plugin(mongooseSoftDelete, { paranoid: true });

export const LinksManagementModelName = 'LinksManagement';
