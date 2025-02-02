import { z } from "zod";

export const createGallerySchema = z.object({
  name: z
    .string({ required_error: "Nombre es requerido" })
    .min(4, {
      message: "El nombre debe tener al menos 4 caracteres",
    })
    .refine((data) => data.trim() !== "", {
      message: "El nombre no puede estar vacío",
    }),
  description: z
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
  public: z.boolean().default(true),
});

export const updateGallerySchema = z.object({
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
  description: z
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
  public: z.boolean().default(true),
});
