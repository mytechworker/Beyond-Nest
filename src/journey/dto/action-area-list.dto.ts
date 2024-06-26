import { IsNotEmpty, IsString } from 'class-validator';

export class ActionAreaListDto {
  @IsNotEmpty()
  @IsString()
  focusAreaId: string;
}
