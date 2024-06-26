// smart-action-log.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import * as mongooseDelete from 'mongoose-delete';
import { SmartAction } from './smart-action.schema';

export type SmartActionLogDocument = SmartActionLog & Document;

@Schema({ timestamps: true })
export class SmartActionLog {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'SmartAction' })
  smartActionId: SmartAction;

  @Prop({ default: '' })
  targetType: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: 0 })
  currentLogUnit: number;

  @Prop({ default: new Date().toLocaleDateString('en-CA') })
  logDate: Date;

  @Prop({ default: new Date().toLocaleDateString('en-CA') })
  createdDate: Date;

  @Prop({ default: Date.now })
  updatedDate: Date;
}

export const SmartActionLogSchema = SchemaFactory.createForClass(SmartActionLog);
SmartActionLogSchema.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });
