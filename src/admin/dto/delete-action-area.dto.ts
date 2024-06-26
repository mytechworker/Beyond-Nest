import { IsNotEmpty } from 'class-validator';

export class DeleteActionAreaDto {
  @IsNotEmpty()
  id: string;
}
