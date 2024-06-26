import { IsNotEmpty, IsOptional } from 'class-validator';

export class GetProjectIdsAndStandaloneIdsDto {
  @IsNotEmpty()
  currentJourneyId: string;

  @IsOptional()
  text?: string;
}
