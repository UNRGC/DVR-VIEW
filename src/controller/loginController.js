import login from "../model/loginModel.js";
import path from "path";
import { fileURLToPath } from "url";

// Define __dirname para módulos ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Controlador para iniciar sesión
export const loginHandler = (req, res) => {
    // Extra el usuario y la contraseña del cuerpo de la solicitud
    const { user, password } = req.body;
    try {
        if (login(user, password)) {
            // Si las credenciales son correctas, guarda el usuario en la sesión
            req.session.user = user;
            // Envía una respuesta de éxito
            res.status(200).json({ message: "Usuario autenticado" });
        } else {
            // Si las credenciales son incorrectas, envía un error 401
            res.status(401).json({ message: "Credenciales invalidas" });
        }
    } catch (error) {
        console.error("Error durante la autenticación:", error.message);
        // Envía un error 500 si ocurre un problema
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Controlador para cerrar sesión
export const logoutHandler = (req, res) => {
    try {
        // Elimina la sesión del usuario
        req.session.destroy((error) => {
            if (error) {
                console.error("Error al cerrar sesión:", error.message);
                // Envía un error 500 si ocurre un problema al cerrar sesión
                res.status(500).json({ message: "Error interno del servidor" });
            } else {
                console.debug("Sesión cerrada correctamente");
                // Redirige a la página de inicio
                res.redirect("/");
            }
        });
    } catch (error) {
        console.error("Error durante el cierre de sesión:", error.message);
        // Envía un error 500 si ocurre un problema
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Controlador para manejar la ruta de lanzamiento
export const launchHandler = (req, res) => {
    // Define la ruta del archivo HTML
    const filePath = path.join(__dirname, "../../private/html/player.html");
    try {
        // Verifica si el usuario está autenticado
        if (req.session.user) res.setHeader("Content-Type", "text/html").sendFile(filePath); // Si está autenticado, envía la página de inicio
        else res.status(401).json({ message: "No autenticado" }); // Si no está autenticado, envía un error 401
    } catch (error) {
        console.error("Error durante la autenticación:", error.message);
        // Envía un error 500 si ocurre un problema
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
