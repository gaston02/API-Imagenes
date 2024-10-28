import { Router } from "express";
import { createImageSchema } from "../schemas/image.schema.js";
import {
  validateSchema,
  validateSchemaParams,
} from "../middlewares/validator.middleware.js";
import { createImageController } from "../controllers/image.controller.js";

const router = Router();

router.post(
  "/upload/image",
  validateSchema(createImageSchema),
  createImageController
);

export default router;
