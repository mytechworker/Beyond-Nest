//add-abundance-area.dto.ts
import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';

export class AddAbundanceAreaDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  @IsString()
  colourCode: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  helpText?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  userId?: string;
}
