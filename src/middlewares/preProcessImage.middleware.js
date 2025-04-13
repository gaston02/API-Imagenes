import heicConvert from "heic-convert";
import fs from "fs/promises";
import path from "path";

export const convertHeicHeifMiddleware = async (req, res, next) => {
  try {
    if (!req.file) return next();

    const filePath = req.file.path;
    const inputExt = path.extname(filePath).toLowerCase(); // ej: .jpg, .png

    // Mapear la extensión a formatos válidos para heic-convert
    const extToFormat = {
      ".jpg": "JPEG",
      ".jpeg": "JPEG",
      ".png": "PNG",
      ".webp": "WEBP",
    };

    const targetFormat = extToFormat[inputExt] || "JPEG"; // fallback a JPEG si no está mapeado

    let outputBuffer;

    try {
      const inputBuffer = await fs.readFile(filePath);
      outputBuffer = await heicConvert({
        buffer: inputBuffer,
        format: targetFormat,
        quality: 1,
      });
    } catch (err) {
      return next(); // Si falla la conversión, no era HEIC/HEIF
    }

    const outputFilePath = filePath.replace(
      /\.[^/.]+$/,
      `.${targetFormat.toLowerCase()}`
    );
    await fs.writeFile(outputFilePath, outputBuffer);

    req.file.path = outputFilePath;
    req.file.filename = path.basename(outputFilePath);

    next();
  } catch (error) {
    next(error);
  }
};
