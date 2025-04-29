// Middleware para verificar la autenticación del usuario
const authMiddleware = (req, res, next) => {
    // Verifica si la sesión existe y si el usuario está autenticado
    if (req.session?.user) {
        // Si el usuario está autenticado, continúa con la siguiente función de middleware
        next();
    } else {
        // Si no está autenticado, redirige al usuario al panel
        res.redirect("/");
    }
};

export default authMiddleware;
