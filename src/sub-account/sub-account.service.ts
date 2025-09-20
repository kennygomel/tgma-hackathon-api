import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AxiosResponse } from "axios";
import { map, Observable, tap } from "rxjs";
import {
  NONAME_CARDS_API_URL,
  NONAME_CARDS_AXIOS_CONFIG,
} from "src/shared/constants";
import { PaginatedResponse } from "src/shared/models/paginated-response.model";
import { CreateSubAccountInput } from "src/sub-account/dto/create-sub-account.input";
import { DepositInput } from "src/sub-account/dto/deposit.input";
import { SubAccountArgsInput } from "src/sub-account/dto/sub-account-args.input";
import { TransactionArgsInput } from "src/sub-account/dto/transaction-args.input";
import { WithdrawInput } from "src/sub-account/dto/withdraw.input";
import { SubAccountTransaction } from "src/sub-account/models/sub-account-transaction.model";
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
  ): Observable<PaginatedResponse<SubAccountTransaction[]>> {
    return this.httpService
      .get(`${BASE_URL}/${id}/transactions`, {
        ...NONAME_CARDS_AXIOS_CONFIG,
        params,
      })
      .pipe(
        map(
          (
            response: AxiosResponse<PaginatedResponse<SubAccountTransaction[]>>,
          ) => response.data,
        ),
      );
  }

  withdraw(
    id: string,
    input: WithdrawInput,
  ): Observable<SubAccountTransaction> {
    return this.httpService
      .post(`${BASE_URL}/${id}/withdraw`, input, NONAME_CARDS_AXIOS_CONFIG)
      .pipe(
        map(
          (response: AxiosResponse<{ data: SubAccountTransaction }>) =>
            response.data.data,
        ),
      );
  }

  deposit(id: string, input: DepositInput): Observable<SubAccountTransaction> {
    return this.httpService
      .post(`${BASE_URL}/${id}/deposit`, input, NONAME_CARDS_AXIOS_CONFIG)
      .pipe(
        map(
          (response: AxiosResponse<{ data: SubAccountTransaction }>) =>
            response.data.data,
        ),
      );
  }
}
