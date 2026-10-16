import { describe, expect, it, vi } from "vitest";

const { createTransport } = vi.hoisted(() => ({
  createTransport: vi.fn(() => ({ sendMail: vi.fn() })),
}));

vi.mock("nodemailer", () => ({
  default: { createTransport },
}));

describe("email transport configuration", () => {
  it("creates a transport using the SMTP environment settings", async () => {
    vi.stubEnv("SMTP_HOST", "mail.example.test");
    vi.stubEnv("SMTP_PORT", "2525");
    vi.stubEnv("SMTP_SECURE", "true");
    vi.stubEnv("SMTP_USER", "mailer");
    vi.stubEnv("SMTP_PASSWORD", "secret");

    await import("./email.config.ts");

    expect(createTransport).toHaveBeenCalledWith({
      host: "mail.example.test",
      port: 2525,
      secure: true,
      auth: { user: "mailer", pass: "secret" },
    });
    vi.unstubAllEnvs();
  });
});
