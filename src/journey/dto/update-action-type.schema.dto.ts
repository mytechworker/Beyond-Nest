import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateActionTypeDto {
  @IsOptional()
  id?: string;

  @IsOptional()
  deleteId?: string;

  @IsNotEmpty()
  type: string;

  description?: string;
}


export class ActionTypeResponseDto {
    message: string;
    success: boolean;
    data: any;
  }
  