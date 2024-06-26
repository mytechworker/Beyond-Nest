// action-type.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongooseSoftDelete from 'soft-delete-mongoose';

@Schema({ timestamps: true })
export class ActionType {
  @Prop({ required: true })
  type: string;

  @Prop()
  description?: string;

  @Prop({ default: false })
  deleted?: boolean; 

  @Prop({ default: Date.now })
  createdDate?: Date;

  @Prop({ default: Date.now })
  updatedDate?: Date;
}

export const ActionTypeSchema = SchemaFactory.createForClass(ActionType);
ActionTypeSchema.plugin(mongooseSoftDelete, { paranoid: true });

export type ActionTypeDocument = ActionType & Document;
