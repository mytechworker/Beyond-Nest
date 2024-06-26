import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import * as mongooseSoftDelete from 'mongoose-delete';

@Schema({ timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' } })
export class HabitActionType extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'smartactions', default: null })
  smartActionId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users', default: null })
  userId: string;

  @Prop({ type: String, enum: ['atLeast', 'atMost', 'exactly', ' '], default: ' ' })
  type: 'atLeast' | 'atMost' | 'exactly' | ' ';

  @Prop({ type: String, default: '' })
  target: string;

  @Prop({ type: String, default: '' })
  unit: string;
}

export const HabitActionTypeSchema = SchemaFactory.createForClass(HabitActionType);
HabitActionTypeSchema.plugin(mongooseSoftDelete, { deletedAt: true, overrideMethods: true });

export const HabitActionTypeModel = mongoose.model<HabitActionType>('HabitActionType', HabitActionTypeSchema);
export type HabitActionTypeDocument = HabitActionType & Document;
