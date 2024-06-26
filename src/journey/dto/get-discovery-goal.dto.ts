import { IsNotEmpty } from 'class-validator';

export class GetDiscoveryGoalDto {
  @IsNotEmpty({ message: 'Discovery Goal ID should not be empty' })
  id: string;
}
