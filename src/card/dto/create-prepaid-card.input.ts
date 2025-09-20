import { IsOptional } from "class-validator";

export class CreatePrepaidCardInput {
  readonly program_id: string;

  readonly card_name: string;

  readonly email: string;

  @IsOptional()
  readonly mobile?: string;
}
