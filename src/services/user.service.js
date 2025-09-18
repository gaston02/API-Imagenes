import bcrypt from "bcrypt";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import User from "../models/user.model.js";
import Gallery from "../models/gallery.model.js";
import { generateResetToken } from "../utils/tokenPassword.util.js";
import { EMAIL } from "../config.js";
import { resetPasswordTemplate } from "../utils/emailTemplate.util.js";
import { apiInstance } from "../libs/brevoClient.js";
import { IMAGES_DIR } from "../config.js";
import { toBoolean } from "../utils/boolean.util.js";

const imagesDir = IMAGES_DIR;

export async function createUser(userData) {
  try {
    const { nameUser, email, password, profileImage, userInfo } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("El correo ya está registrado.");
    }

    const existingUserByName = await User.findOne({ nameUser });
    if (existingUserByName) {
      throw new Error("El nombre de usuario ya está registrado.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (!userData.profileImage) {
      userData.profileImage = "default";
    }

    const newUser = new User({
      nameUser: userData.nameUser,
      email: userData.email,
      password: hashedPassword,
      profileImage: userData.profileImage,
      userInfo: userData.userInfo,
      galleries: [], // Inicialmente vacío
      images: [], // Inicialmente vacío
    });

    const savedUser = await newUser.save();
    return savedUser;
  } catch (error) {
    throw new Error(`Error al crear el usuario: ${error.message}`);
  }
}

export async function deleteDefaultProfileImage(idUser) {
  const updatedUser = await User.findByIdAndUpdate(
    idUser,
    { $unset: { profileImage: 1 } }, // Eliminar el campo profileImage
    { new: true } // Retornar el documento actualizado
  );

  if (!updatedUser) {
    throw new Error("Usuario no encontrado o no actualizado");
  }

  return updatedUser;
}

export async function getRandomUser() {
  try {
    // Obtener un usuario aleatorio
    const randomUserArray = await User.aggregate([
      { $sample: { size: 1 } },
      {
        $project: {
          _id: 1,
          userName: 1,
          images: 1,
          galleries: 1,
          public: 1,
        },
      },
    ]);

    if (!randomUserArray || randomUserArray.length === 0) {
      throw new Error("No se encontró ningún usuario");
    }

    const randomUserId = randomUserArray[0]._id;

    const randomUser = await User.findById(randomUserId)
      .select("nameUser images galleries")
      .populate({
        path: "images",
        select: "path createdAt public",
        options: { limit: 6 },
        match: { public: true },
      });

    if (!randomUser) {
      throw new Error(
        "No se encontraron detalles para el usuario seleccionado"
      );
    }

    // Obtener manualmente la primera galería pública del array
    const publicGallery = await Gallery.findOne({
      _id: { $in: randomUser.galleries },
      public: true,
    })
      .select("name createdAt images public")
      .populate({
        path: "images",
        select: "path",
        match: { public: true },
      });

    // Ensamblar el objeto final manualmente
    const userWithPublicGallery = {
      ...randomUser.toObject(),
      galleries: publicGallery ? [publicGallery] : [],
    };

    return userWithPublicGallery;
  } catch (error) {
    throw new Error(`Error al encontrar un usuario: ${error.message}`);
  }
}

export async function findUsers(pageNumber = 1, pageSize = 6) {
  try {
    const users = await User.find({ status: true })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);
    return users;
  } catch (error) {
    throw new Error(`Error al obtener los usuarios: ${error.message}`);
  }
}

export async function findUser(emailUser) {
  try {
    const user = await User.findOne({ email: emailUser, status: true });
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    return user;
  } catch (error) {
    throw new Error(`Error al obtener el usuario: ${error.message}`);
  }
}

export async function getUser(nameUser) {
  try {
    const user = await User.findOne({ nameUser: nameUser, status: true })
      .populate({
        path: "images",
      })
      .populate({
        path: "galleries",
      });

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    // Crear un nuevo objeto sin la contraseña
    const { password, ...userWithoutPassword } = user.toObject();

    return userWithoutPassword;
  } catch (error) {
    throw new Error(`Error al obtener el usuario: ${error.message}`);
  }
}

export async function publicGetUser(nameUser) {
  try {
    const user = await User.findOne({ nameUser: nameUser, status: true })
      .populate({
        path: "images",
        match: { public: true },
      })
      .populate({
        path: "galleries",
        match: { public: true },
      });

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    // Crear un nuevo objeto sin la contraseña
    const { password, ...userWithoutPassword } = user.toObject();

    return userWithoutPassword;
  } catch (error) {
    throw new Error(`Error al obtener el usuario: ${error.message}`);
  }
}

