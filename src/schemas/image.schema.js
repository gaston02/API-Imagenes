import { z } from "zod";

export const createImageSchema = z.object({
  name: z
    .string({ required_error: "Nombre es requerido" })
    .min(7, { message: "El nombre debe tener al menos 7 caracteres" })
    .refine((data) => data.trim() !== "", {
      message: "El nombre no puede estar vacío",
    }),
  path: z
    .string({ required_error: "Path es requerido" })
    .refine((data) => data.trim() !== "", {
      message: "El path no puede estar vacío",
    }),
  public: z.boolean().default(true),
});

export const updateImageSchema = z.object({
  name: z
    .string()
    .optional()
    .refine(
      (data) =>
        data === undefined || (data.trim() !== "" && data.trim().length >= 7),
      {
        message:
          "El nombre no puede estar vacío, ni puede tener menos de 7 caracteres",
      }
    ),
  public: z.boolean().default(true),
});
