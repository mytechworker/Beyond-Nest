import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsBoolean, IsString, IsArray } from 'class-validator';

export class GetDiscoveryGoalListingDto {
  @IsNotEmpty()
  journeyId: string;
}

export class DiscoveryGoalListingResponseDto {
  @ApiProperty({ example: 'Discovery goals fetched successfully' })
  @IsString()
  message: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  success: boolean;

  @ApiProperty({ type: [Object] }) // Specify the type here if possible
  @IsArray()
  data: any[];
}
