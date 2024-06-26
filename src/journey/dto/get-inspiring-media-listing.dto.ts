// src/journey/dtos/get-inspiring-media-listing.dto.ts

import { IsNotEmpty, IsMongoId, IsOptional } from 'class-validator';

export class GetInspiringMediaListingDto {
  @IsNotEmpty()
  @IsMongoId()
  journeyId: string;

  @IsOptional()
  @IsMongoId()
  journeyGuideId?: string;

  @IsOptional()
  @IsNotEmpty()
  stageType?: string;
}
