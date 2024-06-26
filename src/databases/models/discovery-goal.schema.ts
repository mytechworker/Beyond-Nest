// src/discovery-goals/schemas/discovery-goal.schema.ts
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import * as mongooseSoftDelete from 'soft-delete-mongoose';

@Schema()
export class DiscoveryGoal {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    userId: MongooseSchema.Types.ObjectId;
  
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'JourneyGuide' })
    journeyGuideId: MongooseSchema.Types.ObjectId;
  
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Journey' })
    journeyId: MongooseSchema.Types.ObjectId;
  
    @Prop({ type: String, default: '' })
    title: string;
  
    @Prop({ type: String, default: '' })
    description: string;
  
    @Prop({ type: String, enum: ['inspiration', 'vision', 'discovery', ''], default: 'discovery' })
    stageType: string;
  
    @Prop({ type: String, enum: ['done', 'notDone'], default: 'notDone' })
    status: string;
  
    @Prop({ type: Date, default: Date.now })
    updatedDate: Date;
  
    @Prop({ type: Date, default: Date.now })
    createdDate: Date;
  
    @Prop({ type: [{ type: String }] }) // Assuming tags is an array of strings
    tags: string[];
}

export const DiscoveryGoalSchema = SchemaFactory.createForClass(DiscoveryGoal);
DiscoveryGoalSchema.plugin(mongooseSoftDelete, { paranoid: true });
export type DiscoveryGoalDocument = DiscoveryGoal & Document;
