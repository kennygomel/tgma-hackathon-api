import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AxiosResponse } from "axios";
import { map, Observable } from "rxjs";
import {
  NONAME_CARDS_API_URL,
  NONAME_CARDS_AXIOS_CONFIG,
} from "src/shared/constants";
import { Wallet } from "src/wallet/models/wallet.model";

const BASE_URL = `${NONAME_CARDS_API_URL}/wallets`;

@Injectable()
export class WalletService {
  constructor(private readonly httpService: HttpService) {}

  get(): Observable<Wallet> {
    return this.httpService
      .get(BASE_URL, NONAME_CARDS_AXIOS_CONFIG)
      .pipe(
        map((response: AxiosResponse<{ data: Wallet }>) => response.data.data),
      );
  }
}
