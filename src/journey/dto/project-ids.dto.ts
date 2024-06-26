// project-ids.dto.ts
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ProjectIdsDto {
  @IsNotEmpty()
  @IsString()
  startDate: string;

  @IsNotEmpty()
  @IsString()
  actionType: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  actionTypeId: string;

  @IsOptional()
  discoveryGoalId: string;

  @IsOptional()
  actionTypeOtherFileds: any;

  @IsOptional()
  recurringOtherFileds: any;

  @IsOptional()
  trackProgressOtherFileds: any;

  // Add the missing properties
  @IsOptional()
  userId?: string;

  @IsOptional()
  targetValue?: string;

  @IsOptional()
  targetUnit?: string;

  @IsOptional()
  recurringId?: string;

  @IsOptional()
  trackProgressId?: string;

  @IsOptional()
  habitId?: string;
}
