import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { deleteDownloadHandler, getDownloadHandler } from "../controller/downloadsController.js";

// Crea nueva instancia de un router de express
const router = express.Router();

// Ruta para obtener un video específico
router.get("/:camera/:video", authMiddleware, getDownloadHandler);
// Ruta para eliminar los videos descargados
router.delete("/", authMiddleware, deleteDownloadHandler);

export default router;
