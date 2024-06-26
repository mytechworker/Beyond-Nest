import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetActionAreaListingDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  focusAreaId?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  limit?: number = 10;
}
