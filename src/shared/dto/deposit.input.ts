import { IsOptional, Min } from "class-validator";

export class DepositInput {
  readonly reference_id: string;

  readonly from_currency_id: string;

  @Min(0.01)
  readonly amount: number;

  @IsOptional()
  readonly note?: string;
}
