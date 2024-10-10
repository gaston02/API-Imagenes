import * as userService from "../services/user.service.js";
import { handleGenericError } from "../utils/error.util.js";
import { handleGenericSuccess } from "../utils/success.util.js";

export async function createUserController(req, res, next) {
  try {
    const { nameUser, email, password, profileImage, userInfo } = req.body;
    const userData = { nameUser, email, password, profileImage, userInfo };
    const newUser = await userService.createUser(userData);
    return handleGenericSuccess(
      res,
      201,
      newUser,
      "Usuario creado con éxito!!!"
    );
  } catch (error) {
    return handleGenericError(
      res,
      400,
      `Error al crear usuario: ${error.message}`
    );
  }
}
