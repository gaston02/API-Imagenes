import multer from "multer";
import path from "path";

// Configuración de multer para el almacenamiento de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname); // Obtener extensión del archivo
    cb(null, file.fieldname + "-" + uniqueSuffix + extension); // Definir el nombre del archivo
  },
});

// Filtro para permitir solo imágenes
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // Aceptar el archivo si es una imagen
  } else {
    cb(new Error("El archivo subido no es una imagen"), false); // Rechazar si no es una imagen
  }
};

export const uploadImage = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1 * 1024 * 1024 }, // Tamaño máximo del archivo: 1MB
}).single("image"); // 'image' es el nombre del campo del formulario donde se sube la imagen
