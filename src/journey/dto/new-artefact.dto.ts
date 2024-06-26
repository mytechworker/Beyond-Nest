import { IsString, IsNotEmpty, ValidateNested, IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { NewRecordDto } from './new-record.dto';

export class NewArtefactDto {
  @IsNotEmpty()
  @IsString()
  currentJourneyId: string;

  @IsOptional()
  @IsString()
  currentJourneyGuideId?: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(['ImagesAndVideos', 'Weblinks', 'JournalAndNotepad'])
  type: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => NewRecordDto)
  newRecord: NewRecordDto;
}
