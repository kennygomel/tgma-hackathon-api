import * as fastify from "fastify";
import {
  BadRequestException,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
} from "@nestjs/common";
import { parse, isValid } from "@telegram-apps/init-data-node";
import * as jwt from "jsonwebtoken";
import { map, tap } from "rxjs";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";

@Controller("auth")
export class AuthController {
  constructor(private userService: UserService) {}

  @Post("sign-in")
  signIn(@Req() req: fastify.FastifyRequest, @Res() res: fastify.FastifyReply) {
    const { initData } = req.body as { initData: string };

    const isInitDataValid = isValid(
      initData,
      process.env.TELEGRAM_BOT_TOKEN as string,
    );

    if (!isInitDataValid) {
      throw new BadRequestException("AUTH__INVALID_INITDATA");
    }

    const telegram_id = parse(initData).user?.id;

    if (!telegram_id) {
      throw new BadRequestException("AUTH__INVALID_INITDATA");
    }

    return this.userService.findByTelegramId(telegram_id.toString()).pipe(
      tap((user: User | null) => {
        if (!user) {
          throw new BadRequestException("AUTH__USER_NOT_FOUND");
        }
      }),
      map((user: User) => {
        const { id, telegram_id } = user; // Достаем нужные данные

        const accessToken = jwt.sign(
          { id, telegram_id },
          process.env.JWT_SECRET as string,
          { expiresIn: "5m" },
        );

        const refreshToken = jwt.sign(
          { id, telegram_id },
          process.env.JWT_REFRESH_SECRET as string,
          { expiresIn: "7d" },
        );

        const cookiesOptions = {
          httpOnly: true,
          secure: true,
          path: "/",
          sameSite: "strict" as const,
        };

        res.cookie("ACCESS_TOKEN", accessToken, cookiesOptions);
        res.cookie("REFRESH_TOKEN", refreshToken, cookiesOptions);

        res.status(HttpStatus.OK).send(true); // Отправляем успешный ответ
      }),
    );
  }
}
