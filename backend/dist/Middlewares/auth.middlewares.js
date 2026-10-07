import {prisma} from "../config/prisma.js";
import { verifyAccessToken } from "../utils/jwt.js";
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import logger from "../utils/logger.js";
/**
 * authenticateUser
 *
 */
const authenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = req.cookies?.accessToken ?? (authHeader?.startsWith("Bearer") ? authHeader.slice(7) : undefined);
        if (!token) {
            throw new ApiError(401, "No token provided.");
        }
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
        if (!user.isActive) {
            throw new ApiError(403, "Account has been disabled.");
        }
        const blackListed = await prisma.blacklistedToken.findUnique({
            where: {
                token
            },
        });
        if (blackListed) {
            throw new ApiError(401, "Token has been revoked.");
        }
        const session = await prisma.session.findFirst({
            where: {
                userId: decoded.userId,
                expiresAt: {
                    gt: new Date(),
                },
            },
        });
        if (!session) {
            throw new ApiError(401, "Session expired.");
        }
        req.user = user;
        next();
    }
    catch (error) {
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
