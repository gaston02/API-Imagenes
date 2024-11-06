import fs from "fs";
import path from "path";
import { handleGenericError } from "../utils/error.util.js";
import { handleGenericSuccess } from "../utils/success.util.js";
import { uploadImage } from "../middlewares/uploadImage.middleware.js";
import { processImage } from "../middlewares/proccessImage.middleware.js";
import { createImageSchema } from "../schemas/image.schema.js";
import * as imageService from "../services/image.service.js";

const UPLOADS_DIR = path.resolve("C:/Users/gasto/OneDrive/uploads");

export async function createImageController(req, res, next) {
  try {
    // Subir la imagen
    await new Promise((resolve, reject) => {
      uploadImage(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Procesar la imagen
    await new Promise((resolve, reject) => {
      processImage(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Verificar que se haya procesado la imagen
    if (!req.processedImagePath) {
      return res.status(500).json({
        error: "Error al procesar la imagen",
      });
    }

    const imageData = {
      name: req.body.name,
      public: req.body.public,
      galleryId: req.body.galleryId,
      path: req.processedImagePath,
    };

    try {
      createImageSchema.parse(imageData);
    } catch (error) {
      const imagePath = path.join(UPLOADS_DIR, req.processedImagePath);

      // Intentar eliminar directamente el archivo y manejar errores si no existe
      fs.unlink(imagePath, (unlinkError) => {
        if (unlinkError) {
          if (unlinkError.code === "ENOENT") {
            console.log("El archivo ya no existe, nada que eliminar.");
          } else {
            console.error(
              `Error al eliminar la imagen: ${unlinkError.message}`
            );
          }
        } else {
          console.log("Imagen inválida eliminada correctamente.");
        }
      });

      return res.status(400).json({ error: error.errors[0].message });
    }

    const userId = req.user.id;

    const newImage = await imageService.createImage(
      req.processedImagePath,
      userId,
      imageData
    );

    handleGenericSuccess(
      res,
      201,
      newImage,
      "Imagen subida y creada correctamente!!"
    );
  } catch (error) {
    // Manejo de errores generales
    let errorMessage;

    if (error.errors && error.errors.length > 0) {
      errorMessage = error.errors[0].message; // Capturar mensaje de error de Zod
    } else {
      errorMessage = `Error al subir y crear la imagen: ${error.message}`; // Otro error
    }

    handleGenericError(res, 500, errorMessage);
    next(error);
  }
}
