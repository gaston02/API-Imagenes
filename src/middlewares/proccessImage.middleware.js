import { compressImage } from "../utils/compressImage.util.js";

export const processImage = async (req, res, next) => {
  try {
    if(!req.file){
      return next();
    }
    const inputPath = req.file.path;
    const outputPath = inputPath;

    await compressImage(inputPath, outputPath); // Llama a la función para comprimir la imagen
    outputPath = "compressed-" + inputPath;
    res
      .status(200)
      .json({
        message: "Imagen subida y procesada con éxito.",
        imagePath: outputPath,
      });
  } catch (error) {
    next(error); // Pasar el error al siguiente middleware de manejo de errores
  }
};
