// get-link.dto.ts

import { IsNotEmpty } from 'class-validator';

export class GetLinkDto {
  @IsNotEmpty({ message: 'Link ID should not be empty' })
  id: string;
}
