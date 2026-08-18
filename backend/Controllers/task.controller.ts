import type { Request, Response } from "express";
import prisma from "../config/prisma.ts";
import ApiError from "../utils/ApiError.ts";
import asyncHandler from "../utils/AsyncHandler.ts";

export const createTask = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
        throw new ApiError(401, "Unauthorized.");
    }

    const { title, description, link, priority, dueDate } = req.body;

    const task = await prisma.task.create({
        data: {
            title,
            description,
            link,
            priority,
            dueDate: dueDate ? new Date(dueDate) : null,
            userId: req.user.id,
        },
    });

    res.status(201).json({
        success: true,
        message: "Task created successfully.",
        task,
    });
});

export const updateTask = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { taskId } = req.params;

    const {
        title,
        description,
        link,
        status,
        priority,
        dueDate,
    } = req.body;

    const updatedTask = await prisma.task.update({
        where: {
            id: taskId,
        },
        data: {
            ...(title !== undefined && { title }),
            ...(description !== undefined && { description }),
            ...(link !== undefined && { link }),
            ...(status !== undefined && { status }),
            ...(priority !== undefined && { priority }),
            ...(dueDate !== undefined && {
                dueDate: dueDate ? new Date(dueDate) : null,
            }),
        },
    });

    res.status(200).json({
        success: true,
        message: "Task updated successfully.",
        task: updatedTask,
    });
});

export const deleteTask = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { taskId } = req.params;

    await prisma.task.delete({
        where: {
            id: taskId,
        },
    });

    res.status(200).json({
        success: true,
        message: "Task deleted successfully.",
    });

});
