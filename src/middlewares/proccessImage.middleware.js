import { compressImage } from "../utils/compressImage.util.js";
import path from "path";

export const processImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }

    const inputPath = req.file.path;
    const ext = path.extname(inputPath);
    const basename = path.basename(inputPath, ext);
    const dir = path.dirname(inputPath);

    // Generar outputPath con sufijo -compressed y extensión original (solo como base)
    const outputPath = path.join(dir, `${basename}-compressed${ext}`);

    // La utilidad se encargará de renombrar finalmente a .webp
    const compressedPath = await compressImage(inputPath, outputPath);

    res.status(200).json({
      message: "Imagen subida y procesada con éxito.",
      imagePath: compressedPath,
    });
  } catch (error) {
    next(error);
  }
};
