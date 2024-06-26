// add-link.dto.ts
import { IsNotEmpty, IsOptional, IsUrl, IsEnum } from 'class-validator';

export class AddLinkDto {
  @IsNotEmpty({ message: 'Journey ID should not be empty' })
  journeyId: string;

  @IsOptional()
  journeyGuideId?: string;

  @IsNotEmpty({ message: 'Web page link should not be empty' })
  @IsUrl({}, { message: 'Invalid URL format for web page link' })
  webPageLink: string;

  userId?: string; // Added userId as optional
  stageType?: 'inspiration' | 'vision' | 'discovery' | ''; // Added stageType as optional
}