export async function updateUser(id, userData, clearImage = false) {
  try {
    const objectId = new mongoose.Types.ObjectId(id);

    const existingUser = await User.findOne({ _id: objectId, status: true });
    if (!existingUser) throw new Error("Usuario no encontrado");

    // 1) Normaliza clearImage
    const shouldRemove = toBoolean(clearImage);

    // 2) Declara el contenedor de la actualización (ANTES de usarlo)
    const updateOps = { $set: {}, $unset: {} };

    // 3) Whitelist de campos editables (evita que te lleguen cosas raras)
    const allowed = ["nameUser", "email", "userInfo"];
    for (const k of allowed) {
      if (userData[k] !== undefined) updateOps.$set[k] = userData[k];
    }

    // 4) Si llegó una NUEVA imagen en userData.profileImage => priorízala
    if (userData.profileImage) {
      // si quieres, aquí puedes llamar a deleteUserProfileImage para borrar la anterior
      updateOps.$set.profileImage = userData.profileImage;
    }

    // 5) Si se debe eliminar imagen y NO vino una nueva en este request => UNSET
    if (shouldRemove && !userData.profileImage) {
      // si además quieres borrar el archivo físico:
      // await deleteUserProfileImage(objectId, true);
      updateOps.$unset.profileImage = ""; // elimina el campo en la DB
    }

    // 6) Limpia operadores vacíos para no enviar objetos vacíos a Mongo
    if (Object.keys(updateOps.$set).length === 0) delete updateOps.$set;
    if (Object.keys(updateOps.$unset).length === 0) delete updateOps.$unset;

    // 7) Ejecuta update
    const updatedUser = await User.findOneAndUpdate(
      { _id: objectId, status: true },
      updateOps,
      { new: true }
    ).select("-password");

    if (!updatedUser) throw new Error("No se pudo actualizar el usuario");

    return updatedUser;
  } catch (error) {
    throw new Error(`Error al modificar el usuario: ${error.message}`);
  }
}

export async function removeProfileImage(idUser, clearImage) {
  try {
    const shouldRemove = toBoolean(clearImage);

    const existingUser = await User.findOne({
      _id: idUser,
      status: true,
    }).select("-password");

    if (!existingUser) throw new Error("Usuario no encontrado.");

    if (shouldRemove) {
      await deleteUserProfileImage(idUser, true);
      existingUser.profileImage = null; // opcional si también usas $unset luego
      await existingUser.save();
    }

    return existingUser;
  } catch (error) {
    throw new Error(`Error al remover la imagen de perfil: ${error.message}`);
  }
}
export async function deleteUserProfileImage(userId, clearImage) {
  try {
    if (!clearImage) {
      return;
    }

    // Buscar al usuario y obtener la ruta de la imagen
    const user = await User.findById(userId).select("profileImage");
    if (!user) {
      throw new Error("Usuario no encontrado.");
    }

    const relativePath = user.profileImage;

    if (!relativePath) {
      console.warn("El usuario no tiene una imagen de perfil para eliminar.");
      return;
    }

    // Construir la ruta absoluta de la imagen
    const absolutePath = path.join(imagesDir, relativePath);

    // Verificar si el archivo existe antes de eliminarlo
    if (fs.existsSync(absolutePath)) {
      await fs.promises.unlink(absolutePath); // Eliminar el archivo físicamente
      console.log(`Imagen de perfil eliminada: ${absolutePath}`);
    } else {
      console.warn(`El archivo no existe: ${absolutePath}`);
    }
  } catch (error) {
    throw new Error(`Error al eliminar la imagen de perfil: ${error.message}`);
  }
}

//Por lo general no se hacen eliminaciones fisicas, pero tendre por si las moscas este metodo, ya que imagen y galeria si se eliminan fisicamente, entonces podria llegar un caso que se necesiten administradores (por ahora no los hay) y si se da el caso, si se eliminaria un usuario fisicamente
export async function deleteUser(idUser) {
  try {
    const existingUser = await this.getuser(idUser);

    if (!existingUser) {
      throw new Error("Usuario no encontrado");
    }

    // Si el usuario existe y su status es true, permite eliminarlo físicamente
    if (!existingUser.status) {
      throw new Error("El usuario no está activo, no se puede eliminar");
    }

    // Eliminar físicamente el usuario por su ID
    const deletedUser = await User.findByIdAndDelete(idUser);

    if (!deletedUser) {
      throw new Error("No se pudo eliminar el usuario");
    }

    return deletedUser;
  } catch (error) {
    throw new Error(`Error al eliminar el usuario: ${error.message}`);
  }
}

//Esta es la eliminacion logica y la que estaremos implementando por ahora, ya que no tenemos administradores
export async function deleteUserLogic(emailUser) {
  try {
    const existingUser = await this.findUser(emailUser);

    if (!existingUser) {
      throw new Error("Usuario no encontrado");
    }
    const deleteUser = await User.findOneAndUpdate(
      { email: emailUser, status: true },
      { $set: { status: false } },
      { new: true }
    );
    if (!deleteUser) {
      throw new Error("No se pudo eliminar el usuario");
    }
    return deleteUser;
  } catch (error) {
    throw new Error(`Error al eliminar el usuario: ${error.message}`);
  }
}

