import * as loginService from "../services/login.service.js";
import * as userService from "../services/user.service.js";
import { handleGenericError } from "../utils/error.util.js";
import { handleGenericSuccess } from "../utils/success.util.js";
import { createToken } from "../libs/jwt.js";

export async function loginController(req, res, next) {
  const { email, password } = req.body;
  try {
    const success = await loginService.login(email, password);
    if (!success) {
      return handleGenericError(res, 401, "Credenciales incorrectas");
    }

    const user = await userService.findUser(email);
    if (!user) {
      return handleGenericError(
        res,
        404,
        `Usuario con el correo ${email} no encontrado`
      );
    }

    // Espera el token
    const token = await createToken({ id: user._id });
    res.cookie("token", token, { httpOnly: true }); // Agrega opciones como httpOnly por seguridad

    // Incluye el token en la respuesta
    handleGenericSuccess(
      res,
      200,
      { ...user._doc, token }, // Incluye el token aquí
      "Usuario logeado correctamente!!"
    );
  } catch (error) {
    handleGenericError(res, 500, `Error al hacer el login: ${error.message}`);
    next(error);
  }
}

export async function logout(req, res) {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  return res.sendStatus(204);
}
