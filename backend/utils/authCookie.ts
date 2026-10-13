import type { CookieOptions, Response } from "express";
const isProduction = process.env.NODE_ENV === "production";

export const refreshCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/api/auth",
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

export const setRefreshTokenCookie = (res: Response, refreshToken: string): void => {
  res.cookie("refreshToken", refreshToken, refreshCookieOptions);
};

export const clearRefreshTokenCookie = (res: Response): void => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/api/auth",
  });
};