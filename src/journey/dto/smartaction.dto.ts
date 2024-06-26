// // ActionTypeOtherFieldsDto
// import { IsOptional, IsNumber, IsString, IsNotEmpty, IsBoolean, ValidateNested } from 'class-validator';
// import { Type } from 'class-transformer';

// export class ActionTypeOtherFieldsDto {
//   @IsOptional()
//   @IsString()
//   _id?: string;

//   @IsOptional()
//   @IsNumber()
//   target?: number;

//   @IsOptional()
//   @IsString()
//   unit?: string;

//   @IsOptional()
//   @IsNumber()
//   beginningValue?: number;
// }

// // CheckListItemDto

// export class CheckListItemDto {
//   @IsNotEmpty()
//   @IsString()
//   _id: string;

//   @IsNotEmpty()
//   @IsString()
//   text: string;

//   @IsBoolean()
//   status: boolean;
// }

// // SmartActionDto

// export class SmartActionDto {
//   @IsNotEmpty()
//   smartActionId: string;

//   @IsOptional()
//   recurringUpdateFields?: any;

//   @IsOptional()
//   trackProgressUpdateFields?: any;

//   @IsOptional()
//   @ValidateNested()
//   @Type(() => ActionTypeOtherFieldsDto)
//   actionTypeOtherFields?: ActionTypeOtherFieldsDto;

//   @IsOptional()
//   @ValidateNested({ each: true })
//   @Type(() => CheckListItemDto)
//   checkList?: CheckListItemDto[];

//   @IsOptional()
//   today?: boolean;

//   @IsOptional()
//   @IsString()
//   status?: string;
// }


// src/journey/dto/update-smart-action-checklist-status.dto.ts
// src/journey/dto/update-smart-action-checklist-status.dto.ts
// src/journey/dto/update-smart-action-checklist-status.dto.ts
import { IsNotEmpty, IsString, IsOptional, IsDateString, IsArray } from 'class-validator';

export class UpdateSmartActionCheckListStatusDto {
  @IsNotEmpty()
  @IsString()
  smartActionId: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  checkListStatus?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsDateString()
  statusUpdateDate?: string;

  @IsNotEmpty()
  @IsArray()
  ids: string[];
}

