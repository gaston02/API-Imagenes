import sharp from "sharp";
import fs from "fs/promises";

export const compressImage = async (
  inputPath,
  outputPath,
  {
    maxWidth = 800,
    quality = 80,
    effort = 6,
    format = "webp",
    failOnError = false,
  } = {}
) => {
  try {
    await fs.access(inputPath);

    const processor = sharp(inputPath, { failOnError })
      .rotate()
      .resize({
        width: maxWidth,
        withoutEnlargement: true,
        fit: "inside",
      })
      .toColourspace("srgb")
      .removeMetadata();

    // Configurar formato de salida
    switch (format.toLowerCase()) {
      case "jpeg":
      case "jpg":
        processor.jpeg({ quality, mozjpeg: true });
        break;
      case "png":
        processor.png({ compressionLevel: 9 });
        break;
      case "webp":
      default:
        processor.webp({ quality, effort });
    }

    await processor.toFile(outputPath);
  } catch (error) {
    console.error("Error details:", error); // Mejor logging
    throw new Error(`Error al procesar la imagen: ${error.message}`);
  }
};
