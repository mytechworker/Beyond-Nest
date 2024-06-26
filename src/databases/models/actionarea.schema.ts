// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document, Types } from 'mongoose'; // Import Types from mongoose

// export type ActionAreaDocument = ActionArea & Document;

// @Schema() // Decorate the class with @Schema()
// export class ActionArea {
//   @Prop({ required: true })
//   title: string;

//   @Prop({ default: '' })
//   description: string;

//   @Prop({ default: '' })
//   helpText: string;

//   @Prop({ enum: ['active', 'inactive', 'retired', 'deleted'], default: 'active' })
//   status: string;

//   @Prop({ enum: ['admin', 'user'], default: 'admin' })
//   type: string;

//   @Prop({ type: Types.ObjectId, ref: 'users', default: null }) // Use Types.ObjectId instead of Schema.Types.ObjectId
//   userId: Types.ObjectId;

//   @Prop({ type: Types.ObjectId, ref: 'focus_areas', default: null }) // Use Types.ObjectId instead of Schema.Types.ObjectId
//   focusAreaId: Types.ObjectId;

//   @Prop({ default: Date.now })
//   createdDate: Date;

//   @Prop({ default: Date.now })
//   updatedDate: Date;

// }

// export const ActionAreaSchema = SchemaFactory.createForClass(ActionArea); // Use SchemaFactory to create schema


import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ActionAreaDocument = ActionArea & Document;

@Schema()
export class ActionArea {
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

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'FocusArea', default: null })
  focusAreaId: Types.ObjectId;

  @Prop({ default: Date.now })
  createdDate: Date;

  @Prop({ default: Date.now })
  updatedDate: Date;

  @Prop({ default: false }) // Add deleted field with default value
  deleted: boolean;
}

export const ActionAreaSchema = SchemaFactory.createForClass(ActionArea);
