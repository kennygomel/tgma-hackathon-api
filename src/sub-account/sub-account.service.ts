import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AxiosResponse } from "axios";
import { map, Observable } from "rxjs";
import {
  NONAME_CARDS_API_URL,
  NONAME_CARDS_AXIOS_CONFIG,
} from "src/shared/constants";
import { DepositInput } from "src/shared/dto/deposit.input";
import { TransactionArgsInput } from "src/shared/dto/transaction-args.input";
import { WithdrawInput } from "src/shared/dto/withdraw.input";
import { PaginatedResponse } from "src/shared/models/paginated-response.model";
import { Transaction } from "src/shared/models/transaction.model";
import { CreateSubAccountInput } from "src/sub-account/dto/create-sub-account.input";
import { SubAccountArgsInput } from "src/sub-account/dto/sub-account-args.input";
import { SubAccount } from "src/sub-account/models/sub-account.model";

const BASE_URL = `${NONAME_CARDS_API_URL}/issuing/sub-accounts`;

@Injectable()
export class SubAccountService {
  constructor(private readonly httpService: HttpService) {}

  create(input: CreateSubAccountInput): Observable<SubAccount> {
    return this.httpService
      .post(BASE_URL, input, NONAME_CARDS_AXIOS_CONFIG)
      .pipe(
        map(
          (response: AxiosResponse<{ data: SubAccount }>) => response.data.data,
        ),
      );
  }

  get(id: string): Observable<SubAccount> {
    return this.httpService
      .get(`${BASE_URL}/${id}`, NONAME_CARDS_AXIOS_CONFIG)
      .pipe(
        map(
          (response: AxiosResponse<{ data: SubAccount }>) => response.data.data,
        ),
      );
  }

  getList(
    params: SubAccountArgsInput,
  ): Observable<PaginatedResponse<SubAccount[]>> {
    return this.httpService
      .get(BASE_URL, {
        ...NONAME_CARDS_AXIOS_CONFIG,
        params,
      })
      .pipe(
        map(
          (response: AxiosResponse<PaginatedResponse<SubAccount[]>>) =>
            response.data,
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
}
