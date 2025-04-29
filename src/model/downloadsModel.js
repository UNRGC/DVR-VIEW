import ffmpeg from "fluent-ffmpeg";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Define __dirname para módulos ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para obtener el video y convertirlo a un formato compatible
export const getDownload = async (camera, video) => {
    // Define el directorio donde se almacenan los videos
    const videoDir = path.join(__dirname, `../../private/video/${camera}`);
    // Define el directorio donde se almacenan los videos convertidos
    const videoDownloadDir = path.join(__dirname, `../../private/download/${camera}`);

    // Verifica si el directorio existe, y si no, lo crea
    await fs.mkdir(videoDir, { recursive: true });
    await fs.mkdir(videoDownloadDir, { recursive: true });

    // Verifica si el archivo existe
    const filePath = path.join(videoDir, `${video}.mkv`);
    const filePathDownload = path.join(videoDownloadDir, `${video}.mp4`);

    // Crea el archivo de video si no existe
    await new Promise((resolve, reject) => {
        // Configura FFmpeg para convertir el video
        ffmpeg(filePath)
            .outputOptions("-c:v", "libx264", "-preset", "fast", "-crf", "23", "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart")
            .output(filePathDownload) // Define el archivo de salida
            .on("end", () => {
                // Se ejecuta cuando FFmpeg termina el proceso
                console.debug("Conversión completada y optimizada");
                resolve();
            })
            .on("error", (err) => {
                // Se ejecuta si hay un error en el proceso
                console.error("Error en la conversión:", err.message);
                reject(err);
            })
            .run(); // Inicia el proceso de conversión
    });

    // Verifica si el archivo convertido existe
    await fs.access(filePathDownload);
    // Si el archivo existe, lo devuelve
    return filePathDownload;
};

// Función para eliminar el directorio de descargas
export const deleteDownload = async (camera) => {
    // Define el directorio donde se almacenan los videos
    const videoDownloadDir = path.join(__dirname, `../../private/download/${camera}`);
    // Lee los archivos dentro del directorio
    const files = await fs.readdir(videoDownloadDir);
    // Elimina cada archivo dentro del directorio
    for (const file of files) {
        const filePath = path.join(videoDownloadDir, file);
        await fs.unlink(filePath);
    }
    console.error("Archivos de descargas eliminados");
};
