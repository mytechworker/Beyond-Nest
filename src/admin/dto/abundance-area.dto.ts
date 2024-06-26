import { IsNotEmpty, IsString } from 'class-validator';

export class AbundanceAreaDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  description?: string;

  @IsString()
  helpText?: string;

  @IsNotEmpty()
  @IsString()
  type: 'abundance';

  abundanceAreaId?: string;
}
