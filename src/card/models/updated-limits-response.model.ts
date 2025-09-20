import { UpdateCardLimitsInput } from "src/card/dto/update-card-limits.input";
import { ActionResult } from "src/card/models/action-result.model";
import { CardLimits } from "src/card/models/card-limits.model";

export class UpdatedLimitsResponse extends ActionResult {
  data: {
    status: string;
    message: string;
    data: CardLimits;
    requested_limits: UpdateCardLimitsInput;
    actual_limits: Pick<
      CardLimits,
      | "daily_cap"
      | "monthly_cap"
      | "per_transaction_cap"
      | "daily_enabled"
      | "per_transaction_enabled"
      | "all_time_enabled"
      | "weekly_enabled"
      | "yearly_enabled"
    >;
    has_differences: boolean;
  };
}
