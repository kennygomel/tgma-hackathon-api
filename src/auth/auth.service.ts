import { MailerService } from "@nestjs-modules/mailer";
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { parse, isValid, InitData } from "@telegram-apps/init-data-node";
import { randomBytes, randomUUID } from "crypto";
import * as fastify from "fastify";
import { catchError, from, map, Observable, of, switchMap, tap } from 'rxjs';
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
    private readonly config: ConfigService,
    private readonly mailerService: MailerService,
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

  confirmEmail(token: string): Observable<User> {
    return (
      token ? this.userService.findByEmailConfirmationToken(token) : of(null)
    ).pipe(
      tap((user: User | null) => {
        if (!user) {
          throw new BadRequestException("Invalid or expired token");
        }
      }),
      switchMap(
        (user: User) =>
          this.userService.updateOne(
            { id: user.id },
            {
              email_confirmed: true,
              email_confirmation_token: null,
              email_confirmation_token_expires_at: null,
            },
          ) as Observable<User>,
      ),
    );
  }

  getMe(user: User): Observable<User | null> {
    return this.userService.findOne({ where: { id: user.id } });
  }

  requestEmailConfirmationMail(user: AuthUser): Observable<boolean> {
    const { id } = user;

    return this.userService.findOne({ where: { id } }).pipe(
      tap((user: User | null) => {
        if (!user?.email) {
          throw new BadRequestException("User didn't set email");
        }

        if (user?.email_confirmed) {
          throw new BadRequestException("Email was already confirmed");
        }
      }),
      switchMap(() =>
        this.userService.updateOne(
          { id },
          {
            email_confirmation_token: randomBytes(32).toString("hex"),
            email_confirmation_token_expires_at: new Date(
              Date.now() + 24 * 3600_000,
            ),
          },
        ),
      ),
      switchMap((user: User) => {
        const linkUrl = `${this.config.get("API_URL")}/auth/confirm-email/${user.email_confirmation_token}`;

        return from(
          this.mailerService.sendMail({
            to: user.email as string,
            subject: "Подтвердите почту",
            template: "confirmation",
            context: { linkUrl },
          }),
        );
      }),
      map(() => true),
    );
  }

  signIn(initData: string, res: fastify.FastifyReply) {
    const isInitDataValid = this.validateInitData(initData);

    if (!isInitDataValid) {
      throw new BadRequestException("AUTH__INVALID_INITDATA");
    }

    const { first_name, last_name } = this.parseInitData(initData).user || {};
    const telegram_id = this.parseInitData(initData).user?.id.toString();

    if (!telegram_id) {
      throw new BadRequestException("AUTH__INVALID_INITDATA");
    }

    return this.authorizeTelegramUser(telegram_id.toString(), {
      first_name,
      last_name,
    }).pipe(
      tap((user: User) => {
        if (!user) {
          throw new UnauthorizedException("AUTH__SIGN_IN_FAILED");
        }
      }),
      switchMap((user: User) => from(this.login(user, res)))
    );
  }

  private authorizeTelegramUser(
    telegram_id: string,
    data: Pick<User, "first_name" | "last_name">,
  ): Observable<User | null> {
    const { first_name, last_name } = data;

    return this.userService.findByTelegramId(telegram_id).pipe(
      switchMap((user: User | null) =>
        user
          ? of(user)
          : this.userService.create({
              telegram_id,
              ...(first_name && { first_name }),
              ...(last_name && { last_name }),
            }),
      ),
      catchError(() => this.userService.findByTelegramId(telegram_id)),
    );
  }

  private parseInitData(initData: string): any {
    return parse(initData);
  }

  private validateInitData(initData: string): boolean {
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
      { sub: user.id, telegram_id: user.telegram_id, jti },
      {
        secret: process.env.JWT_REFRESH_SECRET as string,
        expiresIn: REFRESH_TOKEN_EXPIRATION,
      },
    );
  }
}
