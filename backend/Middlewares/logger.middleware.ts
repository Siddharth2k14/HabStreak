import type { Request, Response, NextFunction } from "express";
import logger from "../utils/logger.ts";

const loggerMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    const start = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - start;

        logger.info(
            `${req.method} ${req.originalUrl} | ${res.statusCode} | ${duration} ms | IP: ${req.ip}`
        );
    });

    next();
};

export default loggerMiddleware;