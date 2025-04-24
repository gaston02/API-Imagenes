import heicConvert from "heic-convert";
import fs from "fs/promises";
import path from "path";

export const convertHeicHeifMiddleware = async (req, res, next) => {
  try {
    if (!req.file) return next();

    const filePath = req.file.path;
    const inputExt = path.extname(filePath).toLowerCase();

    // Mapear la extensión a formatos válidos para heic-convert y sus mimetypes
    const extToFormat = {
      ".jpg": { format: "JPEG", mime: "image/jpeg" },
      ".jpeg": { format: "JPEG", mime: "image/jpeg" },
      ".png": { format: "PNG", mime: "image/png" },
      ".webp": { format: "WEBP", mime: "image/webp" },
    };

    const target = extToFormat[inputExt] || { format: "JPEG", mime: "image/jpeg" };

    let outputBuffer;

    try {
      const inputBuffer = await fs.readFile(filePath);
      outputBuffer = await heicConvert({
        buffer: inputBuffer,
        format: target.format,
        quality: 1,
      });
    } catch (err) {
      return next(); // No es HEIC/HEIF, dejar pasar
    }

    const outputFilePath = filePath.replace(/\.[^/.]+$/, `.${target.format.toLowerCase()}`);
    await fs.writeFile(outputFilePath, outputBuffer);

    req.file.path = outputFilePath;
    req.file.filename = path.basename(outputFilePath);
    req.file.mimetype = target.mime; // Reemplazar el mimetype

    next();
  } catch (error) {
    next(error);
  }
};
