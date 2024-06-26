// src/journey/dtos/get-sticky-notes-details.dto.ts

import { IsNotEmpty } from 'class-validator';

export class GetStickyNotesDetailsDto {
  @IsNotEmpty()
  id: string;
}
