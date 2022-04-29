import express from "express";
import cors from "cors";
import errorHandler from "./handlers/error.js"
import authRoutes from "./routes/auth.js"
import dotenv from 'dotenv';
dotenv.config()

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

// handler
app.use("/auth", authRoutes)

app.use(errorHandler);

app.listen(6969, () => {
    console.log("started on localhost:6969")
})