// update-vision-video.dto.ts
import { IsNotEmpty, IsBoolean, IsString } from 'class-validator';

export class UpdateVisionVideoDto {
  @IsNotEmpty()
  id: string;

  @IsString()
  title: string;

  @IsString()
  transition: string;

  @IsNotEmpty()
  timing: number;

  @IsString({ each: true })
  videoImages: string[];

  @IsBoolean()
  remove?: boolean;

  imageUrl?: string;
}
