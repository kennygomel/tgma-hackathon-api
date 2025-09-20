import { IsOptional, Max, Min } from "class-validator";
import { TransactionType } from "src/sub-account/enums/transaction-type.enum";

export class TransactionArgsInput {
  @Min(0)
  readonly offset: number = 0;

  @Min(10)
  @Max(100)
  readonly limit: number = 10;

  @IsOptional()
  readonly program_id?: string;

  @IsOptional()
  readonly type?: TransactionType;

  @IsOptional()
  readonly from_date?: string;

  @IsOptional()
  readonly to_date?: string;
}
