import { IsNotEmpty, IsString } from 'class-validator';

export class AddJourneyDto {
  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  abundanceAreaId: string;

  @IsNotEmpty()
  @IsString()
  focusAreaId: string;

  @IsNotEmpty()
  @IsString()
  actionAreaId: string;

  @IsNotEmpty()
  @IsString()
  createrName: string; // Add this field
}
