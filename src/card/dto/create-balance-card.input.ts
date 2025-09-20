import { IsOptional } from "class-validator";

export class CreateBalanceCardInput {
  readonly sub_account_id: string;

  readonly card_name: string;

  @IsOptional()
  readonly email?: string;

  @IsOptional()
  readonly mobile?: string;
}
