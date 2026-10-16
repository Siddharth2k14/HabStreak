import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  createTaskService,
  getTasksService,
  getTaskByIdService,
  updateTaskService,
  updateTaskStatusService,
  moveTaskService,
  deleteTaskService,
} = vi.hoisted(() => ({
  createTaskService: vi.fn(),
  getTasksService: vi.fn(),
  getTaskByIdService: vi.fn(),
  updateTaskService: vi.fn(),
  updateTaskStatusService: vi.fn(),
  moveTaskService: vi.fn(),
  deleteTaskService: vi.fn(),
}));

vi.mock("../services/task.service.ts", () => ({
  createTask: createTaskService,
  getTasks: getTasksService,
  getTaskById: getTaskByIdService,
  updateTask: updateTaskService,
  updateTaskStatus: updateTaskStatusService,
  moveTask: moveTaskService,
  deleteTask: deleteTaskService,
}));

import { createTask, deleteTask, getTasks, moveTask } from "./task.controller.ts";

describe("task controllers", () => {
  beforeEach(() => vi.clearAllMocks());

  it("creates a task for the authenticated user", async () => {
    const task = { id: "task-1", title: "Plan" };
    createTaskService.mockResolvedValue(task);
    const response = { status: vi.fn(), json: vi.fn() };
    response.status.mockReturnValue(response);

    await createTask(
      { user: { id: "user-1" }, body: { title: "Plan" } } as never,
      response as never,
      vi.fn(),
    );

    expect(createTaskService).toHaveBeenCalledWith("user-1", expect.objectContaining({ title: "Plan" }));
    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, data: task }));
  });

  it("forwards an authorization error when a task request has no user", async () => {
    const next = vi.fn();
    await getTasks({} as never, {} as never, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      statusCode: 401,
      message: "Unauthorized.",
    }));
    expect(getTasksService).not.toHaveBeenCalled();
  });

  it("routes move and delete operations through the task services", async () => {
    moveTaskService.mockResolvedValue({ id: "task-1", status: "DONE" });
    deleteTaskService.mockResolvedValue(undefined);
    const response = { status: vi.fn(), json: vi.fn() };
    response.status.mockReturnValue(response);
    const req = {
      user: { id: "user-1" },
      params: { taskId: "task-1" },
      body: { targetStatus: "DONE", targetPosition: 1 },
    };

    await moveTask(req as never, response as never, vi.fn());
    await deleteTask(req as never, response as never, vi.fn());

    expect(moveTaskService).toHaveBeenCalledWith("user-1", "task-1", "DONE", 1);
    expect(deleteTaskService).toHaveBeenCalledWith("user-1", "task-1");
    expect(response.json).toHaveBeenLastCalledWith(expect.objectContaining({ data: null }));
  });
});
