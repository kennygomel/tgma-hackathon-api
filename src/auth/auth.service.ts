import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { parse, isValid } from "@telegram-apps/init-data-node";
import { randomUUID } from "crypto";
import * as fastify from "fastify";
import { Observable, of, switchMap } from "rxjs";
import {
  ACCESS_TOKEN_EXPIRATION,
  ACCESS_TOKEN_KEY,
  COOKIES_OPTIONS,
  REFRESH_TOKEN_EXPIRATION,
  REFRESH_TOKEN_KEY,
} from "src/auth/shared/constants";
import { AuthUser } from "src/auth/types/auth-user";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async login(
    user: User,
    res: fastify.FastifyReply,
  ): Promise<{ user: AuthUser }> {
    const jti = randomUUID();
    const refresh = this.signRefresh(user, jti);
    const access = this.signAccess(user);

    await this.setAuthCookies(res, access, refresh);

    return { user: { id: user.id, telegram_id: user.telegram_id } };
  }

  async rotateRefresh(
    user: AuthUser,
    res: fastify.FastifyReply,
  ): Promise<{ user: AuthUser }> {
    const newJti = randomUUID();
    const newRefresh = this.signRefresh(user, newJti);
    const newAccess = this.signAccess(user);

    await this.setAuthCookies(res, newAccess, newRefresh);

    return { user: { id: user.id, telegram_id: user.telegram_id } };
  }

  authorizeTelegramUser(telegram_id: string): Observable<User> {
    return this.userService
      .findByTelegramId(telegram_id)
      .pipe(
        switchMap((user: User | null) =>
          user ? of(user) : this.userService.create({ telegram_id }),
        ),
      );
  }

  parseInitData(initData: string): any {
    return parse(initData);
  }

  validateInitData(initData: string): boolean {
    return isValid(initData, process.env.TELEGRAM_BOT_TOKEN as string);
  }

  private async setAuthCookies(
    res: fastify.FastifyReply,
    access: string,
    refresh?: string,
  ) {
    res.cookie(ACCESS_TOKEN_KEY, access, COOKIES_OPTIONS);

    if (refresh) {
      res.cookie(REFRESH_TOKEN_KEY, refresh, COOKIES_OPTIONS);
    }
  }

  private signAccess(user: User | AuthUser) {
    return this.jwtService.sign(
      { sub: user.id, telegram_id: user.telegram_id },
      {
        secret: process.env.JWT_SECRET as string,
        expiresIn: ACCESS_TOKEN_EXPIRATION,
      },
    );
  }

  private signRefresh(user: User | AuthUser, jti: string) {
    return this.jwtService.sign(
      { sub: user.id, jti },
      {
        secret: process.env.JWT_REFRESH_SECRET as string,
        expiresIn: REFRESH_TOKEN_EXPIRATION,
      },
    );
  }
}
