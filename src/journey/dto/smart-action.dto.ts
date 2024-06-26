import { IsOptional, IsString, IsArray, IsEnum, IsNumber, IsDate, IsDateString, IsMongoId, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

enum LogTypeEnum {
  Numeric = 'numeric',
  Checkbox = 'checkbox',
  None = '', // Assuming empty string is a valid default in your schema
}

enum StatusEnum {
  Completed = 'completed',
  Started = 'started',
  ToDo = 'toDo',
  Planned = 'planned',
  None = '', // Assuming empty string is a valid default in your schema
}

enum ActionTypeEnum {
  Habit = 'habit',
  Target = 'target',
  Standalone = 'standalone',
  None = '', // Assuming empty string is a valid default in your schema
}

export class ActionTrackProgressDTO {
  @IsOptional()
  @IsString()
  trackProgressType?: string;

  @IsOptional()
  @IsArray()
  weeklyDay?: string[];

  @IsOptional()
  @IsString()
  monthlyType?: string;

  @IsOptional()
  @IsString()
  monthlyDay?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  annualDate?: Date;
}

export class ActionTargetTypeDTO {
  @IsOptional()
  @IsMongoId()
  smartActionId?: string;

  @IsOptional()
  @IsMongoId()
  userId?: string;

  @IsOptional()
  @IsNumber()
  beginningValue?: number;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsNumber()
  target?: number;
}

export class RecurringOtherFieldsDTO {
  @IsString()
  @IsOptional()
  recurringType?: string;

  @IsString()
  @IsOptional()
  monthlyType?: string;

  @IsString()
  @IsOptional()
  monthlyDay?: string;

  @IsArray()
  @IsOptional()
  everyDay?: string[];

  @IsDate()
  @IsOptional()
  annualyDate?: Date;
}

export class SmartActionDTO {
  @IsOptional()
  @IsString()
  name: string = '';

  @IsOptional()
  @IsString()
  userId: string[];

  @IsOptional()
  @IsMongoId({ each: true })
  journeyId: string[] = [];

  @IsOptional()
  @IsMongoId({ each: true })
  discoveryGoalId: string[] = [];

  @IsOptional()
  @IsArray()
  checkList: { text: string }[] = [];

  @IsOptional()
  @IsEnum(LogTypeEnum)
  logType: LogTypeEnum = LogTypeEnum.None;

  @IsOptional()
  @IsString()
  description: string = '';

  @IsOptional()
  @IsArray()
  tags: string[] = [];

  @IsOptional()
  @IsEnum(StatusEnum)
  status: StatusEnum = StatusEnum.Planned;

  @IsOptional()
  @IsString()
  targetUnit: string = '';

  @IsOptional()
  @IsNumber()
  targetValue: number = 0;

  @IsOptional()
  @IsDateString()
  startDate: Date | null = null;

  @IsOptional()
  @IsDateString()
  goalDate: Date | null = null;

  @IsOptional()
  @IsEnum(ActionTypeEnum)
  actionType: ActionTypeEnum = ActionTypeEnum.None;

  @IsOptional()
  @IsMongoId()
  actionTypeId: string | null = null;

  @IsOptional()
  @IsMongoId()
  habitId: string | null = null;

  @IsOptional()
  @IsMongoId()
  targetId: string | null = null;

  @IsOptional()
  @ValidateNested()
  @Type(() => ActionTargetTypeDTO)
  actionTypeOtherFields?: ActionTargetTypeDTO;

  @IsOptional()
  @ValidateNested()
  @Type(() => RecurringOtherFieldsDTO)
  recurringOtherFields?: RecurringOtherFieldsDTO;

  @IsOptional()
  @ValidateNested()
  @Type(() => ActionTrackProgressDTO)
  trackProgressOtherFields?: ActionTrackProgressDTO;

  @IsOptional()
  @IsNumber()
  currentLogTotal: number = 0;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  completedDate: Date | null = null;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  createdDate: Date = new Date();

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  updatedDate: Date = new Date();
}
