import type { Task } from "../types/task.types.ts";

export const convertTaskDates = (task: Task): Task => {
    return {
        ...task,
        dueDate: task.dueDate
            ? new Date(task.dueDate)
            : null,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
    };
};