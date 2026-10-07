import { ZodError } from "zod";
const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            params: req.params,
            query: req.query,
        });
        next();
    }
    catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({
                success: false,
                message: "Validation failed.",
                errors: error.issues.map((err) => ({
                    field: err.path.join("."),
                    message: err.message,
                })),
            });
            return;
        }
        next(error);
    }
};
export default validate;
