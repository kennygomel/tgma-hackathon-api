import { CurrencyCode } from "src/shared/enums/currency-code.enum";
import { SubAccountStatus } from "src/sub-account/enums/sub-account-status.enum";
import { BankAccountDetails } from "src/sub-account/models/bank-account-details.model";

export class SubAccount {
  id: string;
  vendor_sub_account_id: string;
  title: string;
  total_allocated: number;
  total_available: number;
  created_at: string;
  updated_at: string;
  task_status: string; // todo: figure out possible values
  vendor_id: string;
  api_access_id: string;
  currency: CurrencyCode;
  status: SubAccountStatus;
  meta?: { bank_account_details: BankAccountDetails };
  vendor_user_id: string | null;
  vendor_business_id: string | null;
  user_id: string | null;
  internal_meta: string | null;
  wallet_id: string;
  program_id: string;
}
