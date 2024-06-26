// delete-subadmin.dto.ts
import { IsMongoId } from 'class-validator';

export class DeleteSubAdminDto {
  @IsMongoId()
  id: string;
}
