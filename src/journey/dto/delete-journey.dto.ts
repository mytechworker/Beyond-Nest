import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteJourneyDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
