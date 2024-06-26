import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type SmartActionCompletedStatusDocument = SmartActionCompletedStatus & Document;

@Schema()
export class SmartActionCompletedStatus {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'smartactions', default: null })
  smartActionId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'users', default: null })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, enum: ['completed', 'started', 'planned', ''], default: '' })
  status: string;

  @Prop({ type: Boolean, default: false })
  deleted: boolean;

  @Prop({ type: Date, default: null })
  deletedAt: Date;

  @Prop({ type: Date, default: null })
  statusUpdateDate: Date;

  @Prop({ type: Date, default: Date.now })
  createdDate: Date;

  @Prop({ type: Date, default: Date.now })
  updatedDate: Date;
}

export const SmartActionCompletedStatusSchema = SchemaFactory.createForClass(SmartActionCompletedStatus);
