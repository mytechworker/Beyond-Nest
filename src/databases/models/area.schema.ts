// src/areas/schemas/area.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongooseSoftDelete from 'soft-delete-mongoose';

@Schema({ timestamps: true })
export class Area {
  @Prop({ required: true })
  areaName: string;

  @Prop({ enum: ['active', 'inactive'], default: 'active' })
  status: string;

  @Prop({ default: Date.now })
  createdDate: Date;

  @Prop({ default: Date.now })
  updatedDate: Date;
}

export const AreaSchema = SchemaFactory.createForClass(Area);
AreaSchema.plugin(mongooseSoftDelete, { paranoid: true }); // Enable soft-delete plugin

export type AreaDocument = Area & Document;
