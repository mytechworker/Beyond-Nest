// send-otp.dto.ts
import { IsEmail } from 'class-validator';

export class SendOtpDto {
  @IsEmail()
  email: string;
}
