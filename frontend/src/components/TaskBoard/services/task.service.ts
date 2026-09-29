import type { Task, TaskPriority, TaskStatus } from "../types/task.types.ts";
import { convertTaskDates } from "../utils/task.utils.ts";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

type ApiResponse<T> = {
    success: boolean;
    message?: string;
    data: T;
};

type CreateTaskPayload = {
    title: string;
    description?: string;
    priority: TaskPriority;
    dueDate?: Date | null;
    status?: TaskStatus;
};

type UpdateTaskPayload = {
    title?: string;
    description?: string;
    priority?: TaskPriority;
    dueDate?: Date | null;
};

type MoveTaskPayload = {
    status: TaskStatus;
    position: number;
}

/**
 * Create a new task
 */
export const createTask = async (payload: CreateTaskPayload): Promise<Task> => {
    const response = await fetch(`${BACKEND_URL}/api/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },

        credentials: "include",
        body: JSON.stringify({
            ...payload,
            dueDate: payload.dueDate ? payload.dueDate.toISOString() : null,
        }),
    });

    if (!response.ok) {
        throw new Error(
            "Failed to create task"
        );
    }

    const result: ApiResponse<Task> = await response.json();

    if (!result.success) {
        throw new Error(
            result.message || "Failed to create task"
        );
    }

    return convertTaskDates(result.data);
};

/**
 * Get all tasks belonging to the authenticated user.
 */
export const getTasks = async (): Promise<Task[]> => {

    const response = await fetch(
        `${BACKEND_URL}/api/tasks`,
        {
            method: "GET",

            headers: {
                "Content-Type": "application/json",
            },

            credentials: "include",
        }
    );

    if (!response.ok) {
        throw new Error(
            "Failed to fetch tasks"
        );
    }

    const result: ApiResponse<Task[]> =
        await response.json();

    if (!result.success) {
        throw new Error(
            result.message ||
            "Failed to fetch tasks"
        );
    }

    return result.data.map(
        convertTaskDates
    );
};

/**
 * Get a single task
 */
export const getTaskById = async ( taskId: string ): Promise<Task> => {
    const response = await fetch(`${BACKEND_URL}/api/tasks/${taskId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch task");
    }

    const result: ApiResponse<Task> = await response.json();

    if (!result.success) {
        throw new Error(result.message || "Failed to fetch task");
    }

    return convertTaskDates(result.data);
};

/**
 * Update task information
 * This endpoint is intended for:
 * title
 * description
 * priority
 * due date
 */

export const updateTask = async ( taskId: string, payload: UpdateTaskPayload ): Promise<Task> => {
    const res = await fetch(`${BACKEND_URL}/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
            ...payload,
            dueDate: payload.dueDate !== undefined ? payload.dueDate ? payload.dueDate.toISOString() : null : undefined,
        }),
    });

    if (!res.ok) {
        throw new Error("Failed to update task");
    }

    const result: ApiResponse<Task> = await res.json();

    if (!result.success) {
        throw new Error(result.message || "Failed to update task");
    }

    return convertTaskDates(result.data);
};

/**
 * Change only the task status.
 */
export const updateTaskStatus = async (
    taskId: string,
    status: TaskStatus
): Promise<Task> => {

    const response = await fetch(
        `${BACKEND_URL}/api/tasks/${taskId}/status`,
        {
            method: "PATCH",

            headers: {
                "Content-Type": "application/json",
            },

            credentials: "include",

            body: JSON.stringify({
                status,
            }),
        }
    );

    if (!response.ok) {
        throw new Error(
            "Failed to update task status"
        );
    }

    const result: ApiResponse<Task> =
        await response.json();

    if (!result.success) {
        throw new Error(
            result.message ||
            "Failed to update task status"
        );
    }

    return convertTaskDates(
        result.data
    );
};


/**
 * Move a task inside the Kanban board.
 *
 * This handles:
 *
 * TODO       → DOING
 * DOING      → DONE
 * TODO       → TODO
 * etc.
 *
 * Position determines the order
 * inside the target column.
 */
export const moveTask = async (
    taskId: string,
    payload: MoveTaskPayload
): Promise<Task> => {

    const response = await fetch(
        `${BACKEND_URL}/api/tasks/${taskId}/move`,
        {
            method: "PATCH",

            headers: {
                "Content-Type": "application/json",
            },

            credentials: "include",

            body: JSON.stringify({
                status: payload.status,
                position: payload.position,
            }),
        }
    );

    if (!response.ok) {
        throw new Error(
            "Failed to move task"
        );
    }

    const result: ApiResponse<Task> =
        await response.json();

    if (!result.success) {
        throw new Error(
            result.message ||
            "Failed to move task"
        );
    }

    return convertTaskDates(
        result.data
    );
};


/**
 * Delete a task.
 */
export const deleteTask = async (
    taskId: string
): Promise<void> => {

    const response = await fetch(
        `${BACKEND_URL}/api/tasks/${taskId}`,
        {
            method: "DELETE",

            headers: {
                "Content-Type": "application/json",
            },

            credentials: "include",
        }
    );

    if (!response.ok) {
        throw new Error(
            "Failed to delete task"
        );
    }

    const result: ApiResponse<null> =
        await response.json();

    if (!result.success) {
        throw new Error(
            result.message ||
            "Failed to delete task"
        );
    }
};