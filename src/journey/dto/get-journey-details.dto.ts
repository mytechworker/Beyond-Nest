import { IsNotEmpty } from 'class-validator';

export class GetJourneyDetailsDto {
  @IsNotEmpty()
  id: string;
}
