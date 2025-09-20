import { IsOptional } from "class-validator";

export class CreateCardInput {
  readonly program_id: string;

  @IsOptional() // todo: required if program.sub_account_type = 'balance'
  readonly sub_account_id?: string;

  readonly card_name: string;

  @IsOptional()
  readonly email?: string;

  @IsOptional()
  readonly mobile?: string;
}
