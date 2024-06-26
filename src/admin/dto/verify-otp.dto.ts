// verify-otp.dto.ts
import { IsNotEmpty, IsEmail, IsNumber } from 'class-validator';

export class VerifyOtpDto {
    @IsEmail()
    email: string;
  
    @IsNumber() // Assuming otp is stored as a number in the database
    otp: number;
  }
  
