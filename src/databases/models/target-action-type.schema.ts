// target-action-type.schema.ts

import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import * as mongooseSoftDelete from 'mongoose-delete';

@Schema({ timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' } })
export class TargetActionType extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'smartactions', default: null })
  smartActionId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users', default: null })
  userId: string;

  @Prop({ type: String, default: ' ' })
  beginningValue: string;

  @Prop({ type: String, default: ' ' })
  target: string;

  @Prop({ type: String, default: ' ' })
  unit: string;
}

export const TargetActionTypeSchema = SchemaFactory.createForClass(TargetActionType);
TargetActionTypeSchema.plugin(mongooseSoftDelete, { deletedAt: true, overrideMethods: true });

export const TargetActionTypeModel = mongoose.model<TargetActionType>('TargetActionType', TargetActionTypeSchema);
export type TargetActionTypeDocument = TargetActionType & Document;
