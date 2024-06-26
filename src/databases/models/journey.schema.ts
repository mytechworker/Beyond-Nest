import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Journey {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ enum: ['single', 'team', ''], default: '' })
  type: string;

  @Prop({ default: '' })
  teamName: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'AbundanceArea', default: null })
  abundanceAreaId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  ownerName: string;

  @Prop({ required: true })
  createrName: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'FocusArea', default: null })
  focusAreaId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'ActionArea', default: null })
  actionAreaId: MongooseSchema.Types.ObjectId;

  @Prop({ type: Date, default: null })
  desiredJourneyEndDate: Date;

  @Prop({ type: Date, default: null })
  likelyJourneyEndDate: Date;

  @Prop({ type: Date, default: null })
  journeyStartDate: Date;

  @Prop({ enum: ['active', 'paused', 'completed', 'trashed', 'archived'], default: 'active' })
  status: string;

  @Prop({ type: Date, default: null })
  statusUpdatedDate: Date;

  @Prop({ type: Date, default: null })
  completedDate: Date;

  @Prop({ type: Date, default: Date.now })
  createdDate: Date;

  @Prop({ type: Date, default: Date.now })
  updatedDate: Date;

  @Prop({ default: false })
  deleted: boolean;

  @Prop({ type: Date, default: null })
  deletedAt: Date;
}

export type JourneyDocument = Journey & Document;
export const JourneySchema = SchemaFactory.createForClass(Journey);
