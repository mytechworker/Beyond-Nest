import { IsNotEmpty, IsString } from 'class-validator';

export class FocusAreaDto{
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  description?: string;

  @IsString()
  helpText?: string;

  @IsNotEmpty()
  @IsString()
  type: 'focus';

  @IsNotEmpty()
  @IsString()
  abundanceAreaId: string;
}
