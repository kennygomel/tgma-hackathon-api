import { IsOptional } from "class-validator";

export class WithdrawInput {
  readonly amount: number;

  @IsOptional()
  readonly description?: string;
}
