import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { WalletService } from "./wallet.service";
import { WalletController } from "./wallet.controller";

@Module({
  providers: [WalletService],
  imports: [HttpModule],
  controllers: [WalletController],
})
export class WalletModule {}
