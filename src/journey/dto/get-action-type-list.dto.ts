// get-action-type-listing-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { ActionType } from 'src/databases/models/action-type.schema';

export class GetActionTypeListingResponseDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  deleted?: boolean;

  @ApiProperty()
  createdDate?: Date;

  @ApiProperty()
  updatedDate?: Date;
}


  


export class ActionTypeDto {
  @ApiProperty()
  type: string;

  @ApiProperty()
  description: string;
}
