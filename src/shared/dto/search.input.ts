import { Max, Min } from "class-validator";

export class SearchInput {
  @Min(1)
  @Max(50)
  readonly take: number = 5;

  @Min(0)
  readonly skip: number = 0;

  readonly query?: string;
}
