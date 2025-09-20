import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { JwtAccessStrategy } from "src/auth/strategies/jwt-access.strategy";
import { JwtRefreshStrategy } from "src/auth/strategies/jwt-refresh.strategy";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  controllers: [AuthController],
  imports: [
    PassportModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [
    AuthService,
    UserService,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    // { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AuthModule {}
