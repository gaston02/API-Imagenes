import { Router } from "express";
import { createUserController } from "../controllers/user.controller.js";
import { loginController, logout } from "../controllers/login.controller.js";
import { profileImage } from "../middlewares/uploadImage.middleware.js";
import { processImage } from "../middlewares/proccessImage.middleware.js";
import {
  validateUserSchemaWithFileAndCleanup,
  validateSchema,
} from "../middlewares/validator.middleware.js";
import { loginSchema } from "../schemas/login.schema.js";
import { createUserSchema } from "../schemas/user.schema.js";

const router = Router();

const UPLOADS_DIR = "C:/Users/gasto/OneDrive/uploads";

router.post(
  "/registro/usuario",
  profileImage,
  processImage,
  validateUserSchemaWithFileAndCleanup(
    createUserSchema,
    "processedImagePath",
    UPLOADS_DIR
  ),
  createUserController
);

router.post("/login", validateSchema(loginSchema), loginController);

router.post("/logout", logout);

export default router;
