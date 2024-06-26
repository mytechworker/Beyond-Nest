// src/share/dto/share-response.dto.ts

import { IsNotEmpty, IsString } from 'class-validator';

// export class ShareResponseDto {
//   @IsNotEmpty()
//   @IsString()
//   message: string;

//   @IsNotEmpty()
//   success: boolean;

//   @IsNotEmpty()
//   @IsString()
//   id: string;
// }


export class ShareResponseDto {
    message: string;
    success: boolean;
    data: any; // Adjust the data type as per your response structure
  }