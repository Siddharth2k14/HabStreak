import { describe, expect, it, vi } from "vitest";
import {
  clearRefreshTokenCookie,
  refreshCookieOptions,
  setRefreshTokenCookie,
} from "./authCookie.ts";

describe("refresh-token cookie helpers", () => {
  it("sets and clears the refresh cookie with matching security options", () => {
    const response = {
      cookie: vi.fn(),
      clearCookie: vi.fn(),
    };

    setRefreshTokenCookie(response as never, "refresh-token");
    clearRefreshTokenCookie(response as never);

    expect(response.cookie).toHaveBeenCalledWith("refreshToken", "refresh-token", refreshCookieOptions);
    expect(response.clearCookie).toHaveBeenCalledWith("refreshToken", expect.objectContaining({
      httpOnly: true,
      path: "/api/auth",
    }));
  });
});
