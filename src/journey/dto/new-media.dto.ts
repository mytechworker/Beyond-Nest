import { IsString, IsOptional, IsArray, ArrayNotEmpty, ArrayMinSize } from 'class-validator';

export class NewMediaDto {
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  search?: string[];

  @IsOptional()
  @IsString()
  type?: string;
}
