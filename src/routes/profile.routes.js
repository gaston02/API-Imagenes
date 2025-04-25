import { Router } from "express";
import {
  createImageController,
  updateImageController,
  deleteImageController,
} from "../controllers/image.controller.js";
import {
  createGalleryController,
  updateGalleryController,
  deleteGalleryController,
} from "../controllers/galery.controller.js";
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
  validateSchemaParams,
  validateUserSchemaWithFileAndCleanupForUpdate,
} from "../middlewares/validator.middleware.js";
import { convertHeicHeifMiddleware } from "../middlewares/preProcessImage.middleware.js";
import {
  createImageSchema,
  updateImageSchema,
} from "../schemas/image.schema.js";
import { idSchema } from "../schemas/id.schema.js";
import {
  createGallerySchema,
  updateGallerySchema,
} from "../schemas/gallery.schema.js";
import { updateUserSchema } from "../schemas/user.schema.js";
import { IMAGES_DIR } from "../config.js";

const router = Router();
const uploadsDir = IMAGES_DIR;

router.post(
  "/upload/image",
  authMiddleware,
  uploadImage,
  (req, res, next) => {
    console.log(">>> multer req.file:", req.file);
    next();
  },
  convertHeicHeifMiddleware,
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
  validateSchemaParams(idSchema),
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

router.put(
  "/actualizar/imagen/:id",
  authMiddleware,
  validateSchemaParams(idSchema),
  validateSchema(updateImageSchema),
  updateImageController
);

router.put(
  "/actualizar/galeria/:id",
  authMiddleware,
  validateSchemaParams(idSchema),
  validateSchema(updateGallerySchema),
  updateGalleryController
);

router.delete(
  "/eliminar/imagen/:id",
  authMiddleware,
  validateSchemaParams(idSchema),
  deleteImageController
);

router.delete(
  "/eliminar/galeria/:id",
  authMiddleware,
  validateSchemaParams(idSchema),
  deleteGalleryController
);

export default router;
