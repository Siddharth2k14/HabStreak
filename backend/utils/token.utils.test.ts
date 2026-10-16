import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { generateVerificationToken, hashVerificationToken } from "./token.utils.ts";

describe("verification token utilities", () => {
  it("generates a cryptographically sized hexadecimal token", () => {
    const token = generateVerificationToken();

    expect(token).toMatch(/^[a-f0-9]{64}$/);
  });

  it("hashes tokens with SHA-256", () => {
    const token = "verification-token";
    const expected = createHash("sha256").update(token).digest("hex");

    expect(hashVerificationToken(token)).toBe(expected);
  });
});
