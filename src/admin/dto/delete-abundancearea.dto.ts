import { IsNotEmpty } from 'class-validator';

export class DeleteAbundanceAreaDto {
  @IsNotEmpty()
  id: string;
}
