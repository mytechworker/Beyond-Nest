import { IsString } from 'class-validator';

export class UpdateActionAreaDto {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsString()
  status: string;

  @IsString()
  description?: string;

  @IsString()
  helpText?: string;
}
