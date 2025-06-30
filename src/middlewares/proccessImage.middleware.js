import { compressImage } from "../utils/compressImage.util.js";

export const processImage = async (req, res, next) => {
  try {
    // Si no hay archivo, continúa sin hacer nada
    if (!req.file) {
      return next();
    }

    const inputPath = req.file.path;

    // Comprimir la imagen (la función devuelve el nuevo path)
    const compressedPath = await compressImage(inputPath);

    // Guardar la ruta de la imagen comprimida para usarla en el controller
    req.processedImagePath = compressedPath;

    // Continuar al siguiente middleware o controller
    next();
  } catch (error) {
    // Pasar error al manejador global
    next(error);
  }
};
