import sharp from "sharp";

export const compressImage = async (inputPath, outputPath) => {
  try {
    // Verificar el formato y convertir a JPEG
    await sharp(inputPath)
      .resize(800) // Redimensionar a un ancho de 800px, manteniendo la relación de aspecto
      .toFormat("jpeg", { quality: 80 }) // Convertir a JPEG con calidad del 80%
      .toFile(outputPath);

    console.log(`Imagen comprimida y guardada en: ${outputPath}`);
  } catch (error) {
    console.error("Error al procesar la imagen:", error.message);
  }
};
