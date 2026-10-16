import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  findUnique,
  findFirst,
  userCreate,
  userUpdate,
  sessionCreate,
  refreshTokenCreate,
  transaction,
  loginRequest,
  accessToken,
  refreshToken,
} = vi.hoisted(() => ({
  findUnique: vi.fn(),
  findFirst: vi.fn(),
  userCreate: vi.fn(),
  userUpdate: vi.fn(),
  sessionCreate: vi.fn(),
  refreshTokenCreate: vi.fn(),
  transaction: vi.fn(),
  loginRequest: vi.fn(),
  accessToken: vi.fn(() => "access-token"),
  refreshToken: vi.fn(() => "refresh-token"),
}));

vi.mock("../config/prisma.ts", () => ({
  default: {
    user: { findUnique, findFirst, create: userCreate, update: userUpdate },
    session: { create: sessionCreate, findFirst: vi.fn(), deleteMany: vi.fn() },
    refreshToken: { create: refreshTokenCreate, findUnique: vi.fn(), delete: vi.fn(), deleteMany: vi.fn() },
    blacklistedToken: { findUnique: vi.fn() },
    $transaction: transaction,
  },
}));
vi.mock("bcrypt", () => ({ default: { hash: vi.fn(), compare: vi.fn() } }));
vi.mock("../utils/jwt.ts", () => ({
  generateAccessToken: accessToken,
  generateRefreshToken: refreshToken,
  verifyRefreshToken: vi.fn(),
}));
vi.mock("../utils/token.utils.ts", () => ({
  generateVerificationToken: vi.fn(() => "verification-token"),
  hashVerificationToken: vi.fn(() => "hashed-token"),
}));
vi.mock("../services/email.service.ts", () => ({
  sendVerificationEmail: vi.fn(),
}));
vi.mock("../utils/authCookie.ts", () => ({
  clearRefreshTokenCookie: vi.fn(),
  setRefreshTokenCookie: vi.fn(),
}));

import { getCurrentUser, loginUser } from "./auth.controller.ts";

describe("auth controllers", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns the authenticated user's public account information", async () => {
    const response = { status: vi.fn(), json: vi.fn() };
    response.status.mockReturnValue(response);

    await getCurrentUser(
      { user: { id: "user-1", username: "Taylor", email: "taylor@example.test" } } as never,
      response as never,
      vi.fn(),
    );

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      success: true,
      user: { id: "user-1", username: "Taylor", email: "taylor@example.test" },
    });
  });

  it("forwards an unauthorized error when login cannot find the account", async () => {
    findUnique.mockResolvedValue(null);
    const next = vi.fn();

    await loginUser({ body: { email: "missing@example.test", password: "password123" } } as never, {} as never, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      statusCode: 401,
      message: "User not found.",
    }));
  });
});
