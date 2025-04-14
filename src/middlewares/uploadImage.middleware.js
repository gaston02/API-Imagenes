import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Obtener ruta absoluta del directorio actual (src/)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuración de multer para el almacenamiento de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads")); // Ruta absoluta: /API-Imagenes/src/uploads/
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname); // Obtener extensión del archivo
    cb(null, file.fieldname + "-" + uniqueSuffix + extension); // Definir el nombre del archivo
  },
});

console.log("storage: " + JSON.stringify(storage));

// Filtro para permitir solo imágenes
const fileFilter = (req, file, cb) => {
  const allowedExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".heic",
    ".heif",
  ];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(ext)) {
    cb(null, true); // Aceptar extensiones conocidas de imágenes (aunque el mimetype venga mal)
  } else {
    cb(
      new Error("El archivo subido no tiene una extensión de imagen válida"),
      false
    );
  }
};

export const uploadImage = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Tamaño máximo del archivo: 5MB
}).single("image"); // 'image' es el nombre del campo del formulario donde se sube la imagen

export const profileImage = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Tamaño máximo del archivo: 5MB
}).single("profileImage"); // 'profileImage' es el nombre del campo del formulario donde se sube la imagen
