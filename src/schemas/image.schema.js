import { z } from "zod";

export const createImageSchema = z.object({
  name: z
    .string({ required_error: "Nombre es requerido" })
    .min(4, { message: "El nombre debe tener al menos 4 caracteres" })
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
