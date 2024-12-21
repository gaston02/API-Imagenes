import Gallery from "../models/gallery.model.js";
import Image from "../models/image.model.js";
import User from "../models/user.model.js";

export async function createGallery(galleryData, imageIds) {
  const { userId, name, description } = galleryData;

  // Validar que imageIds sea un array válido
  if (!Array.isArray(imageIds) || imageIds.length === 0) {
    throw new Error("Debe proporcionar un array válido de IDs de imágenes.");
  }

  // Validar imágenes
  const images = await Image.find({
    _id: { $in: imageIds },
    user: userId,
  });

  if (!images || images.length === 0) {
    throw new Error("No se encontraron imágenes válidas para el usuario.");
  }

  if (images.length !== imageIds.length) {
    throw new Error("Algunas imágenes no existen o no pertenecen al usuario.");
  }

  // Crear galería y asociar las imágenes
  const newGallery = await Gallery.create({
    name,
    description,
    user: userId,
    images: images.map((image) => image._id), // Aquí estamos pasando los _id de las imágenes
  });

  // Actualizar las imágenes para incluir el ID de la nueva galería en su arreglo `galleries`
  await Promise.all(
    images.map((image) => {
      if (!Array.isArray(image.galleries)) {
        image.galleries = [];
      }
      if (!image.galleries.includes(newGallery._id)) {
        image.galleries.push(newGallery._id);
      }
      return image.save();
    })
  );

  // Actualizar al usuario para incluir la nueva galería
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("Usuario no encontrado.");
  }

  // Suponiendo que el usuario tiene un campo `galleries` que es un array
  if (!Array.isArray(user.galleries)) {
    user.galleries = [];
  }
  user.galleries.push(newGallery._id);

  await user.save();

  return newGallery;
}
