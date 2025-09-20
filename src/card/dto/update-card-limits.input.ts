import { IsOptional } from "class-validator";

export class UpdateCardLimitsInput {
  @IsOptional()
  readonly card_name?: string;

  @IsOptional()
  readonly title?: string;
}
