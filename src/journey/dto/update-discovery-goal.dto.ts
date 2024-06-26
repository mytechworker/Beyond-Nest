import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateDiscoveryGoalDto {
  @IsNotEmpty({ message: 'ID should not be empty' })
  id: string;

  @IsOptional()
  title?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  journeyId?: string;

  @IsOptional()
  journeyGuideId?: string;
}
