import { IsNotEmpty, IsString } from 'class-validator';

export class InspirationStageListDto {
  @IsNotEmpty()
  @IsString()
  journeyId: string;

  @IsNotEmpty()
  @IsString()
  journeyGuideId: string;
}
