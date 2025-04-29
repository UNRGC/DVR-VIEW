import { listThumbs, getThumb } from "../model/thumbsModel.js";

// Controlador para obtener la lista de miniaturas
export const listThumbsHandler = async (req, res) => {
    try {
        // Llama a la función para listar las miniaturas
        const thumbs = await listThumbs(req.params.camera);
        // Envía la respuesta con las miniaturas
        res.status(200).json({ list: thumbs });
    } catch (error) {
        console.error("Error al obtener las miniaturas:", error.message);
        // Envía un error 500 si ocurre un problema
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Controlador para obtener una miniatura específica
export const getThumbHandler = async (req, res) => {
    // Extrae los parámetros de la solicitud
    const { camera, thumb } = req.params;
    try {
        // Llama a la función para obtener la miniatura
        const filePath = await getThumb(camera, thumb);
        // Envía la miniatura como respuesta
        res.status(200).setHeader("Content-Type", "image/jpeg").sendFile(filePath);
    } catch (error) {
        console.error("Error al obtener la miniatura:", error.message);
        // Envía un error 404 si el archivo no existe
        res.status(404).json({ error: "Error interno del servidor" });
    }
};
