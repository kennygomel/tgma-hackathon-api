import { CardBrand } from "src/card/enums/card-brand.enum";
import { CardFormFactor } from "src/card/enums/card-form-factor.enum";
import { CardStatus } from "src/card/enums/card-status.enum";
import { CardType } from "src/card/enums/card-type.enum";
import { CardLimits } from "src/card/models/card-limits.model";
import { CurrencyCode } from "src/shared/enums/currency-code.enum";

export class Card {
  id: string;
  title: string;
  last4: string;
  expiration_date: string;
  expiration_date_short: string;
  form_factor: CardFormFactor;
  status: CardStatus;
  currency: CurrencyCode;
  created_at: string;
  updated_at: string;
  sub_account_id: string;
  vendor_sub_account_id: string;
  brand: CardBrand;
  vendor_id: string;
  vendor_card_id: string;
  tokenizable: boolean;
  spend_cap: number;
  spent_amount: number;
  card_name: string;
  email: string | null;
  mobile: string | null;
  type: CardType;
  wallet_id: string;
  program_id: string;
  limits: CardLimits;
}
