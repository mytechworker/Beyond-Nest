// get-abundance-area-details.dto.ts
import { IsMongoId } from 'class-validator';

export class GetAbundanceAreaDetailsDto {
  @IsMongoId()
  id: string;
}
