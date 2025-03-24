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

    // Configuración de la cookie (1 semana de duración)
    res.cookie("token", token, {
      httpOnly: true, // Bloquea acceso desde JS
      secure: true, // Solo HTTPS
      sameSite: "None", // Cross-origin
      domain: "imageshub-api.ddns.net", // Dominio del backend
      path: "/", // Válida en todas las rutas
      maxAge: 7 * 24 * 60 * 60 * 1000, // 604,800,000 ms = 1 semana
    });

    // Datos seguros del usuario
    const userData = {
      _id: user._id,
      name: user.nameUser,
      email: user.email,
      profileImage: user.profileImage,
      userInfo: user.userInfo,
      galleries: user.galleries,
      images: user.images,
    };

    handleGenericSuccess(res, 200, userData, "Login exitoso");
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
