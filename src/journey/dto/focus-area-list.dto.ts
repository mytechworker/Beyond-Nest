import { IsNotEmpty, IsString } from 'class-validator';

export class FocusAreaListDto {
  @IsNotEmpty({ message: 'Abundance Area ID is required' })
  @IsString({ message: 'Abundance Area ID must be a string' })
  abundanceAreaId: string;
}
