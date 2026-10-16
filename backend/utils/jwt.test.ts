import { afterEach, describe, expect, it, vi } from "vitest";

describe("JWT utilities", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("generates and verifies access and refresh tokens", async () => {
    vi.stubEnv("JWT_ACCESS_TOKEN", "test-access-secret");
    vi.stubEnv("JWT_REFRESH_TOKEN", "test-refresh-secret");
    vi.stubEnv("JWT_ACCESS_TOKEN_EXPIRES", "15m");
    vi.stubEnv("JWT_REFRESH_TOKEN_EXPIRES", "30d");

    const {
      generateAccessToken,
      generateRefreshToken,
      verifyAccessToken,
      verifyRefreshToken,
    } = await import("./jwt.ts");
    const payload = { userId: "user-1", username: "habuser", email: "habuser@example.com" };

    expect(verifyAccessToken(generateAccessToken(payload))).toMatchObject(payload);
    expect(verifyRefreshToken(generateRefreshToken(payload))).toMatchObject(payload);
    expect(() => verifyAccessToken("not-a-token")).toThrow();
  }, 15000);

  it("requires both signing secrets", async () => {
    vi.stubEnv("JWT_ACCESS_TOKEN", "");
    vi.stubEnv("JWT_REFRESH_TOKEN", "");

    await expect(import("./jwt.ts")).rejects.toThrow(
      "JWT_ACCESS_TOKEN and JWT_REFRESH_TOKEN must be configured.",
    );
  });
});
