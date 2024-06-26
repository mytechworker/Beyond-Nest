import { IsNotEmpty, IsEnum, IsOptional, IsMongoId } from 'class-validator';

export class AddAreaDto {
  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  title: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  helpText?: string;

  @IsOptional()
  @IsMongoId()
  abundanceAreaId?: string;

  @IsOptional()
  @IsMongoId()
  focusAreaId?: string;
}
