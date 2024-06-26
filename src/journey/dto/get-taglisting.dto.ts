import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class GetTagListingDto {
  @IsNotEmpty()
  @IsString()
  journeyId: string;

  @IsOptional()
  @IsString()
  journeyGuideId?: string;

  @IsOptional()
  @IsString()
  stageType?: string;
}
