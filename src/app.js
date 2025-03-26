import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import store from "./routes/store.routes.js";
import profile from "./routes/profile.routes.js";
import cron from "node-cron"; // Importa node-cron
import { deleteUncompressedImages } from "./services/image.service.js"; // Importa la función
import cors from "cors";

const app = express();

// 1. Middlewares básicos
app.use(morgan("dev")); // Logs de solicitudes
app.use(express.json()); // Parsear JSON en las solicitudes
app.use(cookieParser()); // Manejar cookies

// 2. Configuración de CORS
app.use(
  cors({
    origin: "https://picvaul.com", // Solo permite tu dominio de producción
    credentials: true, // Permite enviar cookies
  })
);

// app.js (ubicado en /API-Imagenes/src/)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads"))); // 👈 Usa ".." para subir un nivel

// 4. Rutas
app.use("/api", store);
app.use("/api", profile);

// 5. Tarea programada para eliminar imágenes no comprimidas
cron.schedule("0 0 * * *", async () => {
  // Se ejecutará todos los días a la medianoche
  try {
    await deleteUncompressedImages();
    console.log("[CRON] Eliminación de imágenes no comprimidas ejecutada.");
  } catch (error) {
    console.error("[CRON ERROR]", error.message);
  }
});

// 6. Ejecutar la tarea inmediatamente al iniciar la aplicación
(async () => {
  try {
    await deleteUncompressedImages();
    console.log(
      "[INIT] Eliminación de imágenes no comprimidas inicial ejecutada."
    );
  } catch (error) {
    console.error("[INIT ERROR]", error.message);
  }
})();

// 7. Endpoint de salud
app.get("/status", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date() });
});

export default app;
