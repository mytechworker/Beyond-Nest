import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type QuoteManagementDocument = QuoteManagement & Document;

@Schema({ timestamps: true })
export class QuoteManagement {
  @Prop({ required: true })
  author: string;

  @Prop({ default: '' })
  quote: string;

  @Prop({ default: '' })
  source: string;

  @Prop({ type: Date, default: Date.now })
  date: Date;
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'journeyscreenareas' })
  areaId: string;

  @Prop({ enum: ['active', 'inactive'], default: 'active' })
  status: string;

  @Prop({ type: Date, default: Date.now })
  createdDate: Date;

  @Prop({ type: Date, default: Date.now })
  updatedDate: Date;
}

export const QuoteManagementSchema = SchemaFactory.createForClass(QuoteManagement);
