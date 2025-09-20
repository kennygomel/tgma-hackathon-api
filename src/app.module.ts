import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule as NestConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { SubAccountModule } from "./sub-account/sub-account.module";
import { CardModule } from "./card/card.module";
import { ConfigModule } from "./config/config.module";
import { WalletModule } from "./wallet/wallet.module";

@Module({
  imports: [
    NestConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: "postgres",
      port: +(process.env.DATABASE_PORT ?? 5432),
      username: process.env.DATABASE_USER ?? "user",
      password: process.env.DATABASE_PASSWORD ?? "password",
      database: process.env.DATABASE_DB ?? "database",
      host: process.env.DATABASE_HOST ?? "postgres",
      entities: ["dist/**/*.entity{.ts,.js}"],
      synchronize: true,
      useUTC: false,
      cache: {
        type: "ioredis",
        options: {
          host: process.env.REDIS_HOST ?? "redis",
          port: +(process.env.REDIS_PORT ?? 6379),
          db: +(process.env.REDIS_DB ?? 0),
          user: null,
          password: process.env.REDIS_PASSWORD ?? "password",
        },
      },
    }),
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET ?? "jwtSecretJwtSecretJwtSecret",
      signOptions: { expiresIn: "24h" },
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: +(process.env.SMTP_PORT ?? 587),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      defaults: { from: '"evland" <mailer@ev.land>' },
      template: {
        dir: __dirname + "/email-templates",
        adapter: new HandlebarsAdapter(),
        options: { strict: true },
      },
    }),
    UserModule,
    AuthModule,
    SubAccountModule,
    CardModule,
    ConfigModule,
    WalletModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
