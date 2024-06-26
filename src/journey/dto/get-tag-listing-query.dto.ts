import { IsOptional, IsString } from 'class-validator';

export class GetTagListingQueryDto {
  @IsOptional()
  @IsString()
  journeyGuideId?: string;

  @IsOptional()
  @IsString()
  stageType?: string;
}
