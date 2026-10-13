import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import loggerMiddleware from "../Middlewares/logger.middleware.js";
import errorMiddleware from "../Middlewares/error.middleware.js";
import logger from "../utils/logger.js";
import notFoundMiddleware from "../Middlewares/notFound.middleware.js";
import userRoutes from "../Routes/User Routes/user.routes.js";
import taskRoutes from "../Routes/Task Routes/task.routes.js";
import authenticateUser from "../Middlewares/auth.middlewares.js";
const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
}));
app.use(loggerMiddleware);
app.get("/", (req, res) => {
    res.send("Hello from server");
});
app.use("/api/auth", userRoutes);
app.use("/api/tasks", authenticateUser, taskRoutes);
// app.use("/api/tasks", taskRoutes);
app.use(notFoundMiddleware);
app.use(errorMiddleware);
app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
});
