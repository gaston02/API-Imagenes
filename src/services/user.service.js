import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import mongoose from "mongoose";

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
      throw new Error("No se encontraron detalles para el usuario seleccionado");
    }

    // Obtener solo la primera galería pública (si existe)
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

    // Adjuntar la galería pública al usuario manualmente
    const userWithGallery = {
      ...randomUser.toObject(),
      galleries: publicGallery ? [publicGallery] : [],
    };

    return userWithGallery;
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

export async function updateUser(id, userData) {
  try {
    // Convertir id a ObjectId
    const objectId = new mongoose.Types.ObjectId(id);

    const existingUser = await User.findOne({ _id: objectId });
    if (!existingUser) {
      throw new Error("Usuario no encontrado");
    }

    // Si userData.password existe, encriptarlo antes de actualizar
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: objectId, status: true },
      { $set: userData },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error("No se pudo actualizar el usuario");
    }

    return updatedUser;
  } catch (error) {
    throw new Error(`Error al modificar el usuario: ${error.message}`);
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
