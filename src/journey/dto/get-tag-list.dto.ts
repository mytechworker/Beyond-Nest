// // src/dto/get-tag-listing.dto.ts

// import { IsString } from 'class-validator';

// export class GetTagListingDto {
//   @IsString()
//   type: string;
// }


import { IsNotEmpty } from 'class-validator';

export class TagListingDto {
  @IsNotEmpty({ message: 'Type must not be empty' })
  type: string;
}
