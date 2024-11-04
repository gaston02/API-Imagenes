import { Router } from "express";
import { createImageController } from "../controllers/image.controller.js";
import { authMiddleware } from "../middlewares/verifyToken.middleware.js";
import { createImageSchema } from "../schemas/image.schema.js";
import {
  validateSchema,
  validateSchemaParams,
} from "../middlewares/validator.middleware.js";

const router = Router();

router.post("/upload/image", authMiddleware, createImageController);

export default router;
