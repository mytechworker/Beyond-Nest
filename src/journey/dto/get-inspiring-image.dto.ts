import { IsNotEmpty, IsOptional } from 'class-validator';

export class GetInspiringImagesDto {
  @IsNotEmpty()
  journeyId: string;

  @IsOptional()
  journeyGuideId?: string;
}
