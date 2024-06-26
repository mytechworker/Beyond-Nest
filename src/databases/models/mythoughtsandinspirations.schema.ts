import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class MyThoughtsAndInspirations {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'JourneyGuide', default: null })
  journeyGuideId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Journey', default: null })
  journeyId: MongooseSchema.Types.ObjectId;

  @Prop({ default: '' })
  title: string;

  @Prop({ default: [] })
  tags: string[];

  @Prop({ enum: ['journalEntries', 'stickyNotes', ''], default: '' })
  type: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ enum: ['inspiration', 'vision', 'discovery', 'global', ''], default: 'inspiration' })
  stageType: string;

  @Prop({ enum: ['active', 'inactive', 'deleted'], default: 'active' }) // Add 'deleted' status
  status: string;

  @Prop({ default: new Date().toLocaleDateString('en-CA') })
  filterDate: Date;

  @Prop({ default: Date.now })
  updatedDate: Date;

  @Prop({ default: Date.now })
  createdDate: Date;

  @Prop({ default: false })
  isShare: boolean;
}

export type MyThoughtsAndInspirationsDocument = MyThoughtsAndInspirations & Document;

// Manually implement soft deletion by filtering out 'deleted' documents in queries
export const MyThoughtsAndInspirationsSchema = SchemaFactory.createForClass(MyThoughtsAndInspirations);
