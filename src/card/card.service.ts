import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AxiosResponse } from "axios";
import { map, Observable } from "rxjs";
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
import {
  NONAME_CARDS_API_URL,
  NONAME_CARDS_AXIOS_CONFIG,
} from "src/shared/constants";
import { DepositInput } from "src/shared/dto/deposit.input";
import { TransactionArgsInput } from "src/shared/dto/transaction-args.input";
import { WithdrawInput } from "src/shared/dto/withdraw.input";
import { PaginatedResponse } from "src/shared/models/paginated-response.model";
import { Transaction } from "src/shared/models/transaction.model";

const BASE_URL = `${NONAME_CARDS_API_URL}/issuing/cards`;

@Injectable()
export class CardService {
  constructor(private readonly httpService: HttpService) {}

  create(input: CreateCardInput): Observable<Card> {
    return this.httpService
      .post(BASE_URL, input, NONAME_CARDS_AXIOS_CONFIG)
      .pipe(
        map((response: AxiosResponse<{ data: Card }>) => response.data.data),
      );
  }

  /**
   * @deprecated This function is deprecated. Use `create()` instead.
   */
  createBalance(input: CreateBalanceCardInput): Observable<Card> {
    return this.httpService
      .post(`${BASE_URL}/balance`, input, NONAME_CARDS_AXIOS_CONFIG)
      .pipe(
        map((response: AxiosResponse<{ data: Card }>) => response.data.data),
      );
  }

  /**
   * @deprecated This function is deprecated. Use `create()` instead.
   */
  createPrepaid(input: CreatePrepaidCardInput): Observable<Card> {
    return this.httpService
      .post(`${BASE_URL}/prepaid`, input, NONAME_CARDS_AXIOS_CONFIG)
      .pipe(
        map((response: AxiosResponse<{ data: Card }>) => response.data.data),
      );
  }

  delete(id: string): Observable<ActionResult> {
    return this.httpService
      .delete(`${BASE_URL}/${id}`, NONAME_CARDS_AXIOS_CONFIG)
      .pipe(map((response: AxiosResponse<ActionResult>) => response.data));
  }

  deposit(id: string, input: DepositInput): Observable<Transaction> {
    return this.httpService
      .post(`${BASE_URL}/${id}/deposit`, input, NONAME_CARDS_AXIOS_CONFIG)
      .pipe(
        map(
          (response: AxiosResponse<{ data: Transaction }>) =>
            response.data.data,
        ),
      );
  }

  freeze(id: string): Observable<ActionResult> {
    return this.httpService
      .put(`${BASE_URL}/${id}/freeze`, NONAME_CARDS_AXIOS_CONFIG)
      .pipe(map((response: AxiosResponse<ActionResult>) => response.data));
  }

  get(id: string): Observable<Card> {
    return this.httpService
      .get(`${BASE_URL}/${id}`, NONAME_CARDS_AXIOS_CONFIG)
      .pipe(
        map((response: AxiosResponse<{ data: Card }>) => response.data.data),
      );
  }

  getList(params: CardArgsInput): Observable<PaginatedResponse<Card[]>> {
    return this.httpService
      .get(BASE_URL, {
        ...NONAME_CARDS_AXIOS_CONFIG,
        params,
      })
      .pipe(
        map(
          (response: AxiosResponse<PaginatedResponse<Card[]>>) => response.data,
        ),
      );
  }

  getTransactions(
    id: string,
    params: TransactionArgsInput,
  ): Observable<PaginatedResponse<Transaction[]>> {
    return this.httpService
      .get(`${BASE_URL}/${id}/transactions`, {
        ...NONAME_CARDS_AXIOS_CONFIG,
        params,
      })
      .pipe(
        map(
          (response: AxiosResponse<PaginatedResponse<Transaction[]>>) =>
            response.data,
        ),
      );
  }

  getSensitiveData(id: string): Observable<CardSensitiveData> {
    return this.httpService
      .get(`${BASE_URL}/${id}/sensitive`, NONAME_CARDS_AXIOS_CONFIG)
      .pipe(
        map(
          (response: AxiosResponse<{ data: CardSensitiveData }>) =>
            response.data.data,
        ),
      );
  }

  unfreeze(id: string): Observable<ActionResult> {
    return this.httpService
      .put(`${BASE_URL}/${id}/unfreeze`, NONAME_CARDS_AXIOS_CONFIG)
      .pipe(map((response: AxiosResponse<ActionResult>) => response.data));
  }

  update(id: string, input: UpdateCardInput): Observable<Card> {
    return this.httpService
      .patch(`${BASE_URL}/${id}`, input, NONAME_CARDS_AXIOS_CONFIG)
      .pipe(
        map((response: AxiosResponse<{ data: Card }>) => response.data.data),
      );
  }

  updateLimits(
    id: string,
    input: UpdateCardLimitsInput,
  ): Observable<UpdatedLimitsResponse> {
    return this.httpService
      .put(`${BASE_URL}/${id}/limits`, input, NONAME_CARDS_AXIOS_CONFIG)
      .pipe(
        map((response: AxiosResponse<UpdatedLimitsResponse>) => response.data),
      );
  }

  withdraw(id: string, input: WithdrawInput): Observable<Transaction> {
    return this.httpService
      .post(`${BASE_URL}/${id}/withdraw`, input, NONAME_CARDS_AXIOS_CONFIG)
      .pipe(
        map(
          (response: AxiosResponse<{ data: Transaction }>) =>
            response.data.data,
        ),
      );
  }
}
