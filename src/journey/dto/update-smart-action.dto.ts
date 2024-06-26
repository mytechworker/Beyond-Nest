// import { IsNotEmpty, IsString, IsOptional, IsDateString, IsBoolean } from 'class-validator';

// export class UpdateSmartActionDto {
//   @IsNotEmpty()
//   @IsString()
//   smartActionId: string;

//   recurringUpdateFields?: any; // Define your type appropriately
//   trackProgressUpdateFields?: any; // Define your type appropriately
//   actionTypeOtherFields?: any; // Define your type appropriately

//   @IsOptional()
//   checkList?: {
//     _id: string;
//     text: string;
//     status: string;
//   }[];

//   @IsOptional()
//   @IsString()
//   status?: string;

//   @IsOptional()
//   @IsBoolean()
//   today?: boolean;  

//   @IsOptional()
//   @IsString()
//   targetUnit?: string;

//   @IsOptional()
//   @IsBoolean()
//   completedDate?: boolean;
  
//   @IsOptional()
//   @IsDateString()
//   completedDateString?: string;

//   @IsOptional()
//   @IsDateString()
//   updatedDate?: string;
// }

import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateSmartActionDto {
  @IsNotEmpty()
  @IsString()
  smartActionId: string;

  @IsOptional()
  recurringUpdateFields?: any; // Define your type appropriately

  @IsOptional()
  trackProgressUpdateFields?: any; // Define your type appropriately

  @IsOptional()
  actionTypeOtherFields?: any; // Define your type appropriately

  @IsOptional()
  checkList?: {
    _id: string;
    text: string;
    status: string;
  }[];

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsBoolean()
  today?: boolean;  
}