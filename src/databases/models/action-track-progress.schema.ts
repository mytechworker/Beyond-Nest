import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ActionTrackProgressDocument = ActionTrackProgress & Document;

@Schema()
export class ActionTrackProgress {
  @Prop({ type: Types.ObjectId, ref: 'users', default: null })
  userId: Types.ObjectId;

  @Prop({ type: String, enum: ['notRepeat', 'daily', 'weekly', 'monthly', 'annual', 'custom', 'everyWeekday', ''], default: '' })
  trackProgressType: string;

  @Prop({ type: Types.ObjectId, ref: 'smartactions', default: null })
  smartActionId: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  weeklyDay: string[];

  @Prop({ type: String, default: '' })
  monthlyDay: string;

  @Prop({ type: String, default: '' })
  monthlyType: string;

  @Prop({ type: Date, default: null })
  annuallyDate: Date;

  @Prop({ type: [String], default: [] })
  everyDay: string[];

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ type: Date, default: Date.now })
  createdDate: Date;

  @Prop({ type: Date, default: Date.now })
  updatedDate: Date;
}

export const ActionTrackProgressSchema = SchemaFactory.createForClass(ActionTrackProgress);
