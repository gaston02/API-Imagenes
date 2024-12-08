import fs from "fs";
import path from "path";
import Image from "../models/image.model.js";
import User from "../models/user.model.js";
import Gallery from "../models/gallery.model.js";
import { IMAGES_DIR } from "../config.js";

const imagesDir = IMAGES_DIR;

export async function createImage(outputPath, userId, imageData) {
  try {
    let gallery = null;
    // Validar la galería si se proporciona un galleryId
    if (imageData.galleryId) {
      gallery = await Gallery.findOne({
        _id: imageData.galleryId,
        user: userId,
      });
      if (!gallery) {
        throw new Error("La galería no existe o no pertenece al usuario.");
      }
    }

    const newImage = new Image({
      name: imageData.name,
      path: outputPath,
      public: imageData.public || true,
      user: userId,
      gallery: gallery ? gallery._id : null, // Asociar la galería si existe
    });

    const savedImage = await newImage.save();

    // Actualiza el usuario para incluir la nueva imagen en el arreglo de imágenes
    await User.findByIdAndUpdate(userId, { $push: { images: savedImage._id } });

    // Si existe una galería, actualizarla para incluir la nueva imagen
    if (gallery) {
      await Gallery.findByIdAndUpdate(gallery._id, {
        $push: { images: savedImage._id },
      });
    }

    return savedImage;
  } catch (error) {
    throw new Error(`Error al subir la imagen: ${error.message}`);
  }
}

export async function deleteUncompressedImages() {
  try {
    // Lee todos los archivos en la carpeta de imágenes
    const files = await fs.promises.readdir(imagesDir);

    // Itera sobre los archivos y elimina los que no contienen 'compressed' en su nombre
    const deletePromises = files.map(async (file) => {
      if (!file.startsWith("compressed")) {
        const filePath = path.join(imagesDir, file);
        await fs.promises.unlink(filePath); // Elimina el archivo
        console.log(`Eliminada: ${filePath}`);
      }
    });

    // Espera a que todas las eliminaciones se completen
    await Promise.all(deletePromises);
    console.log("Eliminación de imágenes no comprimidas completada.");
  } catch (error) {
    throw new Error(
      `Error al eliminar imágenes no comprimidas: ${error.message}`
    );
  }
}
