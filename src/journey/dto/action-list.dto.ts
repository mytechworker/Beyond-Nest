import { IsDateString, IsOptional, IsArray, IsString } from 'class-validator';

export class ActionListDto {
  @IsDateString()
  @IsOptional()
  date: string;

  @IsOptional()
  @IsArray()
  journeyId: string[];

  @IsOptional()
  @IsArray()
  actionType: string[];

  @IsOptional()
  @IsArray()
  tags: string[];

  @IsOptional()
  @IsArray()
  discoveryGoalId: string[];

  @IsOptional()
  @IsArray()
  status: string[];

  @IsOptional()
  @IsString()
  direction: string;
}
