import { beforeEach, describe, expect, it, vi } from "vitest";

const { sendMail } = vi.hoisted(() => ({ sendMail: vi.fn().mockResolvedValue(undefined) }));
vi.mock("../config/email.config.ts", () => ({
  emailTransporter: { sendMail },
}));

import { sendVerificationEmail } from "./email.service.ts";

describe("sendVerificationEmail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("BACKEND_URL", "https://api.example.test");
    vi.stubEnv("EMAIL_FROM", "no-reply@example.test");
  });

  it("sends an email with the verification URL in both formats", async () => {
    await sendVerificationEmail({
      email: "user@example.test",
      name: "Taylor",
      token: "verify-token",
    });

    expect(sendMail).toHaveBeenCalledWith(expect.objectContaining({
      to: "user@example.test",
      from: '"HabStreak" <no-reply@example.test>',
      subject: "Verify your HabStreak account",
      text: expect.stringContaining("https://api.example.test/api/auth/verify/verify-token"),
      html: expect.stringContaining('href="https://api.example.test/api/auth/verify/verify-token"'),
    }));
  });
});
