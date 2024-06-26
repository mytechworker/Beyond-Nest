// src/journey/dto/add-sticky-notes.dto.ts

import { IsNotEmpty, IsString } from 'class-validator';

export class AddStickyNotesDto { 
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  journeyId: string;

  @IsNotEmpty()
  @IsString()
  journeyGuideId: string;
}
