import { IsNotEmpty } from 'class-validator';

export class DeleteDiscoveryGoalDto {
  @IsNotEmpty({ message: 'Discovery Goal ID should not be empty' })
  id: string;
}
