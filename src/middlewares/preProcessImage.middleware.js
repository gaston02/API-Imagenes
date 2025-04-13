import { fileTypeFromFile } from "file-type";
import heicConvert from "heic-convert";
import fs from "fs/promises";
import path from "path";

export const convertHeicHeifMiddleware = async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }

    // Obtener el tipo real del archivo subido
    const filePath = req.file.path;
    const type = await fileTypeFromFile(filePath);

    // Si no se pudo determinar el tipo o no es HEIC/HEIF, continuar sin hacer nada
    if (!type || (type.mime !== "image/heic" && type.mime !== "image/heif")) {
      return next();
    }

    // Si se detecta HEIC/HEIF, se procede a la conversión a WEBP
    const inputBuffer = await fs.readFile(filePath);
    const outputBuffer = await heicConvert({
      buffer: inputBuffer,   // Buffer de la imagen original
      format: "WEBP",        // Convertir a WEBP
      quality: 1             // Calidad máxima (puedes ajustarlo según tus necesidades)
    });

    // Definir el nuevo path y nombre para el archivo convertido
    const outputFilePath = filePath.replace(/\.[^/.]+$/, ".webp");
    await fs.writeFile(outputFilePath, outputBuffer);

    // Actualizar la información del archivo en req.file para usar el nuevo archivo
    req.file.path = outputFilePath;
    req.file.filename = path.basename(outputFilePath);

    next();
  } catch (error) {
    next(error);
  }
};
