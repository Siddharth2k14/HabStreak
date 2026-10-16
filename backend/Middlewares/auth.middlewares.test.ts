import { beforeEach, describe, expect, it, vi } from "vitest";

const { findUser, findBlacklist, findSession, verifyAccessToken } = vi.hoisted(() => ({
  findUser: vi.fn(),
  findBlacklist: vi.fn(),
  findSession: vi.fn(),
  verifyAccessToken: vi.fn(),
}));

vi.mock("../config/prisma.ts", () => ({
  default: {
    user: { findUnique: findUser },
    blacklistedToken: { findUnique: findBlacklist },
    session: { findFirst: findSession },
  },
}));
vi.mock("../utils/jwt.ts", () => ({ verifyAccessToken }));
vi.mock("../utils/logger.ts", () => ({
  default: { error: vi.fn(), info: vi.fn() },
}));

import authenticateUser from "./auth.middlewares.ts";

describe("authenticateUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    verifyAccessToken.mockReturnValue({ userId: "user-1" });
    findUser.mockResolvedValue({
      id: "user-1",
      username: "Taylor",
      email: "taylor@example.test",
      isActive: true,
      isVerified: true,
    });
    findBlacklist.mockResolvedValue(null);
    findSession.mockResolvedValue({ id: "session-1" });
  });

  it("attaches the verified account and continues for a valid bearer token", async () => {
    const req = {
      headers: { authorization: "Bearer access-token" },
      cookies: {},
    };
    const next = vi.fn();

    await authenticateUser(req as never, {} as never, next);

    expect(verifyAccessToken).toHaveBeenCalledWith("access-token");
    expect(req).toHaveProperty("user.id", "user-1");
    expect(next).toHaveBeenCalledOnce();
  });

  it("returns an unauthorized error through Express when no token is provided", async () => {
    await expect(
      authenticateUser({ headers: {}, cookies: {} } as never, {} as never, vi.fn()),
    ).rejects.toMatchObject({ statusCode: 401, message: "Invalid or expired token" });
  });
});
