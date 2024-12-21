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
    // Verificar que el archivo de entrada exista
    await fs.access(inputPath);

    // Comprimir la imagen utilizando sharp y WebP
    await sharp(inputPath)
      .resize({
        width: maxWidth, // Redimensionar con un ancho máximo configurable
        withoutEnlargement: true, // Evitar agrandar imágenes más pequeñas
      })
      .webp({
        quality, // Ajustar la calidad según el parámetro
        effort, // Nivel de esfuerzo de compresión (1 más rápido, 6 mayor compresión)
      })
      .toFile(outputPath);

  } catch (error) {
    throw new Error(`Error al procesar la imagen: ${error.message}`);
  }
};
