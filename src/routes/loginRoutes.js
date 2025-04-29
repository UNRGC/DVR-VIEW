import express from "express";
import { loginHandler, launchHandler, logoutHandler } from "../controller/loginController.js";
import authMiddleware from "../middleware/authMiddleware.js";

// Crea nueva instancia de un router de express
const router = express.Router();

// Ruta para manejar el inicio de sesión
router.post("/login", loginHandler);
// Ruta para manejar el cierre de sesión
router.post("/logout", authMiddleware, logoutHandler);
// Ruta para manejar el lanzamiento de la aplicación
router.get("/player", authMiddleware, launchHandler);

export default router;
