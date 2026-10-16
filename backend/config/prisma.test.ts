import { describe, expect, it, vi } from "vitest";

const { PrismaPg, PrismaClient } = vi.hoisted(() => ({
  PrismaPg: vi.fn(function (this: object, options: unknown) {
    Object.assign(this, options);
  }),
  PrismaClient: vi.fn(function (this: object, options: unknown) {
    Object.assign(this, options);
  }),
}));

vi.mock("@prisma/adapter-pg", () => ({ PrismaPg }));
vi.mock("@prisma/client", () => ({ PrismaClient }));

describe("Prisma configuration", () => {
  it("builds the Prisma client with the PostgreSQL adapter", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://test:test@localhost:5432/test");

    const { default: prisma } = await import("./prisma.ts");

    expect(PrismaPg).toHaveBeenCalledWith({
      connectionString: "postgresql://test:test@localhost:5432/test",
    });
    expect(PrismaClient).toHaveBeenCalledOnce();
    expect(prisma).toBeDefined();
    vi.unstubAllEnvs();
  });
});
