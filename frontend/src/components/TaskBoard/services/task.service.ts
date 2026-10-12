import { api } from "../../../api/axios.ts";
import type { Task, TaskPriority, TaskStatus } from "../types/task.types.ts";
import { convertTaskDates } from "../utils/task.utils.ts";

type CreateTaskPayload = {
    title: string;
    description?: string;
    priority: TaskPriority;
    dueDate?: Date | null;
};

type UpdateTaskPayload = {
    title?: string;
    description?: string;
    priority?: TaskPriority;
    dueDate?: Date | null;
};

type MoveTaskPayload = {
    targetStatus: TaskStatus;
    targetPosition: number;
}

/**
 * Create a new task
 */
export const createTask = async (payload: CreateTaskPayload): Promise<Task> => {
    const response = await api.post("/api/tasks", {
        ...payload, dueDate: payload.dueDate !== undefined ? payload.dueDate ? payload.dueDate?.toISOString() : null : undefined,
    });

    return convertTaskDates(response.data.data);
};

/**
 * Get all tasks belonging to the authenticated user.
 */
export const getTasks = async (): Promise<Task[]> => {
    const response = await api.get("/api/tasks");
    const tasks = response.data.data;
    if(!Array.isArray(tasks)) {
        throw new Error ("Invalid GET /api/tasks response. Expected response.data.tasks to be an array");
    }
    return tasks.map(convertTaskDates);
};

/**
 * Get a single task
 */
export const getTaskById = async (taskId: string): Promise<Task> => {
    const response = await api.get(`/api/tasks/${taskId}`);
    return convertTaskDates(response.data.data);
};

/**
 * Update task information
 * This endpoint is intended for:
 * title
 * description
 * priority
 * due date
 */

export const updateTask = async (taskId: string, payload: UpdateTaskPayload): Promise<Task> => {
    const response = await api.patch(`/api/tasks/${taskId}`, {
        ...payload, dueDate: payload.dueDate !== undefined ? payload.dueDate ? payload.dueDate.toISOString() : null : undefined,
    });

    return convertTaskDates(response.data.data);
}

/**
 * Change only the task status.
 */
export const updateTaskStatus = async (
    taskId: string,
    status: TaskStatus
): Promise<Task> => {

    const response = await api.patch(
        `/api/tasks/${taskId}/status`,
        {
            status,
        }
    );

    return convertTaskDates(
        response.data.data
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

    const response = await api.patch(
        `/api/tasks/${taskId}/move`,
        {
            targetStatus: payload.targetStatus,
            targetPosition: payload.targetPosition,
        }
    );

    return convertTaskDates(
        response.data.data
    );
};


/**
 * Delete a task.
 */
export const deleteTask = async (
    taskId: string
): Promise<void> => {

    await api.delete(
        `/api/tasks/${taskId}`
    );
};