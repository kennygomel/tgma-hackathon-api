import { fastifyCookie } from "@fastify/cookie";
import { fastifyCors } from "@fastify/cors";
import { Authenticator } from "@fastify/passport";
import { fastifySession } from "@fastify/session";
import { contentParser } from "fastify-file-interceptor";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";

async function bootstrap() {
  const adapter = new FastifyAdapter();
  const fastifyPassport = new Authenticator();

  adapter.register(fastifyCors, {
    origin: [process.env.FRONTEND_URL ?? "http://localhost:5173"],
    allowedHeaders: [
      "Access-Control-Allow-Origin",
      "Origin",
      "X-Requested-With",
      "Accept",
      "Content-Type",
      "Authorization",
      "X-Api-Key",
    ],
    exposedHeaders: "Authorization",
    credentials: true,
    methods: ["GET", "PUT", "OPTIONS", "POST", "DELETE"],
  });
  adapter.register(fastifyCookie, {
    parseOptions: {
      httpOnly: true,
      secure: true,
      sameSite: true,
      path: "/",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
    secret: process.env.COOKIE_SECRET ?? "cookieSecretCookieSecretCookieSecret",
  });
  adapter.register(fastifySession, {
    secret:
      process.env.SESSION_SECRET ?? "sessionSecretSessionSecretSessionSecret",
  });
  adapter.register(contentParser);
  adapter.register(fastifyPassport.initialize());
  adapter.register(fastifyPassport.secureSession());

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
  );

  await app.listen(+(process.env.PORT ?? 3000), "0.0.0.0");
}
bootstrap();
