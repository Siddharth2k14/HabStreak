import express from "express";
import authenticateUser from "../../Middlewares/auth.middlewares.js";
import validate from "../../Middlewares/validation.middleware.js";
import { createTask, getTasks, getTaskById, updateTask, updateTaskStatus, moveTask, deleteTask, } from "../../Controllers/task.controller.js";
import { createTaskSchema, updateTaskSchema, updateTaskStatusSchema, moveTaskSchema, taskIdSchema, } from "../../validators/task.validator.js";
const router = express.Router();
/**
 * Create Task
 *
 * POST /tasks
 */
router.post("/", authenticateUser, validate(createTaskSchema), createTask);
/**
 * Get all Tasks
 *
 * GET /tasks
 */
router.get("/", authenticateUser, getTasks);
/**
 * Get one Task
 *
 * GET /tasks/:taskId
 */
router.get("/:taskId", authenticateUser, validate(taskIdSchema), getTaskById);
/**
 * Update Task Status
 *
 * PATCH /tasks/:taskId/status
 */
router.patch("/:taskId/status", authenticateUser, validate(updateTaskStatusSchema), updateTaskStatus);
/**
 * Move Task
 *
 * PATCH /tasks/:taskId/move
 */
router.patch("/:taskId/move", authenticateUser, validate(moveTaskSchema), moveTask);
/**
 * Update Task
 *
 * PATCH /tasks/:taskId
 */
router.patch("/:taskId", authenticateUser, validate(updateTaskSchema), updateTask);
/**
 * Delete Task
 *
 * DELETE /tasks/:taskId
 */
router.delete("/:taskId", authenticateUser, validate(taskIdSchema), deleteTask);
export default router;
