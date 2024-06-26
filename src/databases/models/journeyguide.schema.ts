import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: false })
export class JourneyGuide {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Journey' })
  journeyId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: '' })
  actionName: string;

  @Prop({ default: Date.now })
  createdDate: Date;

  @Prop({ default: Date.now })
  updatedDate: Date;

  // Soft delete method
  softDelete: (deletedBy: MongooseSchema.Types.ObjectId) => void;
}

export type JourneyGuideDocument = JourneyGuide & Document;

// Create the schema separately
export const JourneyGuideSchema = SchemaFactory.createForClass(JourneyGuide);

// Apply soft-delete method
JourneyGuideSchema.methods.softDelete = function(deletedBy: MongooseSchema.Types.ObjectId) {
  this.deletedAt = new Date();
  this.deletedBy = deletedBy;
  return this.save();
};
