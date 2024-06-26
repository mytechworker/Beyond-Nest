// src/journey/schemas/smart-action-recurring.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import * as mongooseSoftDelete from 'mongoose-delete';

@Schema({ timestamps: true })
export class SmartActionRecurring {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'users', default: null })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, enum: ["notRepeat", "daily", "weekly", "monthly", "annual", "custom", "everyWeekday", ""] })
  recurringType: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'smartactions', default: null })
  smartActionId: MongooseSchema.Types.ObjectId;

  @Prop({ type: [String], default: [] })
  weeklyDay: string[];

  @Prop({ type: String, default: "" })
  monthlyDay: string;

  @Prop({ type: String, default: "" })
  monthlyType: string;

  @Prop({ type: Date, default: null })
  annualyDate: Date;

  @Prop({ type: [String], default: [] })
  everyDay: string[];

  @Prop({ type: Date, default: Date.now })
  createdDate: Date;

  @Prop({ type: Date, default: Date.now })
  updatedDate: Date;
}

export type SmartActionRecurringDocument = SmartActionRecurring & Document;
export const SmartActionRecurringSchema = SchemaFactory.createForClass(SmartActionRecurring).plugin(mongooseSoftDelete, { paranoid: true });
