export const ACCESS_TOKEN_KEY = "access_token";
export const ACCESS_TOKEN_EXPIRATION = "5m";

export const REFRESH_TOKEN_KEY = "refresh_token";
export const REFRESH_TOKEN_EXPIRATION = "7d";

export const COOKIES_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.SECURE_COOKIES === "true",
  path: "/",
};

export const IS_PUBLIC_KEY = "isPublic";
