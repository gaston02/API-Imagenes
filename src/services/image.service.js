import fs from "fs";
import path from "path";
import Image from "../models/image.model.js";
import User from "../models/user.model.js";
import Gallery from "../models/gallery.model.js";
import { IMAGES_DIR } from "../config.js";

const imagesDir = IMAGES_DIR;

export async function createImage(outputPath, userId, imageData) {
  try {
    const galleries = [];
    // Validar las galerías si se proporcionan galleryIds
    if (imageData.galleryIds && Array.isArray(imageData.galleryIds)) {
      const validGalleries = await Gallery.find({
        _id: { $in: imageData.galleryIds },
        user: userId,
      });

      if (validGalleries.length !== imageData.galleryIds.length) {
        throw new Error(
          "Algunas galerías no existen o no pertenecen al usuario."
        );
      }

      // Agregar las galerías válidas al arreglo
      galleries.push(...validGalleries.map((gallery) => gallery._id));
    }

    const newImage = new Image({
      name: imageData.name,
      path: outputPath,
      public: imageData.public || true,
      user: userId,
      galleries,
    });

    const savedImage = await newImage.save();

    // Actualiza el usuario para incluir la nueva imagen en el arreglo de imágenes
    await User.findByIdAndUpdate(userId, { $push: { images: savedImage._id } });

    // Actualiza cada galería para incluir la imagen en su arreglo
    if (galleries.length > 0) {
      await Promise.all(
        galleries.map((galleryId) =>
          Gallery.findByIdAndUpdate(galleryId, {
            $push: { images: savedImage._id },
          })
        )
      );
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
      }
    });

    // Espera a que todas las eliminaciones se completen
    await Promise.all(deletePromises);
  } catch (error) {
    throw new Error(
      `Error al eliminar imágenes no comprimidas: ${error.message}`
    );
  }
}
