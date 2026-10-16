import { describe, expect, it, vi } from "vitest";

vi.mock("../../Middlewares/auth.middlewares.ts", () => ({ default: vi.fn() }));
vi.mock("../../Middlewares/validation.middleware.ts", () => ({ default: vi.fn(() => vi.fn()) }));
vi.mock("../../Middlewares/rateLimit.middleware.ts", () => ({
  loginRateLimiter: vi.fn(),
  logoutRateLimiter: vi.fn(),
  refreshRateLimiter: vi.fn(),
  resendVerificationRateLimiter: vi.fn(),
  signupRateLimiter: vi.fn(),
}));
vi.mock("../../Controllers/auth.controller.ts", () => ({
  getCurrentUser: vi.fn(),
  loginUser: vi.fn(),
  logoutUser: vi.fn(),
  refreshAccessToken: vi.fn(),
  registerUser: vi.fn(),
  resendVerificationEmail: vi.fn(),
  verifyEmail: vi.fn(),
}));

import router from "./user.routes.ts";

describe("user routes", () => {
  it("registers the expected authentication endpoints", () => {
    const routes = router.stack.map((layer) => {
      const route = layer.route;
      const methods = route ? Reflect.get(route, "methods") as Record<string, boolean> : undefined;
      return { path: route?.path, methods };
    });

    expect(routes).toEqual(expect.arrayContaining([
      expect.objectContaining({ path: "/register", methods: expect.objectContaining({ post: true }) }),
      expect.objectContaining({ path: "/login", methods: expect.objectContaining({ post: true }) }),
      expect.objectContaining({ path: "/refresh", methods: expect.objectContaining({ post: true }) }),
      expect.objectContaining({ path: "/me", methods: expect.objectContaining({ get: true }) }),
      expect.objectContaining({ path: "/verify/:token", methods: expect.objectContaining({ get: true }) }),
      expect.objectContaining({ path: "/logout", methods: expect.objectContaining({ post: true }) }),
    ]));
  });
});
