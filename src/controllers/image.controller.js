import * as imageService from "../services/image.service.js";
import { handleGenericError } from "../utils/error.util.js";
import { handleGenericSuccess } from "../utils/success.util.js";

export async function createImageController(req, res, next) {
  try {
    const userId = req.user.id;
    // Asegurarse de que galleryId sea un arreglo, incluso si es único
    const galleryIds = Array.isArray(req.body.galleryId)
      ? req.body.galleryId
      : req.body.galleryId
      ? [req.body.galleryId] // Si solo es un ID, lo convertimos en un arreglo
      : [];
    const imageData = {
      name: req.body.name,
      public: req.body.public,
      galleryIds, // Pasamos un arreglo de galleryIds
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

export async function updateImageController(req, res, next) {
  try {
    const imageId = req.params.id;
    const userId = req.user.id;
    const imageData = req.body;

    const updatedImage = await imageService.updateImage(
      imageId,
      userId,
      imageData
    );

    handleGenericSuccess(
      res,
      200,
      updatedImage,
      "Imagen actualizada correctamente!"
    );
  } catch (error) {
    handleGenericError(
      res,
      400,
      `Error al actualizar la imagen: ${error.message}`
    );
    next(error);
  }
}

export async function deleteImageController(req, res, next) {
  try {
    const imageId = req.params.id;
    const userId = req.user.id;

    const deletedImage = await imageService.deleteImage(imageId, userId);

    handleGenericSuccess(
      res,
      204,
      deletedImage,
      "Imagen eliminada correctamente!"
    );
  } catch (error) {
    handleGenericError(
      res,
      400,
      `Error al eliminar la imagen: ${error.message}`
    );
    next(error);
  }
}
