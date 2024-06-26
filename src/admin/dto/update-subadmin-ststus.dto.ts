// src/admin/dto/update-subadmin-status.dto.ts
import { IsNotEmpty } from 'class-validator';

export class UpdateSubAdminStatusDto {
  @IsNotEmpty()
  status: string;
}
