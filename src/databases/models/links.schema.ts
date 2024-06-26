// src/links/schemas/links.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import * as mongooseSoftDelete from 'soft-delete-mongoose';

export type LinksDocument = Links & Document;

@Schema({ timestamps: true })
export class Links {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'JourneyGuide', required: true })
  journeyGuideId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Journey', required: true })
  journeyId: string;

  @Prop({ default: '' })
  title: string;

  @Prop({ enum: ['active', 'inactive'], default: 'active' })
  status: string;

  @Prop({ default: [] })
  tags: string[];

  @Prop({ default: '' })
  webPageLink: string;

  @Prop({ enum: ['inspiration', 'vision', 'discovery', ''], default: 'inspiration' })
  stageType: string;

  @Prop({ default: false })
  isShare: boolean;

  @Prop({ default: Date.now })
  createdDate: Date;

  @Prop({ default: Date.now })
  updatedDate: Date;
}

export const LinksSchema = SchemaFactory.createForClass(Links);
LinksSchema.plugin(mongooseSoftDelete, { paranoid: true });
