import { describe, expect, it } from "vitest";
import {
  createTaskSchema,
  moveTaskSchema,
  taskIdSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
} from "./task.validator.ts";

describe("task validation schemas", () => {
  it("accepts a valid task and trims the title", () => {
    const result = createTaskSchema.safeParse({
      body: { title: "  Plan week  ", priority: "HIGH" },
    });

    expect(result.success).toBe(true);
    if (result.success) expect(result.data.body.title).toBe("Plan week");
  });

  it("rejects empty IDs, invalid statuses, and non-positive positions", () => {
    expect(taskIdSchema.safeParse({ params: { taskId: "" } }).success).toBe(false);
    expect(updateTaskStatusSchema.safeParse({ params: { taskId: "t1" }, body: { status: "WAITING" } }).success).toBe(false);
    expect(moveTaskSchema.safeParse({ params: { taskId: "t1" }, body: { targetStatus: "DONE", targetPosition: 0 } }).success).toBe(false);
    expect(updateTaskSchema.safeParse({ params: { taskId: "t1" }, body: { title: "" } }).success).toBe(false);
  });
});
