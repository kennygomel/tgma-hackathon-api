import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { CardService } from "./card.service";
import { CardController } from "./card.controller";

@Module({
  providers: [CardService],
  imports: [HttpModule],
  controllers: [CardController],
})
export class CardModule {}
