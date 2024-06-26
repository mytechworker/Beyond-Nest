import { IsNotEmpty, IsString } from 'class-validator';

export class ActionAreaDto  {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  description?: string;

  @IsString()
  helpText?: string;

  @IsNotEmpty()
  @IsString()
  type: 'action';

  @IsNotEmpty()
  @IsString()
  focusAreaId: string;
}
