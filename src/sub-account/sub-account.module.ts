import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { SubAccountService } from "./sub-account.service";
import { SubAccountController } from "./sub-account.controller";

@Module({
  providers: [SubAccountService],
  imports: [HttpModule],
  controllers: [SubAccountController],
})
export class SubAccountModule {}
