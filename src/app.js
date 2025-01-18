import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import store from "./routes/store.routes.js";
import profile from "./routes/profile.routes.js";
import cron from "node-cron"; // Importa node-cron
import { deleteUncompressedImages } from "./services/image.service.js"; // Asegúrate de importar la función
import cors from "cors";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
const corsOptions = {
  origin: 'http://localhost:5173', // Origen permitido
  credentials: true, // Habilitar el envío de cookies y credenciales
};

//configurar cors
app.use(cors(corsOptions));
//const uploads = path.join(__dirname, 'uploads');

// Agregar console.log para verificar el middleware
//console.log(`Serving static files from: ${uploads}`);


// Define __dirname en ES module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Servir la carpeta "uploads" de manera estática
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", store);
app.use("/api", profile);

// Programar la tarea para eliminar imágenes no comprimidas cada 24 horas
cron.schedule("0 0 * * *", async () => {
  // Se ejecutará todos los días a la medianoche
  try {
    await deleteUncompressedImages();
    console.log("Eliminación de imágenes no comprimidas ejecutada.");
  } catch (error) {
    throw new Error(
      `Error al ejecutar la tarea de eliminacion de imagenes: ${error.message}`
    );
  }
});

// Ejecutar la tarea inmediatamente al iniciar la aplicación
(async () => {
  try {
    await deleteUncompressedImages();
    console.log("Eliminación de imágenes no comprimidas inicial ejecutada.");
  } catch (error) {
    throw new Error(
      `Error al ejecutar la eliminacion inicial de imagenes: ${error.message}`
    );
  }
})();

export default app;
