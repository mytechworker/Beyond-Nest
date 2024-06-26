import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class DeleteSmartActionDto {
  @IsBoolean()
  @IsOptional()
  today?: boolean;
}
