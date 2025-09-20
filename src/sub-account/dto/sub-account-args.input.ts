import { IsOptional, Max, Min } from "class-validator";
import { SubAccountStatus } from "src/sub-account/enums/sub-account-status.enum";

export class SubAccountArgsInput {
  @Min(0)
  readonly offset: number = 0;

  @Min(10)
  @Max(100)
  readonly limit: number = 10;

  @IsOptional()
  readonly program_id?: string;

  @IsOptional()
  readonly status?: SubAccountStatus;
}
