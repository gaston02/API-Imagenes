import path from "path";
import fs from "fs";

export const validateSchema = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    let errorMessage;
    if (error.errors && error.errors.length > 0 && error.errors[0].message) {
      errorMessage = error.errors[0].message;
    } else {
      errorMessage = error.message;
    }
    res.status(400).json({ error: errorMessage });
  }
};

export const validateSchemaWithFileAndCleanup =
  (schema, fileKey, uploadDir) => (req, res, next) => {
    try {
      const data = {
        name: req.body.name,
        public: req.body.public,
        galleryId: req.body.galleryId,
        path: req[fileKey], // Archivo procesado
      };

      schema.parse(data);

      next();
    } catch (error) {
      // Limpiar el archivo en caso de error
      const filePath = path.join(uploadDir, req[fileKey]);
      fs.unlink(filePath, (unlinkError) => {
        if (unlinkError) {
          if (unlinkError.code === "ENOENT") {
            console.log("El archivo ya no existe, nada que eliminar.");
          } else {
            console.error(
              `Error al eliminar la imagen: ${unlinkError.message}`
            );
          }
        } else {
          console.log("Imagen inválida eliminada correctamente.");
        }
      });

      // Devolver el error al cliente
      const errorMessage = error.errors?.[0]?.message || "Error de validación";
      return res.status(400).json({ error: errorMessage });
    }
  };

export const validateUserSchemaWithFileAndCleanup =
  (schema, fileKey, uploadDir) => (req, res, next) => {
    try {
      const data = {
        nameUser: req.body.nameUser,
        email: req.body.email,
        password: req.body.password,
        profileImage: req[fileKey],
        userInfo: req.body.userInfo,
      };

      schema.parse(data);

      next();
    } catch (error) {
      // Limpiar el archivo en caso de error
      if (req[fileKey]) {
        const filePath = path.join(uploadDir, req[fileKey]);
        fs.unlink(filePath, (unlinkError) => {
          if (unlinkError) {
            if (unlinkError.code === "ENOENT") {
              console.log("El archivo ya no existe, nada que eliminar.");
            } else {
              console.error(
                `Error al eliminar la imagen: ${unlinkError.message}`
              );
            }
          } else {
            console.log("Imagen inválida eliminada correctamente.");
          }
        });
      }

      // Devolver el error al cliente
      const errorMessage = error.errors?.[0]?.message || "Error de validación";
      return res.status(400).json({ error: errorMessage });
    }
  };

export const validateUserSchemaWithFileAndCleanupForUpdate =
  (schema, fileKey, uploadDir) => (req, res, next) => {
    try {
      const data = {
        nameUser: req.body.nameUser || undefined,
        email: req.body.email || undefined,
        password: req.body.password || undefined,
        profileImage: req.processedImagePath || undefined,
        userInfo: req.body.userInfo || undefined,
      };

      schema.parse(data);

      next();
    } catch (error) {
      // Limpiar el archivo en caso de error (si se subió un archivo y ocurrió un error de validación)
      if (req[fileKey]) {
        const filePath = path.join(uploadDir, req[fileKey]);
        fs.unlink(filePath, (unlinkError) => {
          if (unlinkError) {
            if (unlinkError.code === "ENOENT") {
              console.log("El archivo ya no existe, nada que eliminar.");
            } else {
              console.error(
                `Error al eliminar la imagen: ${unlinkError.message}`
              );
            }
          } else {
            console.log("Imagen inválida eliminada correctamente.");
          }
        });
      }

      // Devolver el error al cliente
      const errorMessage = error.errors?.[0]?.message || "Error de validación";
      return res.status(400).json({ error: errorMessage });
    }
  };
