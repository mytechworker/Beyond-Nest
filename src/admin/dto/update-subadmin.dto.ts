import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class UpdateSubAdminDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  password?: string;
}
