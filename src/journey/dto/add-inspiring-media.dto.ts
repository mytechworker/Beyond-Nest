// // src/journey/dtos/add-inspiring-media.dto.ts

// import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';

// export class AddInspiringMediaDto {
//   @IsNotEmpty()
//   @IsString()
//   type: string;

//   @IsNotEmpty()
//   @IsMongoId()
//   journeyId: string;

//   @IsNotEmpty()
//   @IsMongoId()
//   journeyGuideId: string;

//   @IsString()
//   stageType?: string;

//   document?: string; // Assuming this is the URL or path to the media file

//   userId: string; // Add userId property
// }

// src/journey/dtos/add-inspiring-media.dto.ts
import { IsNotEmpty, IsString, IsMongoId, IsOptional, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class AddInspiringMediaDto {
  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsMongoId()
  journeyId: string;

  @IsNotEmpty()
  @IsMongoId()
  journeyGuideId: string;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  stageType?: string;

  @IsString()
  document?: string;

  @IsOptional()
  @IsArray()
  @Type(() => String)
  tags?: string[];

  userId: string; // This will be set in the controller
}
