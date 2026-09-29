import express from "express";

import authenticateUser from "../../Middlewares/auth.middlewares.ts";

import {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    updateTaskStatus,
    moveTask,
    deleteTask,
} from "../../Controllers/task.controller.ts";

const router = express.Router();

router.post("/", authenticateUser, createTask);

router.get("/", authenticateUser, getTasks);

router.get("/:taskId", authenticateUser, getTaskById);

router.patch("/:taskId/status", authenticateUser, updateTaskStatus);

router.patch("/:taskId/move", authenticateUser, moveTask);

router.patch("/:taskId", authenticateUser, updateTask);

router.delete("/:taskId", authenticateUser, deleteTask);

export default router;