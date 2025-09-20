import { IsOptional } from "class-validator";

export class UpdateCardInput {
  @IsOptional()
  readonly card_name?: string;

  @IsOptional()
  readonly title?: string;
}
