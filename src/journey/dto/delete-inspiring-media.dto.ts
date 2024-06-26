// src/journey/dtos/delete-inspiring-media.dto.ts

import { IsNotEmpty, IsMongoId } from 'class-validator';

export class DeleteInspiringMediaDto {
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}
