import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { closeStreamHandler, stream1Handler, stream2Handler } from "../controller/streamController.js";

// Crea nueva instancia de un router de express
const router = express.Router();

// Ruta para obtener el stream de la cámara 1
router.get("/1", authMiddleware, stream1Handler);
// Ruta para obtener el stream de la cámara 2
router.get("/2", authMiddleware, stream2Handler);
// Ruta para cerrar el stream
router.delete("/close", authMiddleware, closeStreamHandler);

export default router;
