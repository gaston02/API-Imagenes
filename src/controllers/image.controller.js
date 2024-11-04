import fs from "fs";
import path from "path";
import { handleGenericError } from "../utils/error.util.js";
import { handleGenericSuccess } from "../utils/success.util.js";
import { uploadImage } from "../middlewares/uploadImage.middleware.js";
import { processImage } from "../middlewares/proccessImage.middleware.js";
import { createImageSchema } from "../schemas/image.schema.js";
import * as imageService from "../services/image.service.js";

const UPLOADS_DIR = path.resolve('C:/Users/gasto/OneDrive/uploads'); 

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

    // Preparar los datos de la imagen
    const imageData = {
      name: req.body.name,
      public: req.body.public,
      galleryId: req.body.galleryId,
      path: req.processedImagePath, // Ahora podemos incluir el path
    };

    // Validar los datos usando el esquema
    try {
      createImageSchema.parse(imageData); // Esto lanzará un error si la validación falla
    } catch (error) {
      // Verificar si el archivo existe antes de intentar eliminarlo
      const imagePath = path.join(UPLOADS_DIR, req.processedImagePath); // Ruta completa

      console.log("Ruta del archivo a eliminar:", imagePath);

      if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath, (unlinkError) => {
          if (unlinkError) {
            console.error(`Error al eliminar la imagen: ${unlinkError.message}`);
          }
        });
      } else {
        console.error("El archivo no existe:", imagePath);
      }

      return res.status(400).json({ error: error.errors[0].message });
    }

    const userId = req.user.id;

    // Crear la imagen usando el servicio de imagen
    const newImage = await imageService.createImage(
      path.join(UPLOADS_DIR, req.processedImagePath), // Usa la ruta completa aquí también
      userId,
      imageData
    );

    // Responder con éxito
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

