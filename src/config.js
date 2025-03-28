import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const DB = "mongodb://localhost/imagenes";
export const TOKEN_SECRET = 'secret123';
export const IMAGES_DIR = path.join(__dirname, "uploads");