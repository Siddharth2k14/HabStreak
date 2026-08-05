import { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma.ts";
import { verifyAccessToken } from "../utils/jwt.ts";
import jwt from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                username: string;
                email: string;
                createdAt: Date;
                updatedAt: Date;
                isActive: Boolean;
                isVerified: Boolean;
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
        const decoded = verifyAccessToken(token);

        const user = await prisma.user.findUnique({
            where: {
                id: decoded.userId,
            },
            select: {
                id: true,
                username: true,
                email: true,
                createdAt: true,
                updatedAt: true,
                isActive: true,
                isVerified: true,
            },
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        // Is user active or not.
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your account has been disabled.",
            });
        }

        // Is user verified or not.
        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: "Please verify your email.",
            });
        }

        // Check Blacklisted Token
        const blacklisted = await prisma.blacklistedToken.findUnique({
            where: {
                token,
            },
        });

        if (blacklisted) {
            return res.status(401).json({
                success: false,
                message: "Token has been revoked.",
            });
        }

        // Check Session
        const session = await prisma.session.findFirst({
            where: {
                userId: decoded.userId,
                revoked: false,
            },
        });

        if (!session) {
            return res.status(401).json({
                success: false,
                message: "Session expired.",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                success: false,
                message: "Token expired.",
            });
        }

        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                success: false,
                message: "Invalid token.",
            });
        }

        console.error(error);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};

export default authenticateUser;