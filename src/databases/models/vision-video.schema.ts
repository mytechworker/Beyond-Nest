// vision-video.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type VisionVideoDocument = VisionVideo & Document;

@Schema()
export class VisionVideo {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'users' })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'journeyguides' })
  journeyGuideId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'journeys' })
  journeyId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ type: [String], default: [] })
  videoImages: string[];

  @Prop({ required: true })
  transition: string;

  @Prop({ required: true })
  timing: number;

  @Prop({ enum: ['active', 'inactive'], default: 'active' })
  status: string;

  @Prop({ type: Date, default: Date.now })
  createdDate: Date;

  @Prop({ type: Date, default: Date.now })
  updatedDate: Date;
}

export const VisionVideoSchema = SchemaFactory.createForClass(VisionVideo);
