import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

export const compressImage = async (
  inputPath,
  outputPath,
  maxWidth = 800,
  quality = 80,
  effort = 6
) => {
  try {
    await fs.access(inputPath);

    // Procesar outputPath para agregar sufijo -compressed y cambiar extensión a .webp
    const ext = path.extname(outputPath);
    const basename = path.basename(outputPath, ext);
    const dir = path.dirname(outputPath);
    const finalOutputPath = path.join(dir, `${basename}.webp`);

    await sharp(inputPath)
      .resize({
        width: maxWidth,
        withoutEnlargement: true,
      })
      .webp({
        quality,
        effort,
      })
      .toFile(finalOutputPath);

    return finalOutputPath;
  } catch (error) {
    throw new Error(`Error al procesar la imagen: ${error.message}`);
  }
};
