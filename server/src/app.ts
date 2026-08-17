dotenv.config();
import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { routerUser } from "./routes/user.route.ts";
import { routerTicket } from "./routes/ticket.route.ts";

export const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json())

app.use(routerUser);
app.use(routerTicket);

app.listen(port, () => {
    console.log("Server running at port", port, "🚀");
})