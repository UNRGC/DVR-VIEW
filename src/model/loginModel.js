import { config } from "dotenv";
import bcrypt from "bcrypt";

// Carga las variables de entorno
config();

// Función para verificar el usuario y la contraseña
const login = (user, password) => {
    // Verifica si el usuario y la contraseña son correctos
    const hashedPassword = process.env.PASSWORD;
    // Devuelve true si el usuario y la contraseña son correctos
    return user === process.env.USER && bcrypt.compareSync(password, hashedPassword) ? true : false;
};

export default login;
