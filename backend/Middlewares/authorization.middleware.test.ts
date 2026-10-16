import { beforeEach, describe, expect, it, vi } from "vitest";

const { findUnique, loggerError } = vi.hoisted(() => ({
  findUnique: vi.fn(),
  loggerError: vi.fn(),
}));

vi.mock("../config/prisma.ts", () => ({
  default: { task: { findUnique } },
}));
vi.mock("../utils/logger.ts", () => ({
  default: { error: loggerError, info: vi.fn() },
}));

import authorizeTaskOwner from "./authorization.middleware.ts";

describe("authorizeTaskOwner", () => {
  beforeEach(() => vi.clearAllMocks());

  it("rejects requests without an authenticated user", async () => {
    const response = { status: vi.fn(), json: vi.fn() };
    response.status.mockReturnValue(response);

    await authorizeTaskOwner(
      { params: { taskId: "task-1" } } as never,
      response as never,
      vi.fn(),
    );

    expect(response.status).toHaveBeenCalledWith(401);
    expect(findUnique).not.toHaveBeenCalled();
  });

  it("continues when the task belongs to the authenticated user", async () => {
    findUnique.mockResolvedValue({ id: "task-1", userId: "user-1" });
    const next = vi.fn();

    await authorizeTaskOwner(
      { user: { id: "user-1" }, params: { taskId: "task-1" } } as never,
      {} as never,
      next,
    );

    expect(findUnique).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: "task-1" },
    }));
    expect(next).toHaveBeenCalledOnce();
  });
});
