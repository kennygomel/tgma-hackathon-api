import { IsOptional, Max, Min } from "class-validator";
import { CardStatus } from "src/card/enums/card-status.enum";

export class CardArgsInput {
  @Min(0)
  readonly offset: number = 0;

  @Min(10)
  @Max(100)
  readonly limit: number = 10;

  @IsOptional()
  readonly program_id?: string;

  @IsOptional()
  readonly status?: CardStatus;
}
