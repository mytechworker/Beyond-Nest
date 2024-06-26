import { IsNotEmpty } from 'class-validator';

export class GetJourneyGuideListingDto {
  @IsNotEmpty({ message: 'Journey ID must not be empty' })
  journeyId: string;
}
