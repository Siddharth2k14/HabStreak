import express from "express"
import dotenv from "dotenv"
import prisma from "../config/prisma.ts";
dotenv.config()

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello from server");
});

app.post("/postData", (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).send("Passwords do not match.");
    }

    // Use Prisma client to create a new User record
    (async () => {
        try {
            // Adjust fields according to your Prisma schema. If confirmPassword is not a model field,
            // do not include it in the create data.
            const created = await prisma.user.create({
                data: {
                    username,
                    email,
                    password,
                    confirmPassword,
                },
            });
            return res.status(201).json({ message: "Posted Data", user: created });
        } catch (error) {
            console.error("Database Error:", error);
            return res.status(500).send(error);
        }
    })();
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});