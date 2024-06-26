import { IsOptional, IsDateString, IsArray, IsString } from 'class-validator';

export class GetStickyNotesListingDto {
  @IsString()
  journeyId: string;

  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  stageType?: string;

  @IsString()
  @IsOptional()
  journeyGuideId?: string;
}
