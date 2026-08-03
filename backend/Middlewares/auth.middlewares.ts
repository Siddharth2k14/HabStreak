import { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma.ts";
import { verifyToken } from "../utils/jwt.ts";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                username: string;
                email: string;
                createdAt: Date;
                updatedAt: Date;
            };
        }
    }
}

/**
 * authenticateUser
 *  
 */
const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        // If the authHeader is missing from the request, then throw the 401 error.
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authorization token missing",
            });
        }

        // Checks whether the authHeader is starting with "Bearer" or not.
        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization format",
            });
        }

        // Splits the authHeader after the space and starting with index 1.
        const token = authHeader.split(" ")[1];
        const decoded = verifyToken(token);

        const user = await prisma.user.findUnique({
            where: {
                id: decoded.userId,
                username: decoded.username,
            },
            select: {
                id: true,
                username: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};

export default authenticateUser;