import path from "path";
import { compressImage } from "../utils/compressImage.util.js";

export const processImage = async (req, res, next) => {
  try {
    // Si no se recibe un archivo, simplemente continuar sin hacer nada
    if (!req.file) {
      return next();
    }

    const inputPath = req.file.path;
    // Obtener el directorio del archivo original
    const outputDir = path.dirname(inputPath);
    // Definir un nuevo nombre para la imagen procesada
    const outputFileName = `compressed-${path.basename(inputPath)}`;
    // Construir el path completo para la imagen procesada
    const outputPath = path.join(outputDir, outputFileName);

    // Comprimir la imagen usando la función de utilidad
    await compressImage(inputPath, outputPath);

    // Guardar el nombre del archivo procesado en req para su uso posterior
    req.processedImagePath = outputFileName;

    next();
  } catch (error) {
    next(error);
  }
};
