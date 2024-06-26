// get-link-listing.dto.ts

import { IsNotEmpty, IsOptional } from 'class-validator';

export class GetLinkListingDto {
  @IsNotEmpty({ message: 'Journey ID should not be empty' })
  journeyId: string;

  @IsOptional()
  journeyGuideId?: string;

  @IsOptional()
  stageType?: string;
}
