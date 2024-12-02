import * as imageService from "../services/image.service.js";
import { handleGenericError } from "../utils/error.util.js";
import { handleGenericSuccess } from "../utils/success.util.js";

export async function createImageController(req, res, next) {
  try {
    const userId = req.user.id;
    const imageData = {
      name: req.body.name,
      public: req.body.public,
      galleryId: req.body.galleryId,
      path: req.processedImagePath,
    };

    // Crear la imagen
    const newImage = await imageService.createImage(
      req.processedImagePath,
      userId,
      imageData
    );

    handleGenericSuccess(
      res,
      201,
      newImage,
      "Imagen subida y creada correctamente!"
    );
  } catch (error) {
    handleGenericError(res, 500, `Error al crear la imagen: ${error.message}`);
    next(error);
  }
}
