import * as userService from "../services/user.service.js";
import { handleGenericError } from "../utils/error.util.js";
import { handleGenericSuccess } from "../utils/success.util.js";
import { profileImage } from "../middlewares/uploadImage.middleware.js";
import { processImage } from "../middlewares/proccessImage.middleware.js";
import { createUserSchema, updateUserSchema } from "../schemas/user.schema.js";

export async function createUserController(req, res, next) {
  try {
    // Subir la imagen
    await new Promise((resolve, reject) => {
      profileImage(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Procesar la imagen
    await new Promise((resolve, reject) => {
      processImage(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Verificar que se haya procesado la imagen
    if (!req.processedImagePath) {
      return res.status(500).json({
        error: "Error al procesar la imagen",
      });
    }

    const userData = {
      nameUser: req.body.nameUser,
      email: req.body.email,
      password: req.body.password,
      profileImage: req.processedImagePath,
      userInfo: req.body.userInfo,
    };

    try {
      createUserSchema.parse(userData);
    } catch (error) {
      console.log("entro en catch parse");
      return res.status(400).json({ error: error.errors[0].message });
    }

    const newUser = await userService.createUser(userData);

    return handleGenericSuccess(
      res,
      201,
      newUser,
      "Usuario creado con éxito!!!"
    );
  } catch (error) {
    console.log("entro en catch general");
    return handleGenericError(
      res,
      400,
      `Error al crear usuario: ${error.message}`
    );
  }
}
