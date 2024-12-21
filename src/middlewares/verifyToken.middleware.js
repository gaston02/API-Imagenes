import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export function authMiddleware(req, res, next) {
  const token = req.cookies.token; // Asumiendo que el token está en las cookies
  if (!token) {
    return res.status(401).json({ message: "Acceso denegado. No hay token." });
  }

  jwt.verify(token, TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token no válido." });
    }
    req.user = user; // Asigna el usuario decodificado a req.user
    next();
  });
}

export function checkUserOwnership(req, res, next) {
  const idParams = req.params.id;
  const loggedInUser = req.user.id; // El id del usuario autenticado desde el token

  if (idParams !== loggedInUser) {
    return res
      .status(403)
      .json({ message: "No tienes permisos para modificar este usuario" });
  }

  next();
}
