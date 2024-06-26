import { IsString } from "class-validator";

// src/discovery-goals/dto/action-search.dto.ts
export class ActionSearchDto {
    @IsString()
    type: string;
  }
  