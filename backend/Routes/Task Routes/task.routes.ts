import express from "express";
import authenticateUser from "../../Middlewares/auth.middlewares";
import validate from "../../Middlewares/validation.middleware";
import { createTaskSchema, taskIdSchema, updateTaskSchema } from "../../validators/task.validator";
import authorizeTaskOwner from "../../Middlewares/authorization.middleware";
import { createTask, deleteTask, updateTask } from "../../Controllers/task.controller";

const router = express.Router();

/**
 * Create Task
 */
router.post("/tasks", authenticateUser, validate(createTaskSchema), createTask);

/**
 * Update Task
 */
router.patch("/tasks/:taskId", authenticateUser, authorizeTaskOwner, validate(updateTaskSchema), updateTask);

/**
 * Delete Task
 */
router.delete("/tasks/:taskId", authenticateUser, authorizeTaskOwner, validate(taskIdSchema), deleteTask);

export default router;