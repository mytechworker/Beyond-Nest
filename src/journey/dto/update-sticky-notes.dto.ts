// src/journey/dtos/update-sticky-notes.dto.ts

import { IsNotEmpty, IsOptional, IsEnum, IsArray, IsDateString } from 'class-validator';

export class UpdateStickyNotesDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  title: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsEnum(['journalEntries', 'stickyNotes', ''])
  type?: string;

  @IsOptional()
  @IsEnum(['inspiration', 'vision', 'discovery', 'global', ''])
  stageType?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsDateString()
  desiredJourneyEndDate?: Date;

  @IsOptional()
  @IsDateString()
  likelyJourneyEndDate?: Date;
}
