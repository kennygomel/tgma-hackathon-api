import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AxiosResponse } from "axios";
import { map, Observable } from "rxjs";
import { ConfigProgramArgsInput } from "src/config/dto/config-program-args.input";
import { ConfigProgram } from "src/config/models/config-program.model";
import {
  NONAME_CARDS_API_URL,
  NONAME_CARDS_AXIOS_CONFIG,
} from "src/shared/constants";
import { PaginatedResponse } from "src/shared/models/paginated-response.model";

const BASE_URL = `${NONAME_CARDS_API_URL}/issuing/config`;

@Injectable()
export class ConfigService {
  constructor(private readonly httpService: HttpService) {}

  getPrograms(
    params: ConfigProgramArgsInput,
  ): Observable<PaginatedResponse<ConfigProgram[]>> {
    return this.httpService
      .get(`${BASE_URL}/programs`, {
        ...NONAME_CARDS_AXIOS_CONFIG,
        params,
      })
      .pipe(
        map(
          (response: AxiosResponse<PaginatedResponse<ConfigProgram[]>>) =>
            response.data,
        ),
      );
  }
}
