import express from "express"
import dotenv from "dotenv"
import loggerMiddleware from "../Middlewares/logger.middleware.ts";
import errorMiddleware from "../Middlewares/error.middleware.ts";
import logger from "../utils/logger.ts";
import notFoundMiddleware from "../Middlewares/notFound.middleware.ts";
import userRoutes from "../Routes/User Routes/user.routes.ts";
import taskRoutes from "../Routes/Task Routes/task.routes.ts";

dotenv.config()

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(loggerMiddleware);

app.get("/", (req, res) => {
    res.send("Hello from server");
});

app.use("/api/auth", userRoutes);
app.use("/api/tasks", taskRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
});