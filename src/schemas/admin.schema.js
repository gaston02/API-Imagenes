import { z } from "zod";

export const createAdminSchema = z.object({
  name: z
    .string({
      required_error: "Nombre es requerido",
    })
    .min(3, {
      message: "El nombre debe tener al menos 3 caracteres",
    })
    .refine((data) => data.trim() !== "", {
      message: "El nombre no puede estar vacío",
    }),
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
    .min(8, {
      message: "La contraseña debe tener al menos 8 caracteres",
    })
    .refine((data) => data.trim() !== "", {
      message: "La contraseña no puede estar vacía",
    })
    .refine((data) => /[A-Z]/.test(data), {
      message: "La contraseña debe contener al menos una letra mayúscula",
    })
    .refine((data) => (data.match(/\d/g) || []).length >= 4, {
      message: "La contraseña debe contener al menos cuatro números",
    })
    .refine((data) => /[!@#$%^&*(),.?":{}|<>]/.test(data), {
      message: "La contraseña debe contener al menos un caracter especial",
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
  status: z.boolean().default(true),
});

export const updateAdminSchema = z.object({
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
        (data.trim() !== "" &&
          data.trim().length >= 8 &&
          /[A-Z]/.test(data) &&
          (data.match(/\d/g) || []).length >= 4 &&
          /[!@#$%^&*(),.?":{}|<>]/.test(data)),
      {
        message:
          "La contraseña debe tener al menos 8 caracteres, una letra mayúscula, cuatro números y un caracter especial",
      }
    ),
  profileImage: z.string().optional(),
  status: z.boolean().default(true),
});
