import { config } from "dotenv";
import { closeStream, createStream } from "../model/streamModel.js";

// Carga las variables de entorno
config();

// URLs de los streams
const rtspUrl1 = process.env.STREAM_1;
const rtspUrl2 = process.env.STREAM_2;

// Controlador para obtener el stream 1
export const stream1Handler = (req, res) => {
    res.setHeader("Content-Type", "video/matroska");
    try {
        // Creación del stream
        const stream = createStream(rtspUrl1);
        // Envío del stream al cliente
        stream.pipe(res);
    } catch (error) {
        console.error("Error al crear el stream:", error.message);
        // Envía un error 500 si hay un problema al crear el stream
        res.status(500).send("Error al crear el stream");
    }
};

// Controlador para obtener el stream 1
export const stream2Handler = (req, res) => {
    res.setHeader("Content-Type", "video/matroska");
    try {
        // Creación del stream
        const stream = createStream(rtspUrl2);
        // Envío del stream al cliente
        stream.pipe(res);
    } catch (error) {
        console.error("Error al crear el stream:", error.message);
        // Envía un error 500 si hay un problema al crear el stream
        res.status(500).send("Error al crear el stream");
    }
};

// Controlador para cerrar el stream
export const closeStreamHandler = (req, res) => {
    try {
        // Cierra el stream
        closeStream();
        // Envía una respuesta de éxito
        res.status(200).send("Stream cerrado");
    } catch (error) {
        console.error("Error al cerrar el stream:", error.message);
        // Envía un error 500 si hay un problema al cerrar el stream
        res.status(500).send("Error al cerrar el stream");
    }
};
