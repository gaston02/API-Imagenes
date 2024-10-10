import bcrypt from "bcrypt";
import UserService from "./user.service.js";

export async function login(email, password) {
  try {
    const userExists = await UserService.findUser(email);
    if (!userExists) {
      return false;
    }
    const isMatch = await bcrypt.compare(password, userExists.password);
    if (!isMatch) {
      return false;
    }
    return true;
  } catch (error) {
    throw new Error(`Error al realizar el login: ${error.message}`);
  }
}
