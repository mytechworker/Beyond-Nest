// src/journey/dto/get-journey-listing.dto.ts

import { IsOptional, IsString, IsInt } from 'class-validator';

export class GetJourneyListingDto {
  @IsOptional()
  @IsInt()
  page?: number;

  @IsOptional()
  @IsInt()
  limit?: number;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
