import { TaskStatus } from "@prisma/client";
import { prisma } from "../config/prisma.js";
/**
 * Create a task.
 */
export const createTask = async (userId, data) => {
    const { title, description, priority, dueDate, } = data;
    // Find the last task in TODO.
    // New tasks are added at the end of TODO.
    const lastTask = await prisma.task.findFirst({
        where: {
            userId,
            status: TaskStatus.TODO
        },
        orderBy: {
            position: "desc",
        },
        select: {
            position: true,
        },
    });
    const position = lastTask
        ? lastTask.position + 1
        : 1;
    return prisma.task.create({
        data: {
            title,
            description,
            priority,
            dueDate,
            userId,
            status: TaskStatus.TODO,
            position,
        },
    });
};
/**
 * Get all tasks belonging to a user.
 */
export const getTasks = async (userId) => {
    return prisma.task.findMany({
        where: {
            userId,
        },
        orderBy: [
            {
                status: "asc",
            },
            {
                position: "asc",
            },
        ],
    });
};
/**
 * Get one task belonging to a user.
 */
export const getTaskById = async (userId, taskId) => {
    return prisma.task.findFirst({
        where: {
            id: taskId,
            userId,
        },
    });
};
/**
 * Update task details.
 */
export const updateTask = async (userId, taskId, data) => {
    const task = await prisma.task.findFirst({
        where: {
            id: taskId,
            userId,
        },
    });
    if (!task) {
        throw new Error("Task not found.");
    }
    return prisma.task.update({
        where: {
            id: taskId,
        },
        data,
    });
};
/**
 * Update task status.
 */
export const updateTaskStatus = async (userId, taskId, status) => {
    const task = await prisma.task.findFirst({
        where: {
            id: taskId,
            userId,
        },
    });
    if (!task) {
        throw new Error("Task not found.");
    }
    return prisma.task.update({
        where: {
            id: taskId,
        },
        data: {
            status,
        },
    });
};
/**
 * Move and reorder a task.
 *
 * Everything is performed inside a transaction.
 */
export const moveTask = async (userId, taskId, targetStatus, targetPosition) => {
    if (targetPosition < 1) {
        throw new Error("Position must be greater than or equal to 1.");
    }
    return prisma.$transaction(async (tr) => {
        // Find the task and verify ownership.
        const task = await tr.task.findFirst({
            where: {
                id: taskId,
                userId,
            },
            select: {
                id: true,
                status: true,
                position: true,
            },
        });
        if (!task) {
            throw new Error("Task not found.");
        }
        const sourceStatus = task.status;
        const sourcePosition = task.position;
        // No movement required.
        if (sourceStatus === targetStatus &&
            sourcePosition === targetPosition) {
            return task;
        }
        // Same column
        if (sourceStatus === targetStatus) {
            // Moving up
            if (targetPosition < sourcePosition) {
                await tr.task.updateMany({
                    where: {
                        userId,
                        status: sourceStatus,
                        position: {
                            gte: targetPosition,
                            lt: sourcePosition,
                        },
                    },
                    data: {
                        position: {
                            increment: 1,
                        },
                    },
                });
            }
            // Moving down
            else {
                await tr.task.updateMany({
                    where: {
                        userId,
                        status: sourceStatus,
                        position: {
                            gt: sourcePosition,
                            lte: targetPosition,
                        },
                    },
                    data: {
                        position: {
                            decrement: 1,
                        },
                    },
                });
            }
            return tr.task.update({
                where: {
                    id: taskId,
                },
                data: {
                    position: Number(targetPosition),
                },
            });
        }
        // Different column
        // Remove the task from the old column.
        // Everything below it moves one position upward.
        await tr.task.updateMany({
            where: {
                userId,
                status: sourceStatus,
                position: {
                    gt: sourcePosition,
                },
            },
            data: {
                position: {
                    decrement: 1,
                },
            },
        });
        // Make space in the target column.
        // Everything at or after the target position
        // moves one position downward.
        await tr.task.updateMany({
            where: {
                userId,
                status: targetStatus,
                position: {
                    gte: targetPosition,
                },
            },
            data: {
                position: {
                    increment: 1,
                },
            },
        });
        // Finally move the task.
        const updateData = {
            status: targetStatus,
            position: targetPosition,
        };
        return tr.task.update({
            where: {
                id: taskId,
            },
            data: updateData,
        });
    });
};
/**
 * Delete a task.
 */
export const deleteTask = async (userId, taskId) => {
    return prisma.$transaction(async (tr) => {
        // Verify ownership.
        const task = await tr.task.findFirst({
            where: {
                id: taskId,
                userId,
            },
            select: {
                status: true,
                position: true,
            },
        });
        if (!task) {
            throw new Error("Task not found.");
        }
        // Delete task.
        await tr.task.delete({
            where: {
                id: taskId,
            },
        });
        // Close the position gap.
        await tr.task.updateMany({
            where: {
                userId,
                status: task.status,
                position: {
                    gt: task.position,
                },
            },
            data: {
                position: {
                    decrement: 1,
                },
            },
        });
    });
};
