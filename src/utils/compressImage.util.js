import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

export const compressImage = async (
  inputPath,
  maxWidth = 800,
  quality = 80,
  effort = 6
) => {
  try {
    await fs.access(inputPath);

    const dir = path.dirname(inputPath);
    const ext = path.extname(inputPath);
    const basename = path.basename(inputPath, ext);
    const outputPath = path.join(dir, `compressed-${basename}${ext}`);

    await sharp(inputPath)
      .resize({
        width: maxWidth,
        withoutEnlargement: true,
      })
      .webp({
        quality,
        effort,
      })
      .toFile(outputPath);

    return outputPath; // ✅ Devolver nuevo path
  } catch (error) {
    throw new Error(`Error al procesar la imagen: ${error.message}`);
  }
};
