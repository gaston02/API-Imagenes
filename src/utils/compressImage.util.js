import sharp from "sharp";

export const compressImage = async (inputPath, outputPath, maxWidth = 800) => {
  try {
    // Aplicar compresión utilizando WebP, que suele ser más eficiente que JPEG
    await sharp(inputPath)
      .resize({
        width: maxWidth, // Redimensionar con un ancho máximo configurable
        withoutEnlargement: true, // Evitar agrandar imágenes más pequeñas
      })
      .webp({
        quality: 80, // Ajustar la calidad a un 85% (buen balance entre calidad y tamaño)
        effort: 6, // Nivel de esfuerzo de compresión (1 más rápido, 6 mayor compresión)
      })
      .toFile(outputPath);

    console.log(`Imagen comprimida y guardada en: ${outputPath}`);
  } catch (error) {
    console.error("Error al procesar la imagen:", error.message);
  }
};