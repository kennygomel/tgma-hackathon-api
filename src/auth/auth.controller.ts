import * as fastify from "fastify";
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { from, map, Observable, switchMap } from "rxjs";
import { AuthService } from "src/auth/auth.service";
import { JwtRefreshGuard } from "src/auth/guards/jwt-refresh.guard";
import { CurrentUser } from "src/auth/shared/current-user.decorator";
import { Public } from "src/auth/shared/public.decorator";
import { AuthUser } from "src/auth/types/auth-user";
import { User } from "src/user/entities/user.entity";

@Controller("auth")
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
  me(@CurrentUser() user: any) {
    return user;
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
