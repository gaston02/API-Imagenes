import { z } from "zod";

export const emailSchema = z.object({
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
});
