import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import store from "./routes/store.routes.js";


const app = express();

app.use(morgan("dev"));

app.use(express.json());
app.use(cookieParser());
app.use("/api", store);

export default app;
