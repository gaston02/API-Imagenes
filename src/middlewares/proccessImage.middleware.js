import { compressImage } from "../utils/compressImage.util.js";

export const processImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "No se ha subido ninguna imagen para procesar" });
    }

    const inputPath = req.file.path;
    const outputPath = inputPath;

    await compressImage(inputPath, outputPath);

    // Guardar la ruta de la imagen procesada en el objeto de la solicitud
    req.processedImagePath = outputPath;

    next();
  } catch (error) {
    next(error);
  }
};
