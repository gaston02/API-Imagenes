import Gallery from "../models/gallery.model.js";
import Image from "../models/image.model.js";
import User from "../models/user.model.js";

export async function createGallery(galleryData, imageIds = []) {
  const { userId, name, description, public: isPublic } = galleryData; // Extraer public

  let validImages = [];

  if (Array.isArray(imageIds) && imageIds.length > 0) {
    // Validar imágenes solo si se proporcionan
    validImages = await Image.find({
      _id: { $in: imageIds },
      user: userId,
    });

    if (validImages.length !== imageIds.length) {
      throw new Error(
        "Algunas imágenes no existen o no pertenecen al usuario."
      );
    }
  }

  // Crear la galería con o sin imágenes, ahora incluyendo el campo `public`
  const newGallery = await Gallery.create({
    name,
    description,
    public: isPublic, // Asegurar que el valor se almacene correctamente
    user: userId,
    images: validImages.map((image) => image._id), // Si no hay imágenes, será un array vacío
  });

  if (validImages.length > 0) {
    // Actualizar las imágenes con la referencia a la nueva galería
    await Promise.all(
      validImages.map((image) => {
        if (!Array.isArray(image.galleries)) {
          image.galleries = [];
        }
        if (!image.galleries.includes(newGallery._id)) {
          image.galleries.push(newGallery._id);
        }
        return image.save();
      })
    );
  }

  // Actualizar al usuario para incluir la nueva galería
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("Usuario no encontrado.");
  }

  if (!Array.isArray(user.galleries)) {
    user.galleries = [];
  }
  user.galleries.push(newGallery._id);
  await user.save();

  return newGallery;
}


export async function updateGallery(idGallery, userId, galleryData) {
  try {
    const existingGallery = await Gallery.findById(idGallery);
    if (!existingGallery) {
      throw new Error("Galería no encontrada.");
    }

    // Verificar que el usuario sea propietario de la galería
    if (existingGallery.user.toString() !== userId.toString()) {
      throw new Error("No tienes permisos para modificar esta galería.");
    }

    // Manejar las imágenes
    let images = existingGallery.images; // Mantener las imágenes actuales por defecto

    if (galleryData.imageIds) {
      if (
        Array.isArray(galleryData.imageIds) &&
        galleryData.imageIds.length > 0
      ) {
        // Validar las imágenes si se proporcionan nuevos IDs
        const validImages = await Image.find({
          _id: { $in: galleryData.imageIds },
          user: userId,
        });

        if (validImages.length !== galleryData.imageIds.length) {
          throw new Error(
            "Algunas imágenes no existen o no pertenecen al usuario."
          );
        }

        images = validImages.map((image) => image._id); // Actualizar con las imágenes válidas
      } else {
        // Si se envía un arreglo vacío, la galería quedará sin imágenes
        images = [];
      }
    }

    // Actualizar los campos de la galería
    existingGallery.name = galleryData.name || existingGallery.name;
    existingGallery.description =
      galleryData.description || existingGallery.description;
    existingGallery.public = galleryData.public ?? existingGallery.public;
    existingGallery.images = images;

    const updatedGallery = await existingGallery.save();

    // Actualizar las imágenes (remover la galería de las imágenes antiguas y añadirla a las nuevas)
    await Image.updateMany(
      { galleries: idGallery }, // Remover esta galería de las imágenes antiguas
      { $pull: { galleries: idGallery } }
    );

    if (images.length > 0) {
      await Promise.all(
        images.map((imageId) =>
          Image.findByIdAndUpdate(imageId, {
            $addToSet: { galleries: idGallery },
          })
        )
      );
    }

    return updatedGallery;
  } catch (error) {
    throw new Error(`Error al actualizar la galería: ${error.message}`);
  }
}

export async function deleteGallery(galleryId, userId) {
  try {
    const gallery = await Gallery.findById(galleryId);
    if (!gallery) {
      throw new Error("Galeria no encontrada.");
    }

    // Verificar que el usuario sea propietario de la galeria
    if (gallery.user.toString() !== userId.toString()) {
      throw new Error("No tienes permisos para eliminar esta galeria.");
    }

    // Eliminar imagenes asociadas
    if (gallery.images && gallery.images.length > 0) {
      await Image.updateMany(
        { _id: { $in: gallery.images } },
        { $pull: { galleries: galleryId } }
      );
    }

    // Eliminar asociación con el usuario
    await User.findByIdAndUpdate(userId, {
      $pull: { galleries: galleryId },
    });

    const deletedGallery = await Gallery.findByIdAndDelete(galleryId);
    return deletedGallery;
  } catch (error) {
    throw new Error(`Error al eliminar la galeria: ${error.message}`);
  }
}
