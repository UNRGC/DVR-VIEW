import { alertConfirm, alertLoading, alertMessage, alertToast } from "./alert.js";
import { getVideos, logout, closeStream } from "./api.js";

const cameraInput = document.getElementById("camera");
const videoPlayer = document.querySelector("video");

const dateInput = document.getElementById("date");
const listVideos = document.getElementById("list");

const logoutButton = document.getElementById("logout");

// Obtener la lista de videos
let list = [];

// Función para obtener la fecha del nombre del video
const getDate = (filename) => {
    const videoParts = filename.split("_");
    return videoParts[1];
};

// Función para obtener la hora del nombre del video
const getTimestamp = (filename) => {
    const videoParts = filename.split("_");
    const videoTimestamp = videoParts[2].replace(/-/g, ":");
    const videoMilliseconds = videoParts[3];
    let [hours, minutes, seconds] = videoTimestamp.split(":").map(Number);
    const ampm = hours >= 12 ? "p. m." : "a. m.";
    hours = hours % 12 || 12;
    const formattedTimestamp = `${hours}:${minutes}:${seconds}:${videoMilliseconds} ${ampm}`;
    return formattedTimestamp;
};

// Función para obtener la lista de videos
const createList = async () => {
    const directElement = document.createElement("div");

    try {
        // Obtener la lista de videos
        if (!list.length) {
            list = await getVideos(cameraInput.value);
        }

        // Crear video en vivo
        directElement.classList.add("video");
        directElement.innerHTML = `
                        <img src="/img/thumb.jpg" alt="Video en vivo" />
                        <span>Video en vivo</span>
                        <button type="button" title="Ver video en vivo">
                            <i class="bi bi-play-circle"></i>
                        </button>
                    `;
        listVideos.appendChild(directElement);

        // Verificar si hay videos
        if (list.length) {
            // Crear lista de videos
            list.reverse().forEach((video) => {
                const videoName = video.split("_large.jpg")[0];
                const videoElement = document.createElement("div");

                // Verificar si la fecha del video coincide con la fecha seleccionada
                if (dateInput.value === getDate(videoName)) {
                    // Crear elemento de video
                    videoElement.classList.add("video");
                    videoElement.innerHTML = `
                        <img src="/thumbs/${cameraInput.value}/${video}" alt="${video}" />
                        <span>${getTimestamp(videoName)}</span>
                        <button type="button" title="Descargar video">
                            <i class="bi bi-download"></i>
                        </button>
                    `;
                    listVideos.appendChild(videoElement);
                }
            });
        }
    } catch (error) {
        // Manejo de errores al obtener la lista de videos
        console.error("Error:", error);
        alertMessage("Error obteniendo grabaciones", error.message, "error", 3000).finally(() => {
            window.location.reload();
        });
    }

    // Obtener todos los videos creados
    document.querySelectorAll(".video").forEach((video) => {
        // Obtener el nombre del video
        const videoName = video.querySelector("img").src.split("/").pop().split(".jpg")[0];

        // Cambiar la fuente del video
        const changeSource = (source) => {
            videoPlayer.src = source;
            videoPlayer.querySelector("source").src = source;
            videoPlayer.load();
        };

        // Agregar evento de clic al video
        video.addEventListener("click", async () => {
            // Verificar si el video es en vivo o grabado
            if (videoName === "thumb") {
                const videoPath = `/stream/${cameraInput.value}`;
                alertLoading("Iniciando transmisión", "Cargando video, por favor espere...");
                await closeStream();
                changeSource(videoPath);
            } else {
                const videoPath = `/videos/${cameraInput.value}/${videoName.split("_large")[0]}.mp4`;
                alertLoading("Cargando video", "Cargando video, por favor espere...");
                await closeStream();
                changeSource(videoPath);
            }
        });

        // Obtener todos los botones de descarga
        video.querySelectorAll("button").forEach((button) => {
            // Agregar evento de clic al botón de descarga
            button.addEventListener("click", async (event) => {
                event.stopPropagation();
                // Confirmar si se desea descargar el video
                if (await alertConfirm("Descargar video", "¿Desea descargar el video?", "question")) {
                    try {
                        // Abrir el video en una nueva pestaña
                        window.open(`/videos/${cameraInput.value}/${videoName.split("_large")[0]}.mp4`, "_blank");
                        // Alerta de descarga exitosa
                        alertToast(null, "Video descargado %", "success", 3000);
                    } catch (error) {
                        // Manejo de errores al descargar el video
                        console.error("Error:", error);
                        alertMessage("Error al descargar", error.message, "error", 3000).finally(() => {
                            window.location.reload();
                        });
                    }
                }
            });
        });
    });
};

// Ajustar el tamaño del video al tamaño de la ventana
document.querySelector(".main").style.height = `${window.innerHeight}px`;

// Acciones al cargar el documento
document.addEventListener("DOMContentLoaded", () => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];

    // Establecer la fecha actual en el input de fecha
    dateInput.value = formattedDate;

    // Agregar evento de cambio al input de fecha y cámara
    dateInput.addEventListener("change", () => {
        listVideos.innerHTML = "";
        createList();
    });

    cameraInput.addEventListener("change", () => {
        listVideos.innerHTML = "";
        createList();
    });

    // Agregar evento de cambio al video
    videoPlayer.addEventListener("loadeddata", () => {
        alertToast(null, "Video cargado %", "success", 3000);
        videoPlayer.play();
    });

    // Agregar evento de clic al botón de cerrar sesión
    logoutButton.addEventListener("click", async () => {
        try {
            // Eliminar la descarga y cerrar sesión
            await closeStream();
            await logout();
        } catch (error) {
            // Manejo de errores al cerrar sesión
            console.error("Error:", error);
            alertMessage("Error al salir", error.message, "error", 3000).finally(() => {
                window.location.reload();
            });
        }
    });

    // Cierra la transmisión y elimina las descargas al cerrar la ventana
    window.addEventListener("beforeunload", async () => {
        await closeStream();
    });

    // Crear la lista de videos al cargar la página
    createList();

    // Alerta de carga al iniciar la transmisión
    alertLoading("Iniciando transmisión", "Cargando video, por favor espere...");
});
