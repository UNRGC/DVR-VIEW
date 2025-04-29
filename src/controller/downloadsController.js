import path from "path";
import { deleteDownload, getDownload } from "../model/downloadsModel.js";

// Controlador para la descarga de videos
export const getDownloadHandler = async (req, res) => {
    const { camera, video } = req.params;
    try {
        // Define la ruta del archivo de video
        const filePath = await getDownload(camera, video);
        const fileName = path.basename(filePath);
        // Enviar el archivo de video como respuesta
        res.status(200).setHeader("Content-Disposition", `attachment; filename="${fileName}"`).sendFile(filePath);
    } catch (error) {
        console.error("Error al obtener el video:", error.message);
        // Envía un error 404 si no se encuentra el video
        res.status(404).send(error.message);
    }
};

// Controlador para eliminar las descargas
export const deleteDownloadHandler = async (req, res) => {
    try {
        // Elimina las descargas de los videos
        await deleteDownload("1");
        await deleteDownload("2");
        // Envía una respuesta de éxito
        res.status(200).json({ message: "Descargas eliminadas" });
    } catch (error) {
        console.error("Error al eliminar el directorio:", error.message);
        // Envía un error 404 si no se encuentra el video
        res.status(404).send(error.message);
    }
};
