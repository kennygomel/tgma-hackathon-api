import { WalletBalanceCryptoDetails } from "src/wallet/models/wallet-balance-crypto-details.model";
import { WalletBalanceCurrencyDetails } from "src/wallet/models/wallet-balance-currency-details.model";

export class WalletBalanceDetails {
  uuid: string;
  amount: number;
  fiat_amount: number;
  crypto: WalletBalanceCryptoDetails;
  currency: WalletBalanceCurrencyDetails;
  crypto_id: string;
  wallet_id: string;
}
