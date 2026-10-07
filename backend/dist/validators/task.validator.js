import { z } from "zod";
/**
 * Create Task
 */
export const createTaskSchema = z.object({
    body: z.object({
        title: z
            .string()
            .trim()
            .min(1, "Title is required.")
            .max(100, "Title must not exceed 100 characters."),
        description: z
            .string()
            .trim()
            .max(500, "Description must not exceed 500 characters.")
            .optional(),
        priority: z
            .enum(["LOW", "MEDIUM", "HIGH"])
            .optional(),
        dueDate: z
            .string()
            .datetime()
            .optional(),
    }),
});
/**
 * Update Task
 *
 * PATCH /tasks/:taskId
 *
 * This endpoint updates task information only.
 * Status changes are handled separately by /status.
 */
export const updateTaskSchema = z.object({
    params: z.object({
        taskId: z
            .string()
            .min(1, "Task ID is required."),
    }),
    body: z.object({
        title: z
            .string()
            .trim()
            .min(1, "Title cannot be empty.")
            .max(100, "Title must not exceed 100 characters.")
            .optional(),
        description: z
            .string()
            .trim()
            .max(500, "Description must not exceed 500 characters.")
            .optional(),
        priority: z
            .enum(["LOW", "MEDIUM", "HIGH"])
            .optional(),
        dueDate: z
            .string()
            .datetime()
            .optional(),
    }),
});
/**
 * Update Task Status
 *
 * PATCH /tasks/:taskId/status
 */
export const updateTaskStatusSchema = z.object({
    params: z.object({
        taskId: z
            .string()
            .min(1, "Task ID is required."),
    }),
    body: z.object({
        status: z.enum([
            "TODO",
            "DOING",
            "IN_REVIEW",
            "DONE",
        ]),
    }),
});
/**
 * Move Task
 *
 * PATCH /tasks/:taskId/move
 */
export const moveTaskSchema = z.object({
    params: z.object({
        taskId: z
            .string()
            .min(1, "Task ID is required."),
    }),
    body: z.object({
        targetStatus: z.enum([
            "TODO",
            "DOING",
            "IN_REVIEW",
            "DONE",
        ]),
        targetPosition: z
            .number()
            .int("Target position must be an integer.")
            .min(1, "Target position must be at least 1."),
    }),
});
/**
 * Task ID
 *
 * Used by:
 * GET    /tasks/:taskId
 * DELETE /tasks/:taskId
 */
export const taskIdSchema = z.object({
    params: z.object({
        taskId: z
            .string()
            .min(1, "Task ID is required."),
    }),
});
