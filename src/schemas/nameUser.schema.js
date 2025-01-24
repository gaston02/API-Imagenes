import { z } from "zod";

export const nameUserSchema = z.object({
  nameUser: z
    .string({ required_error: "Nombre es requerido" })
    .min(5, {
      message: "El nombre debe tener al menos 5 caracteres",
    })
    .refine((data) => data.trim() !== "", {
      message: "El nombre no puede estar vacío",
    })
    .refine((data) => /^[^. ]+(\.[^. ]+)?$/.test(data), {
      message: "El nombre no puede tener espacios, ni caracteres especiales",
    }),
});
