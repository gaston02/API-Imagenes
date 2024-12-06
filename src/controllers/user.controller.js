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

export async function updateUserController(req, res, next) {
  const email = req.params.email;
  const userData = req.body;

  try {
    const updateUser = await userService.updateUser(email, userData);
    handleGenericSuccess(
      res,
      200,
      updateUser,
      "Usuario actualizado con exito!!"
    );
  } catch (error) {
    if (error.message.includes("Usuario no encontrados")) {
      handleGenericError(res, 404, `Administrador no encontrado`);
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
