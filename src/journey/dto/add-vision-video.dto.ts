// add-vision-video.dto.ts

import { IsString, IsArray, IsNotEmpty, IsEnum, IsNumber } from 'class-validator';

export class AddVisionVideoDto {
  @IsNotEmpty()
  @IsString()
  transition: string;

  @IsNotEmpty()
  @IsNumber()
  timing: number;

  @IsNotEmpty()
  @IsArray()
  videoImages: any[]; // Adjust the type according to your data structure

  @IsNotEmpty()
  @IsString()
  journeyId: string;

  @IsNotEmpty()
  @IsString()
  journeyGuideId: string;
}
