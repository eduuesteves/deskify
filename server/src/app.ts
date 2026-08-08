dotenv.config();
import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { routerUser } from "./routes/user.route";

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json())

app.use(routerUser);

app.listen(port, () => {
    console.log("Server running at port", port, "🚀");
})