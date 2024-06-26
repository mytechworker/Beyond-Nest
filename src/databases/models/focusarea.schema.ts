import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import * as mongooseDelete from 'mongoose-delete';

@Schema()
export class FocusArea {
  @Prop({ required: true })
  title: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: '' })
  helpText: string;

  @Prop({ enum: ['active', 'inactive', 'retired', 'deleted'], default: 'active' })
  status: string;

  @Prop({ enum: ['admin', 'user'], default: 'admin' })
  type: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'AbundanceArea', default: null })
  abundanceAreaId: mongoose.Schema.Types.ObjectId;

  @Prop({ default: Date.now })
  createdDate: Date;

  @Prop({ default: Date.now })
  updatedDate: Date;
}

// Apply mongoose-delete plugin to the schema
export const FocusAreaSchema = SchemaFactory.createForClass(FocusArea).plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});
    
export type FocusAreaDocument = FocusArea & Document;

