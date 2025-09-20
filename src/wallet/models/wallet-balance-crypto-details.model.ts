import { WalletBalanceType } from "src/wallet/enums/wallet-balance-type.enum";
import { WalletBalanceUtilaType } from "src/wallet/enums/wallet-balance-utila-type.enum";
import { WalletBalanceMeta } from "src/wallet/models/wallet-balance-meta.model";

export class WalletBalanceCryptoDetails {
  id: string;
  icon: string;
  meta: WalletBalanceMeta;
  name: string;
  type: WalletBalanceType;
  uuid: string;
  chain: number;
  token: string;
  symbol: string;
  decimal: number;
  enabled: boolean;
  is_memo: boolean | null;
  chain_id: number;
  contract: string | null;
  coingecko: string;
  hifi_name: string;
  is_crypto: boolean;
  utila_name: string;
  utila_type: WalletBalanceUtilaType;
  is_stablecoin: boolean;
  render_decimal: number;
  render_threshlold: number;
}
