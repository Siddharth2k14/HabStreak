import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import jwt from "jsonwebtoken";
import { ZodError } from "zod";
import ApiError from "../utils/ApiError";
import logger from "../utils/logger";

const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    logger.error(err);

    // Custom API Errors
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
        return;
    }

    // Zod Validation Errors
    if (err instanceof ZodError) {
        res.status(400).json({
            success: false,
            message: "Validation failed.",
            errors: err.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            })),
        });
        return;
    }

    // JWT Expired
    if (err instanceof jwt.TokenExpiredError) {
        res.status(401).json({
            success: false,
            message: "Token has expired.",
        });
        return;
    }

    // Invalid JWT
    if (err instanceof jwt.JsonWebTokenError) {
        res.status(401).json({
            success: false,
            message: "Invalid token.",
        });
        return;
    }

    // Prisma Known Errors
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case "P2002":
                res.status(409).json({
                    success: false,
                    message: "Duplicate record.",
                });
                return;

            case "P2025":
                res.status(404).json({
                    success: false,
                    message: "Record not found.",
                });
                return;

            default:
                res.status(400).json({
                    success: false,
                    message: err.message,
                });
                return;
        }
    }

    // Prisma Validation Error
    if (err instanceof Prisma.PrismaClientValidationError) {
        res.status(400).json({
            success: false,
            message: "Invalid database query.",
        });
        return;
    }

    // Unknown Errors
    res.status(500).json({
        success: false,
        message: "Internal Server Error.",
    });
};

export default errorMiddleware;