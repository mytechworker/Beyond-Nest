import { IsNotEmpty, IsString } from 'class-validator';

export class GetTagListingParamsDto {
  @IsNotEmpty()
  @IsString()
  journeyId: string;
}
