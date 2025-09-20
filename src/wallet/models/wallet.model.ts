import { WalletType } from "src/wallet/enums/wallet-type.enum";
import { WalletBalance } from "src/wallet/models/wallet-balance.model";

export class Wallet {
  created_at: string;
  user_id: string;
  type: WalletType;
  tenant_id: string;
  id: string;
  balance: WalletBalance[];
  base_currency: string;
  fiat_total: number;
  crypto_total: number;
  total_amount: number;
}
