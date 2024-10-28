import { handleGenericError } from "../utils/error.util.js";
import { handleGenericSuccess } from "../utils/success.util.js";
import { uploadImage } from "../middlewares/uploadImage.middleware.js";
import { processImage } from "../middlewares/proccessImage.middleware.js";
import * as imageService from "../services/image.service.js";

export async function createImageController(req, res, next) {
  try {
    await new Promise((resolve, reject) => {
      uploadImage(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    await new Promise((resolve, reject) => {
      processImage(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    if (!req.processedImagePath) {
      return res.status(500).json({
        error: "Error al procesar la imagen",
      });
    }

    const userId = req.user.id;
    const imageData = {
      name: req.body.name,
      public: req.body.public,
      galleryId: req.body.galleryId,
    };

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
    handleGenericError(
      res,
      500,
      `Error al subir y crear la imagen ${error.message}`
    );
    next(error);
  }
}
