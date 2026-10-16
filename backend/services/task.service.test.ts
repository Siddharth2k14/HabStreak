import { beforeEach, describe, expect, it, vi } from "vitest";

const { findFirst, findMany, create, update, updateMany, deleteTask, transaction } = vi.hoisted(() => ({
  findFirst: vi.fn(),
  findMany: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  updateMany: vi.fn(),
  deleteTask: vi.fn(),
  transaction: vi.fn(),
}));

vi.mock("../config/prisma.ts", () => ({
  default: {
    task: { findFirst, findMany, create, update, updateMany, delete: deleteTask },
    $transaction: transaction,
  },
}));

import {
  createTask,
  deleteTask as deleteTaskService,
  getTaskById,
  getTasks,
  moveTask,
  updateTask,
  updateTaskStatus,
} from "./task.service.ts";

describe("task service", () => {
  beforeEach(() => vi.clearAllMocks());

  it("creates a task at the end of the user's TODO column", async () => {
    findFirst.mockResolvedValue({ position: 4 });
    create.mockResolvedValue({ id: "task-5", position: 5 });

    await expect(createTask("user-1", { title: "Plan" })).resolves.toEqual({
      id: "task-5",
      position: 5,
    });
    expect(create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ userId: "user-1", status: "TODO", position: 5 }),
    }));
  });

  it("scopes task reads to the requested user", async () => {
    findMany.mockResolvedValue([]);
    findFirst.mockResolvedValue({ id: "task-1" });

    await getTasks("user-1");
    await getTaskById("user-1", "task-1");

    expect(findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { userId: "user-1" },
    }));
    expect(findFirst).toHaveBeenCalledWith({ where: { id: "task-1", userId: "user-1" } });
  });

  it("rejects updates and moves for tasks not owned by the user", async () => {
    findFirst.mockResolvedValue(null);

    await expect(updateTask("user-1", "missing", { title: "New" })).rejects.toThrow("Task not found.");
    await expect(updateTaskStatus("user-1", "missing", "DONE")).rejects.toThrow("Task not found.");
    transaction.mockImplementation(async (callback) => callback({
      task: { findFirst, update, updateMany },
    }));
    await expect(moveTask("user-1", "missing", "DONE", 1)).rejects.toThrow("Task not found.");
  });

  it("rejects invalid positions and moves valid tasks transactionally", async () => {
    await expect(moveTask("user-1", "task-1", "DONE", 0)).rejects.toThrow(
      "Position must be greater than or equal to 1.",
    );

    findFirst.mockResolvedValue({ id: "task-1", status: "TODO", position: 1 });
    update.mockResolvedValue({ id: "task-1", status: "DONE", position: 2 });
    transaction.mockImplementation(async (callback) => callback({
      task: { findFirst, update, updateMany },
    }));

    await expect(moveTask("user-1", "task-1", "DONE", 2)).resolves.toMatchObject({
      status: "DONE",
      position: 2,
    });
    expect(updateMany).toHaveBeenCalledTimes(2);
  });

  it("deletes the task and closes its position gap within a transaction", async () => {
    findFirst.mockResolvedValue({ status: "TODO", position: 2 });
    transaction.mockImplementation(async (callback) => callback({
      task: { findFirst, update, updateMany, delete: deleteTask },
    }));

    await deleteTaskService("user-1", "task-2");

    expect(deleteTask).toHaveBeenCalledWith({ where: { id: "task-2" } });
    expect(updateMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ userId: "user-1", status: "TODO" }),
    }));
  });
});
