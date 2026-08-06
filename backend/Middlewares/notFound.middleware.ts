import type { NextFunction, Request, Response } from "express";
import ApiError from "../utils/ApiError.ts";

const notFoundMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    next(
        new ApiError(
            404,
            `Route '${req.originalUrl}' not found.`
        )
    );
};

export default notFoundMiddleware;