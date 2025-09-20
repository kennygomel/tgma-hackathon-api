import { IsOptional } from "class-validator";

export class UpdateUserInput {
  @IsOptional()
  readonly email?: string;

  @IsOptional()
  readonly mobile?: string;
}
