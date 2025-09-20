import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseInterceptors,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { MaskSensitiveDataInterceptor } from "src/shared/interceptors/mask-sensitive-data.interceptor";
import { Wallet } from "src/wallet/models/wallet.model";
import { WalletService } from "src/wallet/wallet.service";

@Controller("wallet")
@UseInterceptors(MaskSensitiveDataInterceptor, ClassSerializerInterceptor)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  // - GET /wallets - получить кошелёк
  @Get()
  getWallet(): Observable<Wallet> {
    return this.walletService.get();
  }
}
