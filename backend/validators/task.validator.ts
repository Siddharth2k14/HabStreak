import { z } from "zod";

export const createTaskSchema = z.object({
    body: z.object({
        title: z.string().min(1, "Title is required.").max(100),

        description: z.string().max(500).optional(),

        link: z.string().url("Link must be a valid URL.").max(500).optional(),

        priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),

        dueDate: z.string().datetime().optional(),
    }),
});

export const updateTaskSchema = z.object({
    body: z.object({
        title: z.string().min(1).max(100).optional(),

        description: z.string().max(500).optional(),

        link: z.string().url("Link must be a valid URL.").max(500).optional(),

        priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),

        status: z.enum([
                "PENDING",
                "IN_PROGRESS",
                "COMPLETED",
                "ARCHIVED",
            ]).optional(),

        dueDate: z.string().datetime().optional(),
    }),

    params: z.object({
        taskId: z.string().min(1),
    }),
});

export const taskIdSchema = z.object({
    params: z.object({
        taskId: z.string().min(1),
    }),
});
