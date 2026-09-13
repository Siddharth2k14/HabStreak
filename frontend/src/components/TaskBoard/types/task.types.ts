export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";
export type TaskStatus = "TODO" | "DOING" | "IN_REVIEW" | "DONE";
export const TASK_STATUSES = ["TODO" , "DOING" , "IN_REVIEW" , "DONE"] as const;

export type Task = {
    id: string;
    title: string;
    description: string;
    priority: TaskPriority;
    dueDate: Date | null;
    status: TaskStatus;
    position: number;
    createdAt: string;
    updatedAt: string;
};