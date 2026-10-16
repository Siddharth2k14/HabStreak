import { describe, expect, it, vi } from "vitest";

vi.mock("./index.ts", () => ({}));
vi.mock("dotenv/config", () => ({}));

describe("server bootstrap", () => {
  it("loads the configured server entry point", async () => {
    await expect(import("./bootstrap.ts")).resolves.toBeDefined();
  });
});
