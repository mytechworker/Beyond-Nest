import { IsNotEmpty } from 'class-validator';

export class AddDiscoveryGoalDto {
  @IsNotEmpty({ message: 'Description should not be empty' })
  description: string;

  @IsNotEmpty({ message: 'Journey ID should not be empty' })
  journeyId: string;

  journeyGuideId?: string;
  
  userId?: string; // Make userId optional
}
