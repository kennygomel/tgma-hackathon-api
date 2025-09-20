import { IsOptional } from "class-validator";

export class CreateSubAccountInput {
  readonly program_id: string;

  readonly nick_name: string;

  @IsOptional()
  readonly name?: string;

  @IsOptional()
  readonly title?: string;

  @IsOptional()
  readonly vendor_user_id?: string;

  @IsOptional()
  readonly vendor_business_id?: string;
}
