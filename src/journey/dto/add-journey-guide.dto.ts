import { IsNotEmpty } from 'class-validator';

export class AddJourneyGuideDto {
  @IsNotEmpty({ message: 'Journey ID must not be empty' })
  journeyId: string;

  @IsNotEmpty({ message: 'Title must not be empty' })
  title: string;

  @IsNotEmpty({ message: 'Action name must not be empty' })
  actionName: string;

  description?: string;

  userId?: string; // Optional userId property
  
  journeyGuideId?: string;
}
