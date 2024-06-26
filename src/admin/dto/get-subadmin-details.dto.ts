// This DTO might be unnecessary for just an ID, but it can be created for consistency or if further validation is needed
import { IsString, IsNotEmpty } from 'class-validator';

export class GetSubAdminDetailsDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
