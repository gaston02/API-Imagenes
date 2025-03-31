import path from "path";
import { compressImage } from "../utils/compressImage.util.js";

export const processImage = async (req, res, next) => {
  try {
    // Si no se recibe un archivo, simplemente continuar sin hacer nada
    if (!req.file) {
      return next(); // Continuar con la siguiente etapa en la cadena de middlewares
    }

    const inputPath = req.file.path;

    // Crear un nuevo outputPath
    const outputDir = path.dirname(inputPath); // Obtener el directorio del archivo original
    const outputFileName = `compressed-${path.basename(inputPath)}`; // Cambiar el nombre del archivo
    const outputPath = path.join(outputDir, outputFileName); // Construir el nuevo path

    await compressImage(inputPath, outputPath); // Comprimir la imagen

    // Guardar solo el nombre del archivo procesado en req.processedImagePath
    req.processedImagePath = outputFileName;

    console.log("cruza los dedos: " + req.processedImagePath);

    next(); // Continuar con el siguiente middleware
  } catch (error) {
    next(error);
  }
};
