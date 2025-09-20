import { WalletBalanceMeta } from "src/wallet/models/wallet-balance-meta.model";

export class WalletBalanceCurrencyDetails {
  meta: WalletBalanceMeta;
  uuid: string;
  decimal: number;
  enabled: boolean;
  is_crypto: boolean;
}
