import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigService } from "./config.service";
import { ConfigController } from "./config.controller";

@Module({
  providers: [ConfigService],
  imports: [HttpModule],
  controllers: [ConfigController],
})
export class ConfigModule {}
