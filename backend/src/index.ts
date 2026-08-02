import express from "express"
import dotenv from "dotenv"
dotenv.config()

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello from server");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});