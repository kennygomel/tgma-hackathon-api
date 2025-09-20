import * as fastify from "fastify";
import {
  BadRequestException,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { catchError, from, Observable, of, switchMap, tap } from "rxjs";
import { AuthService } from "src/auth/auth.service";
import { JwtRefreshGuard } from "src/auth/guards/jwt-refresh.guard";
import {
  CONFIRMATION_ERROR_HTML,
  CONFIRMATION_SUCCESS_HTML,
} from "src/auth/shared/constants";
import { CurrentUser } from "src/auth/shared/current-user.decorator";
import { Public } from "src/auth/shared/public.decorator";
import { AuthUser } from "src/auth/types/auth-user";
import { MaskSensitiveDataInterceptor } from "src/shared/interceptors/mask-sensitive-data.interceptor";
import { User } from "src/user/entities/user.entity";

@Controller("auth")
@UseInterceptors(MaskSensitiveDataInterceptor, ClassSerializerInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post("sign-in")
  @HttpCode(200)
  signIn(
    @Req() req: fastify.FastifyRequest,
    @Res({ passthrough: true }) res: fastify.FastifyReply,
  ): Observable<{ user: AuthUser }> {
    const { initData } = req.body as { initData: string };

    const isInitDataValid = this.authService.validateInitData(initData);

    if (!isInitDataValid) {
      throw new BadRequestException("AUTH__INVALID_INITDATA");
    }

    const telegram_id = this.authService
      .parseInitData(initData)
      .user?.id.toString();

    if (!telegram_id) {
      throw new BadRequestException("AUTH__INVALID_INITDATA");
    }

    return this.authService
      .authorizeTelegramUser(telegram_id.toString())
      .pipe(switchMap((user: User) => from(this.authService.login(user, res))));
  }

  @Get("me")
  me(@CurrentUser() user: User) {
    return this.authService.getMe(user);
  }

  @Get("request-email-confirmation")
  requestEmailConfirmation(@CurrentUser() user: User): Observable<boolean> {
    return this.authService.requestEmailConfirmationMail(
      user || { id: "b6909bd3-829a-4df3-b702-2f9aea7fea17" },
    );
  }

  @Public()
  @Get("confirm-email/:token")
  confirmEmail(
    @Param("token") token: string,
    @Res({ passthrough: true }) response: fastify.FastifyReply,
  ): Observable<any> {
    response.type("text/html");
    return this.authService.confirmEmail(token).pipe(
      tap(() => response.send(CONFIRMATION_SUCCESS_HTML)),
      catchError((e) => {
        response.send(CONFIRMATION_ERROR_HTML);

        return of(e);
      }),
    );
  }

  @Public()
  @Post("refresh")
  @UseGuards(JwtRefreshGuard)
  @HttpCode(200)
  refresh(
    @CurrentUser() payload: any,
    @Res({ passthrough: true }) res: fastify.FastifyReply,
  ): Observable<{ user: AuthUser }> {
    const user = { id: payload.sub, telegram_id: payload.telegram_id };

    return from(this.authService.rotateRefresh(user, res));
  }
}
