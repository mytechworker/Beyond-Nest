// delete-link.dto.ts

import { IsNotEmpty } from 'class-validator';

export class DeleteLinkDto {
  @IsNotEmpty({ message: 'Link ID should not be empty' })
  id: string;
}
