import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { fromRefreshCookie } from "../utils/cookie-extractors";
import * as jwt from "jsonwebtoken";
import * as fastify from "fastify";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh",
) {
  constructor() {
    super({
      jwtFromRequest: fromRefreshCookie,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET as string,
      passReqToCallback: true,
    });
  }

  async validate(req: fastify.FastifyRequest, payload: any) {
    const token = req?.cookies?.refresh_token;

    if (!token) throw new UnauthorizedException();

    const user = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string);

    if (!user) throw new UnauthorizedException();

    return payload;
  }
}
