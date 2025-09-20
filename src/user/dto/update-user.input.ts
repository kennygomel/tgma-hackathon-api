import { IsOptional } from "class-validator";

export class UpdateUserInput {
  @IsOptional()
  readonly first_name?: string;

  @IsOptional()
  readonly last_name?: string;

  @IsOptional()
  readonly middle_name?: string;

  @IsOptional()
  readonly passport_series?: string;

  @IsOptional()
  readonly passport_number?: string;

  @IsOptional()
  readonly address?: string;

  @IsOptional()
  readonly date_of_birth?: string;

  @IsOptional()
  readonly email?: string;

  @IsOptional()
  readonly mobile?: string;

  @IsOptional()
  readonly terms_accepted?: boolean;
}
