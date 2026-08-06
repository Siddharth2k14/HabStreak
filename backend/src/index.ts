import express from "express"
import dotenv from "dotenv"
import loggerMiddleware from "../Middlewares/logger.middleware.ts";
import errorMiddleware from "../Middlewares/error.middleware.ts";
import prisma from "../config/prisma.ts";
import logger from "../utils/logger.ts";
import notFoundMiddleware from "../Middlewares/notFound.middleware.ts";
dotenv.config()

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(loggerMiddleware);

app.get("/", (req, res) => {
    res.send("Hello from server");
});

// app.post("/postData", (req, res) => {
//     const { username, email, password, confirmPassword } = req.body;

//     if (password !== confirmPassword) {
//         return res.status(400).send("Passwords do not match.");
//     }

//     // Use Prisma client to create a new User record
//     (async () => {
//         try {
//             // Adjust fields according to your Prisma schema. If confirmPassword is not a model field,
//             // do not include it in the create data.
//             const created = await prisma.user.create({
//                 data: {
//                     username,
//                     email,
//                     password,
//                     confirmPassword,
//                 },
//             });
//             return res.status(201).json({ message: "Posted Data", user: created });
//         } catch (error) {
//             logger.error("Database Error:", error);
//             return res.status(500).send(error);
//         }
//     })();
// });

app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
});