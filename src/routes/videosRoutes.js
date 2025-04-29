import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import getVideoHandler from "../controller/videosController.js";

// Crea nueva instancia de un router de express
const router = express.Router();

// Ruta para obtener un video específico
router.get("/:camera/:video", authMiddleware, getVideoHandler);

export default router;
