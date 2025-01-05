import * as userService from "../services/user.service.js";
import { handleGenericError } from "../utils/error.util.js";
import { handleGenericSuccess } from "../utils/success.util.js";

export async function createUserController(req, res, next) {
  try {
    const userData = {
      nameUser: req.body.nameUser,
      email: req.body.email,
      password: req.body.password,
      profileImage: req.processedImagePath,
      userInfo: req.body.userInfo,
    };

    const newUser = await userService.createUser(userData);

    // Si el campo profileImage es "default", eliminarlo
    let realUser = newUser;
    if (newUser.profileImage === "default") {
      realUser = await userService.deleteDefaultProfileImage(newUser._id);
    }

    return handleGenericSuccess(
      res,
      201,
      realUser,
      "Usuario creado con éxito!"
    );
  } catch (error) {
    return handleGenericError(
      res,
      400,
      `Error al crear usuario: ${error.message}`
    );
  }
}

export async function getRandomUserController(req, res, next) {
  try {
    const user = await userService.getRandomUser();
    if (!user) {
      handleGenericError(res, 404, `No se encontró ningún usuario`);
    }

    handleGenericSuccess(res, 200, user, "Usuario random obtenido con exito!!");
  } catch (error) {
    if (error.message.includes("No se encontró ningún usuario")) {
      handleGenericError(res, 404, `No se encontró ningún usuario`);
    } else {
      handleGenericError(
        res,
        400,
        `Error al obtener un usuario random: ${error.message}`
      );
    }
    next(error);
  }
}

export async function updateUserController(req, res, next) {
  const id = req.params.id;
  const userData = req.body;

  // Asegúrate de agregar processedImagePath si existe
  if (req.processedImagePath) {
    userData.profileImage = req.processedImagePath; // Asignar la ruta procesada de la imagen
  }

  try {
    const updateUser = await userService.updateUser(id, userData);
    handleGenericSuccess(
      res,
      200,
      updateUser,
      "Usuario actualizado con exito!!"
    );
  } catch (error) {
    if (error.message.includes("Usuario no encontrados")) {
      handleGenericError(res, 404, `Usuario no encontrado`);
    } else {
      handleGenericError(
        res,
        400,
        `Error al actualizar el usuario: ${error.message}`
      );
    }
    next(error);
  }
}
