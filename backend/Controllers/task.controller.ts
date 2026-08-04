import { Request, Response } from "express";
import prisma from "../config/prisma";
import { Prisma } from "@prisma/client";

export const createTask = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: "Unauthorized.",
            });
            return;
        }

        const { title, description, priority, dueDate } = req.body;

        const task = await (prisma as any).task.create({
            data: {
                title,
                description,
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
    } catch (error) {
        console.error("Create Task Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const { taskId } = req.params;

        const {
            title,
            description,
            status,
            priority,
            dueDate,
        } = req.body;

        const updatedTask = await (prisma as any).task.update({
            where: {
                id: taskId,
            },
            data: {
                ...(title !== undefined && { title }),
                ...(description !== undefined && { description }),
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
    } catch (error) {
        console.error("Update Task Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const { taskId } = req.params;

        await (prisma as any).task.delete({
            where: {
                id: taskId,
            },
        });

        res.status(200).json({
            success: true,
            message: "Task deleted successfully.",
        });
    } catch (error) {
        console.error("Delete Task Error:", error);

        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2025"
        ) {
            res.status(404).json({
                success: false,
                message: "Task not found.",
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};