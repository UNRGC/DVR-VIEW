import { spawn } from "child_process";
import { PassThrough } from "stream";

let ffmpegProcessChild = []; // Variable para almacenar el proceso de FFmpeg

// Función para crear un stream de video a partir de una URL RTSP
export const createStream = (rtspUrl) => {
    const stream = new PassThrough();

    // Comando y argumentos para FFmpeg
    const ffmpegArgs = [
        "-rtsp_transport",
        "tcp", // Usa TCP para RTSP
        "-i",
        rtspUrl, // URL de entrada
        "-c:v",
        "copy", // Copia el codec de video sin recodificar
        "-c:a",
        "copy", // Copia el codec de audio sin recodificar
        "-f",
        "matroska", // Formato de salida MKV
        "-preset",
        "ultrafast", // Preset para velocidad de codificación
        "-tune",
        "zerolatency", // Ajuste para baja latencia
        "pipe:1", // Salida a stdout
    ];

    // Inicia el proceso de FFmpeg
    const ffmpegProcess = spawn("ffmpeg", ffmpegArgs);

    // Redirige la salida de FFmpeg al stream
    ffmpegProcess.stdout.pipe(stream);

    // Manejo de eventos
    ffmpegProcess.stderr.on("data", (data) => {
        console.debug("FFmpeg log:", data.toString());
    });

    ffmpegProcess.on("close", (code) => {
        console.error(`FFmpeg terminó con el código: ${code}`);
        stream.end(); // Cierra el stream al finalizar
    });

    stream.on("close", () => {
        console.error("Cliente desconectado, deteniendo FFmpeg.");
        ffmpegProcess.kill("SIGINT"); // Detiene FFmpeg si el cliente se desconecta
    });

    ffmpegProcessChild.push(ffmpegProcess); // Almacena el proceso de FFmpeg en la variable global
    return stream;
};

// Función para cerrar el stream y detener FFmpeg
export const closeStream = () => {
    // Cierra todos los procesos de FFmpeg almacenados
    ffmpegProcessChild.forEach((process) => {
        process.kill("SIGINT");
    });
    ffmpegProcessChild = []; // Reinicia la variable global
};
