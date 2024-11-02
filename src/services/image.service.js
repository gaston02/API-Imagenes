import Image from "../models/image.model.js";
import User from "../models/user.model.js";

export async function createImage(outputPath, userId, imageData) {
  try {
    const newImage = new Image({
      name: imageData.name,
      path: outputPath,
      public: imageData.public || true,
      user: userId,
      gallery: imageData.galleryId || null,
    });

    const savedImage = await newImage.save();

    // Actualiza el usuario para incluir la nueva imagen en el arreglo de imágenes
    await User.findByIdAndUpdate(userId, { $push: { images: savedImage._id } });

    return savedImage;
  } catch (error) {
    throw new Error(`Error al subir la imagen: ${error.message}`);
  }
}
