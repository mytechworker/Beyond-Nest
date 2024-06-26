// update-link.dto.ts

import { IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class UpdateLinkDto {
  @IsNotEmpty({ message: 'Link ID should not be empty' })
  id: string;

  @IsOptional()
  title?: string;

  @IsOptional()
  journeyId?: string;

  @IsOptional()
  journeyGuideId?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Invalid URL format for web page link' })
  webPageLink?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Stage type should not be empty' })
  stageType?: string;
}
