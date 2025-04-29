import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { listThumbsHandler, getThumbHandler } from "../controller/thumbsController.js";

// Crea nueva instancia de un router de express
const router = express.Router();

// Ruta para obtener las miniaturas
router.get("/:camera", authMiddleware, listThumbsHandler);
// Ruta para obtener una miniatura específica
router.get("/:camera/:thumb", authMiddleware, getThumbHandler);

export default router;
