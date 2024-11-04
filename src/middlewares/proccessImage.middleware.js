import path from "path";
import { compressImage } from "../utils/compressImage.util.js";

export const processImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "No se ha subido ninguna imagen para procesar" });
    }

    const inputPath = req.file.path;

    // Crear un nuevo outputPath
    const outputDir = path.dirname(inputPath); // Obtener el directorio del archivo original
    const outputFileName = `compressed-${path.basename(inputPath)}`; // Cambiar el nombre del archivo
    const outputPath = path.join(outputDir, outputFileName); // Construir el nuevo path

    await compressImage(inputPath, outputPath);

    // Guardar solo el nombre del archivo en req.processedImagePath
    req.processedImagePath = outputFileName;

    next();
  } catch (error) {
    next(error);
  }
};
