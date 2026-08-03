import { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma";

const authorizeTaskOwner = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Authentication middleware should already attach req.user
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: "Unauthorized.",
            });
            return;
        }

        const { taskId } = req.params;

        if (!taskId || typeof taskId !== "string") {
            res.status(400).json({
                success: false,
                message: "Invalid Task ID.",
            });
            return;
        }

        const task = await (prisma as any).task.findUnique({
            where: {
                id: taskId,
            },
            select: {
                id: true,
                userId: true,
            },
        });

        if (!task) {
            res.status(404).json({
                success: false,
                message: "Task not found.",
            });
            return;
        }

        if (task.userId !== req.user.id) {
            res.status(403).json({
                success: false,
                message: "You are not authorized to access this task.",
            });
            return;
        }

        next();
    } catch (error) {
        console.error("Authorization Middleware Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};

export default authorizeTaskOwner;