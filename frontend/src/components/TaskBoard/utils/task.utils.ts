import type { Task } from "../types/task.types";

export const convertTaskDates = (task: any): Task => {
    return {
        ...task,
        dueDate: task.dueDate
            ? new Date(task.dueDate)
            : null,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
    };
};