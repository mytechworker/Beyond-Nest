import { IsDate, IsArray, IsOptional, IsString } from 'class-validator';

export class ActionListWithSearchDTO {
  @IsOptional()
  @IsDate()
  date?: Date;

  @IsOptional()
  @IsArray()
  journeyId?: string[];

  @IsOptional()
  @IsArray()
  actionType?: string[];

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsArray()
  discoveryGoalId?: string[];

  @IsOptional()
  @IsArray()
  status?: string[];
}
