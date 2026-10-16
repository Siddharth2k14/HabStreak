import { describe, expect, it } from "vitest";
import {
  loginRateLimiter,
  logoutRateLimiter,
  refreshRateLimiter,
  resendVerificationRateLimiter,
  signupRateLimiter,
} from "./rateLimit.middleware.ts";

describe("rate limit middleware exports", () => {
  it("provides a limiter for each authentication endpoint group", () => {
    const limiters = [
      loginRateLimiter,
      logoutRateLimiter,
      refreshRateLimiter,
      resendVerificationRateLimiter,
      signupRateLimiter,
    ];

    expect(limiters.every((limiter) => typeof limiter === "function")).toBe(true);
    expect(new Set(limiters).size).toBe(5);
  });
});
