import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const DB = process.env.MONGODB_URI;
export const TOKEN_SECRET = process.env.TOKEN_SECRET;
export const IMAGES_DIR = path.join(__dirname, "uploads");
export const API_KEY_BREVO = process.env.BREVO_API_KEY;
export const EMAIL = process.env.SUPPORT_EMAIL;