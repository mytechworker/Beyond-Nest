import { IsNotEmpty, IsOptional } from 'class-validator';

export class GetVisionVideoListingDto {
  @IsNotEmpty()
  journeyId: string;

  @IsOptional()
  journeyGuideId?: string;
}
