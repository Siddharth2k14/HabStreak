import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodRawShape, ZodError } from "zod";

const validate = (schema: ZodObject<ZodRawShape>) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse({
            body: req.body,
            params: req.params,
            query: req.query,
        });

        next();
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({
                success: false,
                message: "Validation failed.",
                errors: error.issues.map((err: any) => ({
                    field: err.path.join("."),
                    message: err.message,
                })),
            });

            return;
        }
        next(error as any);
    }
}

export default validate;