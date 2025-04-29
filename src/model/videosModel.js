import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Define __dirname para módulos ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getVideo = async (camera, video) => {
    // Define el directorio donde se almacenan los videos
    const videoDir = path.join(__dirname, `../../private/video/${camera}`);
    // Define la ruta del archivo de video
    const filePath = path.join(videoDir, video);

    // Verifica si el directorio existe, y si no, lo crea
    await fs.mkdir(videoDir, { recursive: true });

    // Verifica si el archivo existe
    await fs.access(filePath);
    return filePath;
};

export default getVideo;
