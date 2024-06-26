// src/inspiring-media/schemas/inspiring-media.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import * as mongooseSoftDelete from 'soft-delete-mongoose';

export type InspiringMediaDocument = InspiringMedia & Document;

@Schema({ timestamps: true })
export class InspiringMedia {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'JourneyGuide', required: true })
  journeyGuideId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Journey', required: true })
  journeyId: string;

  @Prop({ default: '' })
  title: string;

  @Prop({ enum: ['inspiration', 'vision', 'discovery', ''], default: 'inspiration' })
  stageType: string;

  @Prop({ enum: ['active', 'inactive'], default: 'active' })
  status: string;

  @Prop({ enum: ['video', 'image', 'audio', ''], default: '' })
  type: string;

  @Prop({ default: [] })
  tags: string[];

  @Prop({ default: '' })
  document: string;

  @Prop({ default: false })
  isShare: boolean;

  @Prop({ default: Date.now })
  createdDate: Date;

  @Prop({ default: Date.now })
  updatedDate: Date;
}

export const InspiringMediaSchema = SchemaFactory.createForClass(InspiringMedia);
InspiringMediaSchema.plugin(mongooseSoftDelete, { paranoid: true });

