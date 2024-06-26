// dto/delete-user-account.dto.ts
import { IsNotEmpty } from 'class-validator';

export class DeleteUserAccountDto {
  @IsNotEmpty()
  userId: string;
}
