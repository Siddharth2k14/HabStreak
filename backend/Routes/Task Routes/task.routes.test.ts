import { describe, expect, it, vi } from "vitest";

vi.mock("../../Middlewares/auth.middlewares.ts", () => ({ default: vi.fn() }));
vi.mock("../../Middlewares/validation.middleware.ts", () => ({ default: vi.fn(() => vi.fn()) }));
vi.mock("../../Controllers/task.controller.ts", () => ({
  createTask: vi.fn(),
  getTasks: vi.fn(),
  getTaskById: vi.fn(),
  updateTask: vi.fn(),
  updateTaskStatus: vi.fn(),
  moveTask: vi.fn(),
  deleteTask: vi.fn(),
}));

import router from "./task.routes.ts";

describe("task routes", () => {
  it("registers collection, item, status, and move endpoints", () => {
    const routes = router.stack.map((layer) => {
      const route = layer.route;
      const methods = route ? Reflect.get(route, "methods") as Record<string, boolean> : undefined;
      return { path: route?.path, methods };
    });

    expect(routes).toEqual(expect.arrayContaining([
      expect.objectContaining({ path: "/", methods: expect.objectContaining({ post: true }) }),
      expect.objectContaining({ path: "/", methods: expect.objectContaining({ get: true }) }),
      expect.objectContaining({ path: "/:taskId", methods: expect.objectContaining({ get: true }) }),
      expect.objectContaining({ path: "/:taskId", methods: expect.objectContaining({ patch: true }) }),
      expect.objectContaining({ path: "/:taskId/status", methods: expect.objectContaining({ patch: true }) }),
      expect.objectContaining({ path: "/:taskId/move", methods: expect.objectContaining({ patch: true }) }),
      expect.objectContaining({ path: "/:taskId", methods: expect.objectContaining({ delete: true }) }),
    ]));
  });
});
