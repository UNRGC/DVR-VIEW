import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Define __dirname para módulos ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para obtener las rutas de todas las miniaturas
export const listThumbs = async (camera) => {
    // Define el directorio donde se almacenan las miniaturas
    const thumbsDir = path.join(__dirname, `../../private/video/${camera}/thumbs`);

    // Verifica si el directorio existe, y si no, lo crea
    await fs.mkdir(thumbsDir, { recursive: true });

    // Lee los archivos del directorio
    const files = await fs.readdir(thumbsDir);
    // Filtra los archivos para obtener solo los que terminan en .jpg
    const jpgFiles = files.filter((file) => file.endsWith("_large.jpg"));
    // Devuelve las rutas de las miniaturas
    return jpgFiles;
};

// Función para obtener la ruta de una miniatura específica
export const getThumb = async (camera, thumb) => {
    // Define el directorio donde se almacenan las miniaturas
    const thumbsDir = path.join(__dirname, `../../private/video/${camera}/thumbs`);
    // Define la ruta del archivo de la miniatura
    const filePath = path.join(thumbsDir, thumb);

    // Verifica si el directorio existe, y si no, lo crea
    await fs.mkdir(thumbsDir, { recursive: true });

    // Verifica si el archivo existe y devuelve la ruta del archivo
    await fs.access(filePath);
    return filePath;
};
