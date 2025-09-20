import { IsOptional, Max, Min } from "class-validator";

export class ConfigProgramArgsInput {
  @Min(0)
  readonly offset: number = 0;

  @Min(10)
  @Max(100)
  readonly limit: number = 10;

  @IsOptional()
  readonly detailed?: boolean = false;
}
