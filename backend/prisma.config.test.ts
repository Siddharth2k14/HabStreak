import { describe, expect, it, vi } from "vitest";

const { defineConfig, env } = vi.hoisted(() => ({
  defineConfig: vi.fn((configuration: unknown) => configuration),
  env: vi.fn((name: string) => `configured-${name}`),
}));

vi.mock("prisma/config", () => ({ defineConfig, env }));
vi.mock("dotenv/config", () => ({}));

describe("Prisma CLI configuration", () => {
  it("points to the schema and reads the database URL from the environment", async () => {
    const { default: configuration } = await import("./prisma.config.ts");

    expect(defineConfig).toHaveBeenCalledWith(expect.objectContaining({
      schema: "prisma/schema.prisma",
      migrations: { path: "prisma/migrations" },
      datasource: { url: "configured-DATABASE_URL" },
    }));
    expect(configuration).toMatchObject({ schema: "prisma/schema.prisma" });
  });
});
