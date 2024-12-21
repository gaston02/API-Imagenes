import { Router } from "express";
import { createImageController } from "../controllers/image.controller.js";
import { createGalleryController } from "../controllers/galery.controller.js";
import { updateUserController } from "../controllers/user.controller.js";
import {
  authMiddleware,
  checkUserOwnership,
} from "../middlewares/verifyToken.middleware.js";
import {
  uploadImage,
  profileImage,
} from "../middlewares/uploadImage.middleware.js";
import { processImage } from "../middlewares/proccessImage.middleware.js";
import {
  validateSchemaWithFileAndCleanup,
  validateSchema,
  validateUserSchemaWithFileAndCleanupForUpdate,
} from "../middlewares/validator.middleware.js";
import { createImageSchema } from "../schemas/image.schema.js";
import { createGallerySchema } from "../schemas/gallery.schema.js";
import { updateUserSchema } from "../schemas/user.schema.js";
import { IMAGES_DIR } from "../config.js";

const router = Router();
const uploadsDir = IMAGES_DIR;

router.post(
  "/upload/image",
  authMiddleware,
  uploadImage,
  processImage,
  validateSchemaWithFileAndCleanup(
    createImageSchema,
    "processedImagePath",
    uploadsDir
  ),
  createImageController
);

router.post(
  "/galeria",
  authMiddleware,
  validateSchema(createGallerySchema),
  createGalleryController
);

router.put(
  "/actualizar/usuario/:id",
  authMiddleware,
  checkUserOwnership,
  profileImage,
  processImage,
  validateUserSchemaWithFileAndCleanupForUpdate(
    updateUserSchema,
    "processedImagePath",
    uploadsDir
  ),
  updateUserController
);

export default router;
