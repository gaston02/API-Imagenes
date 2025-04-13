import sharp from "sharp";
import fs from "fs/promises";

export const compressImage = async (
  inputPath,
  outputPath,
  maxWidth = 800,
  quality = 80,
  effort = 6
) => {
  try {
    // Verifica que el archivo de entrada exista
    await fs.access(inputPath);

    // Procesa la imagen:
    // 1. .rotate() corrige la orientación según los metadatos EXIF.
    // 2. .resize() ajusta el tamaño sin ampliar imágenes pequeñas.
    // 3. .removeMetadata() elimina los metadatos EXIF problemáticos.
    // 4. .webp() convierte la imagen a formato WebP con la calidad y esfuerzo indicados.
    await sharp(inputPath)
      .rotate()
      .resize({
        width: maxWidth,
        withoutEnlargement: true,
      })
      .removeMetadata()
      .webp({
        quality,
        effort,
      })
      .toFile(outputPath);
  } catch (error) {
    throw new Error(`Error al procesar la imagen: ${error.message}`);
  }
};
