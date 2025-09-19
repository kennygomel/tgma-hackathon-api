import * as fastify from "fastify";
import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from "@nestjs/common";
import { parse, isValid } from "@telegram-apps/init-data-node";
import * as jwt from "jsonwebtoken";
import { map, of, switchMap, tap } from "rxjs";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";

type AuthUser = Pick<User, "id" | "telegram_id">;

const COOKIES_OPTION = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.SECURE_COOKIES === "true",
  path: "/",
};

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

    const telegram_id = parse(initData).user?.id.toString();

    if (!telegram_id) {
      throw new BadRequestException("AUTH__INVALID_INITDATA");
    }

    return this.userService.findByTelegramId(telegram_id).pipe(
      switchMap((user: User | null) =>
        user ? of(user) : this.userService.create({ telegram_id }),
      ),
      tap((user: User | null) => {
        if (!user) {
          throw new BadRequestException("AUTH__USER_NOT_FOUND");
        }
      }),
      map((_user: User) => {
        const { id, telegram_id } = _user;
        const user = { id, telegram_id };

        res.cookie(
          "ACCESS_TOKEN",
          this.generateAccessToken(user),
          COOKIES_OPTION,
        );
        res.cookie(
          "REFRESH_TOKEN",
          this.generateRefreshToken(user),
          COOKIES_OPTION,
        );

        res.status(HttpStatus.OK).send(true); // Отправляем успешный ответ
      }),
    );
  }

  @Get("protected")
  protected(
    @Req() req: fastify.FastifyRequest,
    @Res() res: fastify.FastifyReply,
  ) {
    const { ACCESS_TOKEN, REFRESH_TOKEN } = req.cookies;

    if (!ACCESS_TOKEN || !REFRESH_TOKEN) {
      throw new UnauthorizedException();
    }

    let isCurrentValid = true;

    try {
      jwt.verify(ACCESS_TOKEN, process.env.JWT_SECRET as string);
      res.status(HttpStatus.OK).send(true);
    } catch {
      isCurrentValid = false;
    }

    if (isCurrentValid) {
      return;
    }

    try {
      const user = jwt.verify(
        REFRESH_TOKEN,
        process.env.JWT_REFRESH_SECRET as string,
      ) as AuthUser;

      res.cookie(
        "ACCESS_TOKEN",
        this.generateAccessToken(user),
        COOKIES_OPTION,
      );
      res.cookie(
        "REFRESH_TOKEN",
        this.generateRefreshToken(user),
        COOKIES_OPTION,
      );
    } catch {
      throw new UnauthorizedException();
    }

    return res.status(HttpStatus.OK).send(true);
  }

  private generateAccessToken(user: AuthUser): string {
    return jwt.sign(user, process.env.JWT_SECRET as string, {
      expiresIn: "5m",
    });
  }

  private generateRefreshToken(user: AuthUser): string {
    return jwt.sign(user, process.env.JWT_REFRESH_SECRET as string, {
      expiresIn: "7d",
    });
  }
}
