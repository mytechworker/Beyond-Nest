// get-journey-guide-details.dto.ts

import { IsNotEmpty } from 'class-validator';

export class GetJourneyGuideDetailsDto {
  @IsNotEmpty({ message: 'ID must not be empty' })
  id: string;
}
