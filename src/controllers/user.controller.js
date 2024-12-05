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
