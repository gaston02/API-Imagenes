import { z } from "zod";

export const createUserSchema = z.object({
  name: z
    .string({ required_error: "Nombre es requerido" })
    .min(3, {
      message: "El nombre debe tener al menos 3 caracteres",
    })
    .refine((data) => data.trim() !== "", {
      message: "El nombre no puede estar vacío",
    }),
  email: z
    .string({ required_error: "Email es requerido" })
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
    .string({ required_error: "Password es requerida" })
    .min(6, {
      message: "La contraseña debe tener al menos 6 caracteres",
    })
    .refine((data) => data.trim() !== "", {
      message: "La contraseña no puede estar vacía",
    })
    .refine((data) => /[A-Z]/.test(data), {
      message: "La contraseña debe contener al menos una letra mayúscula",
    }),
  profileImage: z
    .string()
    .optional()
    .refine(
      (data) => {
        if (data !== undefined && data.trim() === "") {
          return false;
        }
        return true;
      },
      {
        message: "La imagen no puede estar vacía",
      }
    ),
  userInfo: z
    .string()
    .optional()
    .refine(
      (data) => {
        if (data !== undefined && data.trim() === "") {
          return false;
        }
        return true;
      },
      {
        message: "La informacion del usuario no puede estar vacia",
      }
    ),
  status: z.boolean().default(true),
});

export const updateUserSchema = z.object({
  name: z
    .string()
    .optional()
    .refine(
      (data) =>
        data === undefined || (data.trim() !== "" && data.trim().length >= 3),
      {
        message:
          "El nombre no puede estar vacío, ni puede tener menos de 3 caracteres",
      }
    ),
  email: z
    .string()
    .optional()
    .refine(
      (data) =>
        data === undefined ||
        (data.trim() !== "" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data)),
      {
        message: "El email no puede estar vacío y debe ser válido",
      }
    ),
  password: z
    .string()
    .optional()
    .refine(
      (data) =>
        data === undefined ||
        (data.trim() !== "" && data.trim().length >= 6 && /[A-Z]/.test(data),
        {
          message:
            "La contraseña debe tener al menos 6 caracteres y una letra mayúscula",
        })
    ),
  profileImage: z.string().optional(),
  status: z.boolean().default(true),
});
