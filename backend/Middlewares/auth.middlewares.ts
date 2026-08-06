import type { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma.ts";
import { verifyAccessToken } from "../utils/jwt.ts";
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.ts";
import logger from "../utils/logger.ts";

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
            throw new ApiError(401, "Authorization token missing.");
        }

        // Checks whether the authHeader is starting with "Bearer" or not.
        if (!authHeader.startsWith("Bearer ")) {
            throw new ApiError(401, "Invalid authorization format.");
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
            throw new ApiError(401, "User not found.");
        }

        // Is user active or not.
        if (!user.isActive) {
            throw new ApiError(403, "Accunt has been disabled.");
        }

        // Is user verified or not.
        if (!user.isVerified) {
            throw new ApiError(403, "Please verify your email first.");
        }

        // Check Blacklisted Token
        const blacklisted = await prisma.blacklistedToken.findUnique({
            where: {
                token,
            },
        });

        if (blacklisted) {
            throw new ApiError(401, "Token has been revoked.");
        }

        // Check Session
        const session = await prisma.session.findFirst({
            where: {
                userId: decoded.userId,
                revoked: false,
            },
        });

        if (!session) {
            throw new ApiError(401, "Session expired.");
        }

        req.user = user;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new ApiError(401, "Token expired");
        }

        if (error instanceof jwt.JsonWebTokenError) {
            throw new ApiError(401, "Invalid token.");
        }

        logger.error(error);
        throw new ApiError(401, "Invalid or expired token");
    }
};

export default authenticateUser;