import { Router } from "express";
import { createUserController } from "../controllers/user.controller.js";
import { loginController, logout } from "../controllers/login.controller.js";
import {
  validateSchema,
  validateSchemaParams,
} from "../middlewares/validator.middleware.js";
import { createUserSchema, updateUserSchema } from "../schemas/user.schema.js";
import { loginSchema } from "../schemas/login.schema.js";

const router = Router();

router.post(
  "/registro/usuario",
  createUserController
);

router.post("/login", validateSchema(loginSchema), loginController);

router.post("/logout", logout);

export default router;
