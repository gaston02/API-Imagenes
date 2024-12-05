import { Router } from "express";
import { createImageController } from "../controllers/image.controller.js";
import { createGalleryController } from "../controllers/galery.controller.js";
import { authMiddleware } from "../middlewares/verifyToken.middleware.js";
import { uploadImage } from "../middlewares/uploadImage.middleware.js";
import { processImage } from "../middlewares/proccessImage.middleware.js";
import {
  validateSchemaWithFileAndCleanup,
  validateSchema,
} from "../middlewares/validator.middleware.js";
import { createImageSchema } from "../schemas/image.schema.js";
import { createGallerySchema } from "../schemas/gallery.schema.js";

const router = Router();
const UPLOADS_DIR = "C:/Users/gasto/OneDrive/uploads";

router.post(
  "/upload/image",
  authMiddleware,
  uploadImage,
  processImage,
  validateSchemaWithFileAndCleanup(
    createImageSchema,
    "processedImagePath",
    UPLOADS_DIR
  ),
  createImageController
);

router.post(
  "/galeria",
  authMiddleware,
  validateSchema(createGallerySchema),
  createGalleryController
);

export default router;
