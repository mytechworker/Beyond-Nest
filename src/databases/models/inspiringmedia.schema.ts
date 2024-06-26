import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class InspiringMedia {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'JourneyGuide' })
  journeyGuideId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Journey' })
  journeyId: MongooseSchema.Types.ObjectId;

  @Prop({ default: '' })
  title: string;

  @Prop({ enum: ['inspiration', 'vision', 'discovery', ''], default: 'inspiration' })
  stageType: string;

  @Prop({ enum: ['active', 'inactive'], default: 'active' })
  status: string;

  @Prop({ enum: ['video', 'image', 'audio', ''], default: '' })
  type: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: '' })
  document: string;

  @Prop({ default: Date.now })
  createdDate: Date;

  @Prop({ default: Date.now })
  updatedDate: Date;

  @Prop({ default: false })
  isShare: boolean;
}

export type InspiringMediaDocument = InspiringMedia & Document;

// Manually filter out soft deleted documents in queries
export const InspiringMediaSchema = SchemaFactory.createForClass(InspiringMedia);
