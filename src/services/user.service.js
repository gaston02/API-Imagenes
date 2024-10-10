import bcrypt from "bcrypt";
import User from "../models/user.model.js";

export async function createUser(userData) {
  try {
    const { nameUser, email, password, profileImage, userInfo } = userData;

    // Verificar si el usuario ya existe por el email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("El correo ya está registrado.");
    }

    // Verificar si el nameUser ya existe
    const existingUserByName = await User.findOne({ nameUser });
    if (existingUserByName) {
      throw new Error("El nombre de usuario ya está registrado.");
    }

    // Hashear la contraseña antes de guardar
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario
    const newUser = new User({
      nameUser,
      email,
      password: hashedPassword,
      profileImage,
      userInfo,
      galleries: [], // Inicialmente vacío
      images: [], // Inicialmente vacío
    });

    // Guardar el usuario en la base de datos
    const savedUser = await newUser.save();
    return savedUser;
  } catch (error) {
    throw new Error(`Error al crear el usuario: ${error.message}`);
  }
}

export async function getRandomUser() {
  try {
    //obtener un arreglo de usuarios aleatorios (solo encontraremos 1, pero de todas formas se maneja como arreglo)
    const randomUser = await User.aggregate([{ $sample: { size: 1 } }]);

    if (!randomUser || randomUser.length === 0) {
      throw new Error("No se encontró ningún usuario");
    }

    // Retornar el usuario aleatorio (como es un array, obtenemos el primer elemento)
    return randomUser[0];
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

export async function getUser(idUser) {
  try {
    const user = await User.findOne({ _id: idUser, status: true });
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    return user;
  } catch (error) {
    throw new Error(`Error al obtener el usuario: ${error.message}`);
  }
}

export async function updateUser(emailUser, userData) {
  try {
    const existingUser = await this.findUser(emailUser);
    if (!existingUser) {
      throw new Error("Usuario no encontrado");
    }
    const updateUser = await User.findOneAndUpdate(
      { email: emailUser, status: true },
      { $set: userData },
      { new: true }
    );
    if (!updateUser) {
      throw new Error("No se pudo actualizar el usuario");
    }
    return updateUser;
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
