import {
  Body,
  Controller,
  Get,
  NotImplementedException,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { PaginatedResponse } from "src/shared/models/paginated-response.model";
import { CreateSubAccountInput } from "src/sub-account/dto/create-sub-account.input";
import { DepositInput } from 'src/sub-account/dto/deposit.input';
import { SubAccountArgsInput } from "src/sub-account/dto/sub-account-args.input";
import { TransactionArgsInput } from "src/sub-account/dto/transaction-args.input";
import { WithdrawInput } from "src/sub-account/dto/withdraw.input";
import { SubAccountTransaction } from "src/sub-account/models/sub-account-transaction.model";
import { SubAccount } from "src/sub-account/models/sub-account.model";
import { SubAccountService } from "src/sub-account/sub-account.service";

@Controller("sub-account")
export class SubAccountController {
  constructor(private readonly subAccountService: SubAccountService) {}

  // - GET /subaccounts – список субаккаунтов
  @Get()
  getSubAccounts(
    @Param() params: SubAccountArgsInput,
  ): Observable<PaginatedResponse<SubAccount[]>> {
    return this.subAccountService.getList(params);
  }

  // - POST /subaccounts – создать субаккаунт
  @Post()
  createSubAccount(
    @Body() input: CreateSubAccountInput,
  ): Observable<SubAccount> {
    return this.subAccountService.create(input);
  }

  // - GET /subaccounts/:id – получить по ID
  @Get(":id")
  getSubAccountById(@Param("id") id: string): Observable<SubAccount> {
    return this.subAccountService.get(id);
  }

  // - GET /subaccounts/:id/transactions – транзакции
  @Get(":id/transactions")
  getSubAccountTransactions(
    @Param("id") id: string,
    @Param() params: TransactionArgsInput,
  ): Observable<PaginatedResponse<SubAccountTransaction[]>> {
    return this.subAccountService.getTransactions(id, params);
  }

  // - POST /subaccounts/:id/withdraw – вывод средств
  // @Post(":id/withdraw")
  // withdraw(
  //   @Param("id") id: string,
  //   @Body() input: WithdrawInput,
  // ): Observable<SubAccountTransaction> {
  //   return this.subAccountService.withdraw(id, input);
  // }
  // todo: update and remove exception when Noname Cards API will be ready
  @Post(":id/withdraw")
  withdraw(): void {
    throw new NotImplementedException("Action is not yet implemented");
  }

  // - POST /subaccounts/:id/deposit – пополнение
  // @Post(":id/deposit")
  // deposit(
  //   @Param("id") id: string,
  //   @Body() input: DepositInput,
  // ): Observable<SubAccountTransaction> {
  //   return this.subAccountService.withdraw(id, input);
  // }
  // todo: figure out why API returns "Exchange rate not found"
  @Post(":id/deposit")
  deposit(): void {
    throw new NotImplementedException("Action is not yet implemented");
  }
}
