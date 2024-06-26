// get-action-log.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class GetActionLogDto {
  @IsNotEmpty()
  @IsString()
  smartActionId: string;
}
