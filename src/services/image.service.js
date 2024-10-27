import Image from "../models/image.model.js";

export async function createImage(outputPath, userId, imageData) {
  try {
    const newImage = new Image({
      name: imageData.name,
      path: outputPath,
      public: imageData.public || true,
      user: userId,
      gallery: imageData.galleryId || null,
    });

    return await newImage.save();
  } catch (error) {
    throw new Error(`Error al subir la imagen: ${error.message}`);
  }
}
