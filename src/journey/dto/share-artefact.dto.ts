import { IsNotEmpty, IsString } from 'class-validator';

export class ShareArtefactDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  type: string;
}