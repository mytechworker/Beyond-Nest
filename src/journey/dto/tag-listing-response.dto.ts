import { IsArray, IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class TagListingResponseDto {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsBoolean()
  success: boolean;

  @IsNotEmpty()
  @IsArray()
  data: {
    journalEntriesTags: string[];
    stickyNotesTags: string[];
  };
}
