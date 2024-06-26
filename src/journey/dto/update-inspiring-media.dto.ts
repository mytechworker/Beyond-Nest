// src/journey/dtos/update-inspiring-media.dto.ts

import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';

export class UpdateInspiringMediaDto {
  @IsNotEmpty()
  @IsMongoId()
  id: string;

  @IsString()
  document?: string;

  @IsString()
  inspiringMediaVideo?: string;

  @IsString()
  inspiringMediaImage?: string;

  @IsString()
  inspiringMediaAudio?: string;

  updatedDate: Date;
}
