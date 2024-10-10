import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email es requerido",
    })
    .refine((data) => {
      if (data.trim() === "") {
        throw new Error("El email no puede estar vacio");
      }
      return true;
    })
    .refine((data) => {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data)) {
        throw new Error("El email no es valido");
      }
      return true;
    }),
  password: z
    .string({
      required_error: "Password es requerida",
    })
    .min(6, {
      message: "La contraseña debe tener al menos 6 caracteres",
    })
    .refine((data) => data.trim() !== "", {
      message: "La contraseña no puede estar vacía",
    })
    .refine((data) => /[A-Z]/.test(data), {
      message: "La contraseña debe contener al menos una letra mayúscula",
    }),
});
