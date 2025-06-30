import path from "path";
import { compressImage } from "../utils/compressImage.util.js";

export const processImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }

    const inputPath = req.file.path;
    const compressedPath = await compressImage(inputPath);

    // ✅ Obtener solo el nombre de archivo (ej: compressed-image-xxxx.jpg)
    const filename = path.basename(compressedPath);

    // ✅ Guardar solo el nombre en processedImagePath
    req.processedImagePath = filename;

    next();
  } catch (error) {
    next(error);
  }
};
