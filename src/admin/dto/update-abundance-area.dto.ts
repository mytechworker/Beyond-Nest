import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateAbundanceAreaDto {
  @IsNotEmpty()
  @IsString()
  id: string;

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
}
