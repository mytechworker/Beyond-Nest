// delete-journey-guide.dto.ts

import { IsNotEmpty } from 'class-validator';

export class DeleteJourneyGuideDto {
  @IsNotEmpty({ message: 'ID must not be empty' })
  id: string;
}
