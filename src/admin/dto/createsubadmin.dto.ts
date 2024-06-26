import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class CreateSubAdminDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
