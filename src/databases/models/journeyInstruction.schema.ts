// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';
// import * as mongooseSoftDelete from 'soft-delete-mongoose';

// @Schema({ timestamps: true })
// export class JourneyInstruction {
//   @Prop({ required: true })
//   title: string;

//   @Prop({ default: '' })
//   instruction: string;

//   @Prop({ default: 0 })
//   sequence: number;

//   @Prop({ default: Date.now })
//   createdDate: Date;

//   @Prop({ default: Date.now })
//   updatedDate: Date;
// }

// export const JourneyInstructionSchema = SchemaFactory.createForClass(JourneyInstruction);
// JourneyInstructionSchema.plugin(mongooseSoftDelete, { paranoid: true });

// export type JourneyInstructionDocument = JourneyInstruction & Document;


import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import * as mongooseSoftDelete from 'soft-delete-mongoose';

@Schema({ timestamps: true })
export class JourneyInstruction {
  @Prop({ required: true })
  title: string;

  @Prop({ default: '' })
  instruction: string;

  @Prop({ default: 0 })
  sequence: number;

  @Prop({ default: Date.now })
  createdDate: Date;

  @Prop({ default: Date.now })
  updatedDate: Date;

  // Define id explicitly if needed
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  id: string;
}

export const JourneyInstructionSchema = SchemaFactory.createForClass(JourneyInstruction);
JourneyInstructionSchema.plugin(mongooseSoftDelete, { paranoid: true });

export type JourneyInstructionDocument = JourneyInstruction & Document;
