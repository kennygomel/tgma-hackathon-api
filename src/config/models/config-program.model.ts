import { CardBrand } from "src/card/enums/card-brand.enum";
import { ConfigProgramFormFactor } from "src/config/enums/config-program-form-factor.enum";
import { ConfigProgramOrderType } from "src/config/enums/config-program-order-type.enum";
import { ConfigProgramRequiredFieldType } from "src/config/enums/config-program-required-field-type.enum";
import { ConfigProgramType } from "src/config/enums/config-program-type.enum";
import { SubAccountType } from "src/sub-account/enums/sub-account-type.enum";

export class ConfigProgram {
  id: string;
  form_factor: ConfigProgramFormFactor;
  type: ConfigProgramType;
  brand: CardBrand;
  tokenizable: boolean;
  name: string;
  sub_account_type: SubAccountType;
  account_currency: string;
  description: string;
  card_monthly_fee: number | null;
  required_fields: { [k: string]: ConfigProgramRequiredFieldType };
  order_types: ConfigProgramOrderType[];
  issuing_price_usd: number;
  initial_topup_usd: number;
  max_cards: number;
  cards_per_day: number;
  cards_per_month: number;
}
