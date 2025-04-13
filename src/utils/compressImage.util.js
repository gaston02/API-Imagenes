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
    chromaSubsampling = "4:4:4",
    compressionLevel = 9,
  } = {}
) => {
  try {
    const inputBuffer = await fs.readFile(inputPath);

    const pipeline = sharp(inputBuffer, {
      failOnError,
      sequentialRead: true,
    });

    // Procesamiento principal
    pipeline
      .rotate()
      .resize({
        width: maxWidth,
        withoutEnlargement: true,
        fit: "inside",
        kernel: sharp.kernel.lanczos3,
      })
      .flatten({ background: "#ffffff" })
      .normalise()
      .linear(1.1)
      .sharpen({ sigma: 0.5, m1: 0, m2: 3, x1: 3, y2: 15, y3: 15 });

    // Configuración de formato
    switch (format.toLowerCase()) {
      case "jpeg":
      case "jpg":
        pipeline.jpeg({
          quality,
          mozjpeg: true,
          chromaSubsampling,
        });
        break;

      case "png":
        pipeline.png({
          compressionLevel,
          adaptiveFiltering: true,
        });
        break;

      case "webp":
      default:
        pipeline.webp({
          quality,
          effort,
          smartSubsample: true,
        });
    }

    await pipeline.toFile(outputPath);
    console.log("Procesamiento exitoso");
  } catch (error) {
    console.error("Error detallado:", {
      inputPath,
      errorCode: error.code,
      params: { maxWidth, quality, effort, format }, // Registramos los parámetros usados
    });
    throw new Error(`Error procesando imagen: ${error.message}`);
  }
};
