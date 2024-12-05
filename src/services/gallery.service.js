import Gallery from "../models/gallery.model.js";
import Image from "../models/image.model.js";

export async function createGallery(galleryData, imageIds) {
  const { userId, name, description } = galleryData;

  // Validar que imageIds sea un array válido
  if (!Array.isArray(imageIds) || imageIds.length === 0) {
    console.log("IDs de imágenes recibidos:", imageIds);
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

  // Actualizar las imágenes para que apunten a la nueva galería
  await Promise.all(
    images.map((image) => {
      image.gallery = newGallery._id; // Actualizamos cada imagen con el ID de la nueva galería
      return image.save();
    })
  );

  return newGallery;
}
