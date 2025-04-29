import getVideo from "../model/videosModel.js";

// Controlador para obtener un video específico
const getVideoHandler = async (req, res) => {
    // Extrae los parámetros de la solicitud
    const { camera, video } = req.params;
    try {
        // Llama a la función para obtener el video
        const filePath = await getVideo(camera, video);
        // Envía el video como respuesta
        res.status(200).setHeader("Content-Type", "video/matroska").sendFile(filePath);
    } catch (error) {
        console.error("Error al obtener el video:", error.message);
        // Envía un error 404 si el archivo no existe
        res.status(404).json({ error: "Error interno del servidor" });
    }
};

export default getVideoHandler;
