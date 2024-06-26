import { IsString, IsNotEmpty, IsOptional, IsArray, IsEnum } from 'class-validator';

export class NewRecordDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  journeyGuideId?: string;

  @IsNotEmpty()
  @IsString()
  journeyId: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(['inspiration', 'vision', 'discovery', 'global'])
  stageType: string;

  @IsArray()
  @IsNotEmpty({ each: true })
  tags: string[];

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(['journalEntries', 'stickyNotes'])
  type: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  userId: string;
}
