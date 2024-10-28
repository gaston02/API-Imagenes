import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from 'path';
import store from "./routes/store.routes.js";
import profile from "./routes/profile.routes.js";


const app = express();

app.use(morgan("dev"));

app.use(express.json());
app.use(cookieParser());
// Servir la carpeta "uploads" de manera estática
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use("/api", store);
app.use("/api", profile);

export default app;
