import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/AsyncHandler.js";
import * as services from "../services/task.service.js";
function getTaskId(req) {
    const taskId = req.params.taskId;
    const normalizedTaskId = Array.isArray(taskId) ? taskId[0] : taskId;
    if (typeof normalizedTaskId !== "string" || !normalizedTaskId) {
        throw new ApiError(400, "Task ID is required.");
    }
    return normalizedTaskId;
}
/**
 * Create Task
 * POST /api/tasks
 */
export const createTask = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, "Unauthorized.");
    }
    const userId = req.user.id;
    const { title, description, priority, dueDate } = req.body;
    const task = await services.createTask(userId, {
        title,
        description,
        priority,
        dueDate,
    });
    res.status(201).json({
        success: true,
        message: "Task created successfully.",
        data: task,
    });
});
/**
 * Get all tasks
 * GET /api/tasks
 */
export const getTasks = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, "Unauthorized.");
    }
    const userId = req.user.id;
    const tasks = await services.getTasks(userId);
    res.status(200).json({
        success: true,
        message: "Tasks retrieved successfully.",
        data: tasks,
    });
});
/**
 * Get single task
 * GET /api/tasks/:taskId
 */
export const getTaskById = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, "Unauthorized.");
    }
    const userId = req.user.id;
    const taskId = getTaskId(req);
    const task = await services.getTaskById(userId, taskId);
    res.status(200).json({
        success: true,
        message: "Task retrieved successfully.",
        data: task,
    });
});
/**
 * Update task details
 * PATCH /api/tasks/:taskId
 */
export const updateTask = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, "Unauthorized.");
    }
    const userId = req.user.id;
    const taskId = getTaskId(req);
    const { title, description, priority, dueDate } = req.body;
    const updatedTask = await services.updateTask(userId, taskId, {
        title,
        description,
        priority,
        dueDate,
    });
    res.status(200).json({
        success: true,
        message: "Task updated successfully.",
        data: updatedTask,
    });
});
/**
 * Update task status
 * PATCH /api/tasks/:taskId/status
 */
export const updateTaskStatus = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, "Unauthorized.");
    }
    const userId = req.user.id;
    const taskId = getTaskId(req);
    const { status } = req.body;
    if (!status) {
        throw new ApiError(400, "Status is required.");
    }
    const updateTask = await services.updateTaskStatus(userId, taskId, status);
    res.status(200).json({
        success: true,
        message: "Task status updated successfully.",
        data: updateTask,
    });
});
/**
 * Move or reorder task
 * PATCH /api/tasks/:taskId/move
 */
export const moveTask = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, "Unauthorized.");
    }
    const userId = req.user.id;
    const taskId = getTaskId(req);
    const { targetStatus, targetPosition, } = req.body;
    if (!targetStatus) {
        throw new ApiError(400, "Target status is required.");
    }
    if (targetPosition === undefined || targetPosition === null) {
        throw new ApiError(400, "Target position is required.");
    }
    const updatedTask = await services.moveTask(userId, taskId, targetStatus, targetPosition);
    res.status(200).json({
        success: true,
        message: "Task moved successfully.",
        data: updatedTask,
    });
});
/**
 * Delete Task
 * DELETE /api/tasks/:taskId
 */
export const deleteTask = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, "Unauthorized.");
    }
    const userId = req.user.id;
    const taskId = getTaskId(req);
    await services.deleteTask(userId, taskId);
    res.status(200).json({
        success: true,
        message: "Task deleted successfully.",
        data: null,
    });
});
