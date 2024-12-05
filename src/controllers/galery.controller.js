import { createGallery } from "../services/gallery.service.js";
import { handleGenericError } from "../utils/error.util.js";
import { handleGenericSuccess } from "../utils/success.util.js";

export async function createGalleryController(req, res) {
  try {
    const { name, description, imageIds } = req.body;
    const userId = req.user.id; // Obtenido desde el middleware de autenticación

    const newGallery = await createGallery({ name, description, userId }, imageIds);

    return handleGenericSuccess(
      res,
      201,
      newGallery,
      "Galería creada exitosamente!"
    );
  } catch (error) {
    return handleGenericError(res, 400, `Error al crear galería: ${error.message}`);
  }
}
