import { Controller, Get } from "@nestjs/common";
import { Observable } from "rxjs";
import { Wallet } from "src/wallet/models/wallet.model";
import { WalletService } from "src/wallet/wallet.service";

@Controller("wallet")
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  // - GET /wallets - получить кошелёк
  @Get()
  getWallet(): Observable<Wallet> {
    return this.walletService.get();
  }
}
