import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { CardService } from "src/card/card.service";
import { CardArgsInput } from "src/card/dto/card-args.input";
import { CreateBalanceCardInput } from "src/card/dto/create-balance-card.input";
import { CreateCardInput } from "src/card/dto/create-card.input";
import { CreatePrepaidCardInput } from "src/card/dto/create-prepaid-card.input";
import { UpdateCardLimitsInput } from "src/card/dto/update-card-limits.input";
import { UpdateCardInput } from "src/card/dto/update-card.input";
import { ActionResult } from "src/card/models/action-result.model";
import { CardSensitiveData } from "src/card/models/card-sensitive-data.model";
import { Card } from "src/card/models/card.model";
import { UpdatedLimitsResponse } from "src/card/models/updated-limits-response.model";
import { DepositInput } from "src/shared/dto/deposit.input";
import { TransactionArgsInput } from "src/shared/dto/transaction-args.input";
import { WithdrawInput } from "src/shared/dto/withdraw.input";
import { PaginatedResponse } from "src/shared/models/paginated-response.model";
import { Transaction } from "src/shared/models/transaction.model";

@Controller("card")
export class CardController {
  constructor(private readonly cardService: CardService) {}

  // - GET /cards – список карт
  @Get()
  getCards(
    @Param() params: CardArgsInput,
  ): Observable<PaginatedResponse<Card[]> | null> {
    return this.cardService.getList(params);
  }

  // - GET /cards/:id – получить карту по ID
  @Get(":id")
  getCardById(@Param("id") id: string): Observable<Card> {
    return this.cardService.get(id);
  }

  // - POST /cards – создать карту
  @Post()
  createCard(@Body() input: CreateCardInput): Observable<Card> {
    return this.cardService.create(input);
  }

  // - PATCH /cards/:id – обновить карту
  @Patch(":id")
  updateCard(
    @Param("id") id: string,
    @Body() input: UpdateCardInput,
  ): Observable<Card> {
    return this.cardService.update(id, input);
  }

  // - DELETE /cards/:id – удалить карту
  @Delete(":id")
  deleteCard(@Param("id") id: string): Observable<ActionResult> {
    return this.cardService.delete(id);
  }

  // - GET /cards/:id/sensitive – получить чувствительные данные
  @Get(":id/sensitive")
  getCardSensitiveData(@Param("id") id: string): Observable<CardSensitiveData> {
    return this.cardService.getSensitiveData(id);
  }

  // - PUT /cards/:id/freeze – заморозить карту
  @Put(":id/freeze")
  freezeCard(@Param("id") id: string): Observable<ActionResult> {
    return this.cardService.freeze(id);
  }

  // - PUT /cards/:id/unfreeze – разморозить карту
  unfreezeCard(@Param("id") id: string): Observable<ActionResult> {
    return this.cardService.unfreeze(id);
  }

  // - GET /cards/:id/transactions – список транзакций
  @Get(":id/transactions")
  getCardTransactions(
    @Param("id") id: string,
    @Param() params: TransactionArgsInput,
  ): Observable<PaginatedResponse<Transaction[]>> {
    return this.cardService.getTransactions(id, params);
  }

  // - PATCH /cards/:id/limits – обновить лимиты
  @Put(":id/limits")
  updateCardLimits(
    @Param("id") id: string,
    @Body() input: UpdateCardLimitsInput,
  ): Observable<UpdatedLimitsResponse> {
    return this.cardService.updateLimits(id, input);
  }

  // - POST /cards/:id/deposit – пополнение
  @Post(":id/deposit")
  deposit(
    @Param("id") id: string,
    @Body() input: DepositInput,
  ): Observable<Transaction> {
    return this.cardService.deposit(id, input);
  }

  // - POST /cards/:id/withdraw – вывод средств
  @Post(":id/withdraw")
  withdraw(
    @Param("id") id: string,
    @Body() input: WithdrawInput,
  ): Observable<Transaction> {
    return this.cardService.withdraw(id, input);
  }

  // - POST /cards/balance – создание balance card
  /**
   * @deprecated This endpoint is deprecated. Use `createCard` instead.
   */
  @Post("balance")
  createBalanceCard(@Body() input: CreateBalanceCardInput): Observable<Card> {
    return this.cardService.createBalance(input);
  }

  // - POST /cards/prepaid – создание prepaid card
  /**
   * @deprecated This endpoint is deprecated. Use `createCard` instead.
   */
  @Post("prepaid")
  createPrepaidCard(@Body() input: CreatePrepaidCardInput): Observable<Card> {
    return this.cardService.createPrepaid(input);
  }
}
