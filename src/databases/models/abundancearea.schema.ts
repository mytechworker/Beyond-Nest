import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongooseSoftDelete from 'soft-delete-mongoose';

@Schema({ timestamps: true })
export class AbundanceArea {
  @Prop({ required: true })
  title: string;

  @Prop({ enum: ['active', 'inactive', 'retired', 'deleted'], default: 'active' })
  status: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: '' })
  helpText: string;

  @Prop({ default: '#FFFFFF' })
  colourCode: string;

  @Prop({ enum: ['admin', 'user'], default: 'admin' })
  type: string;

  @Prop({ type: String, default: null })
  userId: string;

  @Prop({ type: Date, default: Date.now })
  createdDate: Date;

  @Prop({ type: Date, default: Date.now })
  updatedDate: Date;
}

export const AbundanceAreaSchema = SchemaFactory.createForClass(AbundanceArea).plugin(
  mongooseSoftDelete,
  { overrideMethods: 'all' } // Ensure all document methods are overridden for soft delete
);

export type AbundanceAreaDocument = AbundanceArea & Document;




// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document, Schema as MongooseSchema } from 'mongoose';
// import * as mongooseDelete from 'mongoose-delete';

// @Schema({ timestamps: true })
// export class AbundanceArea {
//   @Prop({ required: true })
//   title: string;

//   @Prop({ enum: ['active', 'inactive', 'retired', 'deleted'], default: 'active' })
//   status: string;

//   @Prop({ default: '' })
//   description: string;

//   @Prop({ default: '' })
//   helpText: string;

//   @Prop({ enum: ['admin', 'user'], default: 'admin' })
//   type: string;

//   @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'users', default: null })
//   userId: MongooseSchema.Types.ObjectId;

//   @Prop({ type: Date, default: null })
//   deletedAt: Date; // Added for soft deletion

//   @Prop({ type: Boolean, default: false })
//   deleted: boolean; // Added for soft deletion

//   @Prop({ default: Date.now })
//   createdDate: Date;

//   @Prop({ default: Date.now })
//   updatedDate: Date;
// }

// export const AbundanceAreaSchema = SchemaFactory.createForClass(AbundanceArea);
// AbundanceAreaSchema.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });


