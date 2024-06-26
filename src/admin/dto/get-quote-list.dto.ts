import { IsNotEmpty, IsOptional } from 'class-validator';

export class GetQuoteListDto {
  @IsNotEmpty({ message: 'areaId should not be empty' })
  areaId: string;

  @IsOptional()
  status: string;

  @IsOptional()
  quote: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}
