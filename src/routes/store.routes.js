import { Router } from "express";
import {
  createUserController,
  getRandomUserController,
  getUserController,
} from "../controllers/user.controller.js";
import { loginController, logout } from "../controllers/login.controller.js";
import { profileImage } from "../middlewares/uploadImage.middleware.js";
import { processImage } from "../middlewares/proccessImage.middleware.js";
import {
  validateUserSchemaWithFileAndCleanup,
  validateSchema,
  validateSchemaParams,
} from "../middlewares/validator.middleware.js";
import {
  authMiddleware,
  checkUserOwnership,
} from "../middlewares/verifyToken.middleware.js";
import { loginSchema } from "../schemas/login.schema.js";
import { createUserSchema } from "../schemas/user.schema.js";
import { idSchema } from "../schemas/id.schema.js";
import { IMAGES_DIR } from "../config.js";

const router = Router();

const uploadsDir = IMAGES_DIR;

router.post(
  "/registro/usuario",
  profileImage,
  processImage,
  validateUserSchemaWithFileAndCleanup(
    createUserSchema,
    "processedImagePath",
    uploadsDir
  ),
  createUserController
);

router.get("/usuario/aleatorio", getRandomUserController);

router.get(
  "/usuario/:id",
  authMiddleware,
  validateSchemaParams(idSchema),
  checkUserOwnership,
  getUserController
);

router.post("/login", validateSchema(loginSchema), loginController);

router.post("/logout", logout);

export default router;
