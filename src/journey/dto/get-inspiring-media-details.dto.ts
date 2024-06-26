// src/journey/dtos/get-inspiring-media-details.dto.ts

import { IsNotEmpty, IsMongoId } from 'class-validator';

export class GetInspiringMediaDetailsDto {
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}
