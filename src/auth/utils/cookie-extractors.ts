import * as fastify from "fastify";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "src/auth/shared/constants";

export const fromAccessCookie = (
  req: fastify.FastifyRequest,
): string | null => {
  const cookies = req?.cookies;

  if (!cookies) return null;

  return cookies[ACCESS_TOKEN_KEY] ?? null;
};

export const fromRefreshCookie = (
  req: fastify.FastifyRequest,
): string | null => {
  const cookies = req?.cookies;

  if (!cookies) return null;

  return cookies[REFRESH_TOKEN_KEY] ?? null;
};
