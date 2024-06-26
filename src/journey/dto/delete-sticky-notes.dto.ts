// src/journey/dtos/delete-sticky-notes.dto.ts

import { IsNotEmpty } from 'class-validator';

export class DeleteStickyNotesDto {
  @IsNotEmpty()
  id: string;
}
