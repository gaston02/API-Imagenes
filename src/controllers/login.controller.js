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

    // Genera el token
    const token = await createToken({ id: user._id });

    // Configuración de la cookie para que funcione en producción
    res.cookie("token", token, {
      httpOnly: true,  // 🔒 Protege la cookie para que solo el servidor pueda accederla
      secure: true,    // 🔥 Necesario si el sitio usa HTTPS (activar solo en producción)
      sameSite: "None", // 🔥 Requerido para peticiones entre distintos dominios
    });

    // Devuelve el usuario sin incluir la contraseña
    const { password: _, ...userData } = user._doc;

    handleGenericSuccess(res, 200, { ...userData }, "Usuario logeado correctamente!!");
  } catch (error) {
    handleGenericError(res, 500, `Error al hacer el login: ${error.message}`);
    next(error);
  }
}


export async function logout(req, res) {
  try {
    res.cookie("token", "", {
      expires: new Date(0),
    });
    return res.sendStatus(204);
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    return res.status(500).send("Error al cerrar sesión");
  }
}