export async function findUsersDeleted(pageNumber = 1, pageSize = 8) {
  try {
    const deletedUsers = await User.find({ status: false })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageNumber);
    return deletedUsers;
  } catch (error) {
    throw new Error(`Error al obtner usuarios eliminados: ${error.message}`);
  }
}

export async function returnUserDelete(emailUser) {
  try {
    const userDelete = await User.findOne({ email: emailUser, status: false });
    if (!userDelete) {
      throw new Error("Usuario no encontrado");
    }
    if (userDelete.status === true) {
      throw new Error("El usuario ya está disponible");
    }
    userDelete.status = true;
    await userDelete.save();
    return userDelete;
  } catch (error) {
    throw new Error(`Error al retornar al usuario eliminado: ${error.message}`);
  }
}

export async function requestPasswordReset(email) {
  try {
    const user = await User.findOne({ email: email, status: true });
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    const { token, tokenHash, expires } = await generateResetToken();
    user.resetTokenPassword = tokenHash;
    user.resetTokenExpires = new Date(expires);
    await user.save();
    return {
      email: user.email,
      token,
    };
  } catch (error) {
    throw new Error(`Error al generar token de reseteo: ${error.message}`);
  }
}

export async function sendResetPasswordEmail(to, token) {
  const senderEmail = EMAIL;
  const senderName = "picvaul";
  const subject = "Restablece tu contraseña";

  const htmlContent = resetPasswordTemplate({ email: to, token });

  const sendSmtpEmail = {
    to: [{ email: to }],
    sender: { name: senderName, email: senderEmail },
    subject,
    htmlContent,
  };

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`Correo de recuperación enviado a ${to}`);
  } catch (error) {
    console.error(
      "Error al enviar correo de recuperación:",
      error.response?.body || error.message
    );
    throw new Error("No se pudo enviar el correo de recuperación.");
  }
}

export async function validateResetToken(email, token) {
  try {
    const user = await User.findOne({ email: email, status: true });
    if (
      !user ||
      !user.resetTokenPassword ||
      !user.resetTokenExpires ||
      Date.now() > user.resetTokenExpires.getTime()
    ) {
      return false;
    }

    const isMatch = await bcrypt.compare(token, user.resetTokenPassword);
    return isMatch;
  } catch (error) {
    console.error("Error validando token de reseteo:", error);
    throw new Error("Ocurrió un problema al validar el token de reseteo.");
  }
}

export async function resetPassword(email, token, newPassword) {
  try {
    // 1. Validar el token
    const isValid = await validateResetToken(email, token);
    if (!isValid) {
      const err = new Error("Token inválido o expirado");
      err.code = "INVALID_TOKEN";
      throw err;
    }

    // 2. Buscar usuario
    const user = await User.findOne({ email: email, status: true });
    if (!user) {
      const err = new Error("Usuario no encontrado");
      err.code = "USER_NOT_FOUND";
      throw err;
    }

    // 3. Hashear y actualizar contraseña
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;

    // 4. Limpiar campos de reseteo
    user.resetTokenPassword = null;
    user.resetTokenExpires = null;

    await user.save();
    return true;
  } catch (err) {
    // Errores esperados (códigos personalizados) se propagan para controlarlos en el controlador
    if (err.code === "INVALID_TOKEN" || err.code === "USER_NOT_FOUND") {
      throw err;
    }
    // Cualquier otro error es interno
    console.error("Error interno al restablecer contraseña:", err);
    throw new Error("Ocurrió un error interno al restablecer la contraseña.");
  }
}

export async function forgotPassword(email) {
  try {
    const { email: userEmail, token } = await requestPasswordReset(email);
    await sendResetPasswordEmail(userEmail, token);
  } catch (err) {
    console.error(
      "[forgotPassword] Error en la orquestación de olvido de contraseña:",
      err
    );
    // Diferenciar errores esperados
    if (err.message.includes("Usuario no encontrado")) {
      throw new Error("Usuario no encontrado para olvido de contraseña.");
    }
    if (err.message.includes("Error al enviar el correo de recuperación")) {
      throw new Error("Error al enviar el correo de recuperación.");
    }
    // Errores inesperados
    throw new Error(
      "Error interno al procesar la solicitud de olvido de contraseña."
    );
  }
}

export async function resetPasswordFlow(email, token, newPassword) {
  try {
    await resetPassword(email, token, newPassword);
  } catch (err) {
    console.error(
      "[resetPasswordFlow] Error en la orquestación de cambio de contraseña:",
      err
    );
    // Errores de validación
    if (err.code === "INVALID_TOKEN") {
      throw new Error("Token inválido o expirado.");
    }
    if (err.code === "USER_NOT_FOUND") {
      throw new Error("Usuario no encontrado para cambio de contraseña.");
    }
    // Errores inesperados
    throw new Error("Error interno al procesar el cambio de contraseña.");
  }
}
