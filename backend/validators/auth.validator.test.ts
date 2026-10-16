import { describe, expect, it } from "vitest";
import {
  loginSchema,
  registerSchema,
  resendVerificationSchema,
} from "./auth.validator.ts";

describe("auth validation schemas", () => {
  it("accepts a valid registration and rejects a mismatched confirmation", () => {
    const valid = {
      body: {
        username: "habuser",
        email: "habuser@example.com",
        password: "password123",
        confirmPassword: "password123",
      },
    };

    expect(registerSchema.safeParse(valid).success).toBe(true);
    expect(
      registerSchema.safeParse({
        ...valid,
        body: { ...valid.body, confirmPassword: "different123" },
      }).success,
    ).toBe(false);
  });

  it("rejects invalid login and resend-verification email addresses", () => {
    expect(loginSchema.safeParse({ body: { email: "invalid", password: "password123" } }).success).toBe(false);
    expect(resendVerificationSchema.safeParse({ body: { email: "invalid" } }).success).toBe(false);
  });
});
