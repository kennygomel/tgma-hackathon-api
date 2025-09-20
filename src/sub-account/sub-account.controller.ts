import {
  Body,
  Controller,
  Get,
  NotImplementedException,
  Param,
  Post,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { TransactionArgsInput } from 'src/shared/dto/transaction-args.input';
import { PaginatedResponse } from "src/shared/models/paginated-response.model";
import { Transaction } from "src/shared/models/transaction.model";
import { CreateSubAccountInput } from "src/sub-account/dto/create-sub-account.input";
import { SubAccountArgsInput } from "src/sub-account/dto/sub-account-args.input";
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
  ): Observable<PaginatedResponse<Transaction[]>> {
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
  //   return this.subAccountService.deposit(id, input);
  // }
  // todo: figure out why API returns "Exchange rate not found"
  @Post(":id/deposit")
  deposit(): void {
    throw new NotImplementedException("Action is not yet implemented");
  }
}
