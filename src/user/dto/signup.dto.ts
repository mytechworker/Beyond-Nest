import { IsEmail, IsOptional, IsString, IsBoolean } from 'class-validator';

export class SignupDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  countryCode?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  displayName?: string;

  @IsOptional()
  @IsString()
  userName?: string;

  @IsOptional()
  @IsBoolean()
  notificationStatus?: boolean;

  @IsOptional()
  @IsString()
  profileImage?: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsBoolean()
  isRegistrationCompleted?: boolean;
}
