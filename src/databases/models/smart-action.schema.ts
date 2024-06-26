import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class CheckListItem {
  @Prop({ required: true })
  text: string;

  @Prop({ default: 'notDone', enum: ['check', 'uncheck', '', 'done', 'notDone'] })
  status: string;
  public _id: any;
}

export type SmartActionDocument = SmartAction & Document;

@Schema()
export class SmartAction {
  @Prop({ default: '' })
  name: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'users', default: null })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ type: [CheckListItem], default: [] })
  checkList: CheckListItem[];

  @Prop({ type: Boolean, default: false })
  deleted: boolean;

  @Prop({ type: Date, default: null })
  deletedAt: Date;

  @Prop({ enum: ['numeric', 'checkbox', ''], default: '' })
  logType: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'discoverygoals' }], default: [] })
  discoveryGoalId: MongooseSchema.Types.ObjectId[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Journey' }], default: [] })
  journeyId: MongooseSchema.Types.ObjectId[];

  @Prop({ default: '' })
  description: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ enum: ['completed', 'started', 'toDo', 'planned', ''], default: 'planned' })
  status: string;

  @Prop({ default: '' })
  targetUnit: string;

  @Prop({ type: Number, default: 0 })
  targetValue: number;

  @Prop({ type: Date, default: null })
  startDate: Date;

  @Prop({ type: Date, default: null })
  goalDate: Date;

  @Prop({ enum: ['habit', 'target', 'standalone', ''], default: '' })
  actionType: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'actiontypes', default: null })
  actionTypeId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'habitactiontypes', default: null })
  habitId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'targetactiontypes', default: null })
  targetId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'actionrecurrings', default: null })
  recurringId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'actiontrackprogress', default: null })
  trackProgressId: MongooseSchema.Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  currentLogTotal: number;

  @Prop({ type: Date, default: null })
  completedDate: Date;

  @Prop({ type: Date, default: Date.now })
  createdDate: Date;

  @Prop({ type: Date, default: Date.now })
  updatedDate: Date;
}

export const SmartActionSchema = SchemaFactory.createForClass(SmartAction);
