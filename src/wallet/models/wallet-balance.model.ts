import { WalletBalanceDetails } from "src/wallet/models/wallet-balance-details.model";

export class WalletBalance {
  symbol: string;
  icon: string;
  name: string;
  is_crypto: boolean;
  decimal: number;
  amount: number;
  fiat_amount: number;
  details: WalletBalanceDetails[];
}
