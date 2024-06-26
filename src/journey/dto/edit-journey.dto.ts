import { IsNotEmpty, IsOptional, IsString, IsDate } from 'class-validator';

export class EditJourneyDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  abundanceAreaId?: string;

  @IsOptional()
  @IsString()
  focusAreaId?: string;

  @IsOptional()
  @IsString()
  actionAreaId?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsDate()
  updatedDate?: Date;

  @IsOptional()
  @IsDate()
  statusUpdatedDate?: Date;

  @IsOptional()
  @IsDate()
  completedDate?: Date;
}
