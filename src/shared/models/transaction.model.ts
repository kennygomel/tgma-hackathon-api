import { CurrencyCode } from "src/shared/enums/currency-code.enum";
import { TransactionStatus } from "src/shared/enums/transaction-status.enum";
import { TransactionType } from "src/shared/enums/transaction-type.enum";
import { TransactionMerchant } from "src/shared/models/transaction-merchant.model";

export class Transaction {
  vendor_transaction_id: string;
  created_at: string;
  cleared_at: string;
  merchant: TransactionMerchant;
  last4: string;
  title: string;
  billing_amount: number;
  billing_currency: CurrencyCode;
  transaction_amount: number;
  transaction_currency: CurrencyCode;
  conversion_rate: number;
  vendor_card_id: string;
  vendor_sub_account_id: string | null;
  failure_reason: string;
  status: TransactionStatus;
  transaction_type: TransactionType;
  is_credit: boolean;
  has_receipt: boolean;
  adjustment_type: string | null;
  review_status: string | null;
  group: string;
  total_amount: number;
  card_id: string | null;
}
