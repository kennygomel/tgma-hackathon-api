import { Controller, Get, Param } from "@nestjs/common";
import { Observable } from "rxjs";
import { ConfigService } from "src/config/config.service";
import { ConfigProgramArgsInput } from "src/config/dto/config-program-args.input";
import { ConfigProgram } from "src/config/models/config-program.model";
import { PaginatedResponse } from "src/shared/models/paginated-response.model";

@Controller("config")
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  // - GET /programs – список программ
  @Get("programs")
  getPrograms(
    @Param() params: ConfigProgramArgsInput,
  ): Observable<PaginatedResponse<ConfigProgram[]>> {
    return this.configService.getPrograms(params);
  }
}
