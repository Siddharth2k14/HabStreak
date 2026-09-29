import { TaskStatus, TaskPriority, Prisma } from "@prisma/client";
import prisma from "../config/prisma.ts"

interface CreateTaskData {
    title: string;
    description?: string;
    priority?: TaskPriority;
    dueDate?: Date | null;
    userId: string;
}

interface UpdateTaskData {
    title?: string;
    description?: string;
    priority?: TaskPriority;
    dueDate?: Date | null;
}

interface MoveTaskData {
    status: TaskStatus;
    position: number;
}

/**
 * create a task.
 */

export const createTask = async (data: CreateTaskData) => {
    const { title, description, priority, dueDate, userId } = data;

    // Find the last task in TODO. New tasks are added at the end of Todo.
    const lastTask = await prisma.task.findFirst({
        where: { userId, status: "TODO" },
        orderBy: { position: "desc" },
        select: { position: true },
    });

    const position = lastTask ? lastTask.position + 1 : 1;

    return prisma.task.create({
        data: {
            title,
            description,
            priority,
            dueDate,
            userId,
            status: "TODO",
            position,
        },
    });
};

/**
 * Get all tasks belonging to a user.
 */
export const getTasks = async (userId: string) => {
    return prisma.task.findMany({
        where: { userId },
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
export const getTaskById = async (taskId: string, userId: string) => {
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
export const updateTask = async (taskId: string, userId: string, data: UpdateTaskData) => {
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
export const updateTaskStatus = async (taskId: string, userId: string, status: TaskStatus) => {
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
 * Everything is performed inside a transaction.
 */
export default async (taskId: string, userId: string, data: MoveTaskData) => {
    const { status: targetStatus, position: targetPosition } = data;

    if (targetPosition < 1) {
        throw new Error(
            "Position must be greater than or equal to 1."
        );
    }

    return prisma.$transaction(async (tr) => {
        //Find the task and verify the ownership.
        const task = await tr.task.findFirst({
            where: {
                id: taskId,
                userId,
            },
        });

        if (!task) {
            throw new Error("Task not found.");
        }

        const sourceStatus = task.status;
        const sourcePosition = task.position;

        // No movement required.
        if (sourceStatus === targetStatus && sourcePosition === targetPosition) {
            return task;
        }

        // Same column
        if (sourceStatus === targetStatus) {
            //Moving Up
            // TODO
            // 1
            // 2
            // 3
            // 4
            // targetPosition => 2, sourcePosition => 3
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
            // targetPosition => 3, sourcePosition => 2
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
                    position: targetPosition,
                },
            });
        }

        //Different Column
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
        // Everything at or after the target position moves one position downward.
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
        return tr.task.update({
            where: {
                id: taskId,
            },

            data: {
                status: targetStatus,
                position: targetPosition,
            },
        });
    });
};
/**
 * Delete a task.
 */
export const deleteTask = async (taskId: string, userId: string) => {
  return prisma.$transaction(async (tr) => {
    //Verify the ownership
    const task = await tr.task.findFirst({
      where: {
        id: taskId,
        userId,
      },
    });

    if (!task) {
      throw new Error("Task not found.");
    }

    //Delete task
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