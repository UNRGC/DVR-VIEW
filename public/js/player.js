import { alertConfirm, alertLoading, alertMessage, alertToast } from "./alert.js";
import { getVideos, logout, closeStream } from "./api.js";

const cameraInput = document.getElementById("camera");
const videoPlayer = document.querySelector("video");

const dateInput = document.getElementById("date");
const listVideos = document.getElementById("list");

const logoutButton = document.getElementById("logout");

const hash = window.location.hash.substring(1) || 1;

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

// Función para cambiar la fuente del video
const changeSource = async (source) => {
    videoPlayer.src = source;
    videoPlayer.querySelector("source").src = source;
    await closeStream();
    videoPlayer.load();
};

// Función para obtener la lista de videos
const createList = async (camera) => {
    const directElement = document.createElement("div");

    try {
        // Obtener la lista de videos
        const list = await getVideos(camera);

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

        // Agregar evento de clic al video
        video.addEventListener("click", () => {
            // Verificar si el video es en vivo o grabado
            if (videoName === "thumb") {
                const videoPath = `/stream/${cameraInput.value}`;
                alertLoading("Iniciando transmisión", "Cargando video, por favor espere...");
                changeSource(videoPath);
            } else {
                const videoPath = `/videos/${cameraInput.value}/${videoName.split("_large")[0]}.mp4`;
                alertLoading("Cargando video", "Cargando video, por favor espere...");
                changeSource(videoPath);
            }
        });

        // Obtener todos los botones de descarga
        video.querySelectorAll("button").forEach((button) => {
            // Agregar evento de clic al botón de descarga
            button.addEventListener("click", async (event) => {
                // Verificar si el video es en vivo o grabado
                if (videoName !== "thumb") {
                    event.stopPropagation();
                    // Confirmar si se desea descargar el video
                    if (await alertConfirm("Descargar video", "¿Desea descargar el video?", "question")) {
                        try {
                            // Alerta de carga al iniciar la descarga
                            alertLoading("Descargando video", "Por favor espere...");
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
                }
            });
        });
    });
};

// Establecer la fecha actual en el input de fecha
const today = new Date();
const formattedDate = today
    .toLocaleDateString("es-MX", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    })
    .split("/")
    .reverse()
    .join("-");

// Establecer la fecha actual en el input de fecha
dateInput.value = formattedDate;

// Agrega evento de cambio al input de fecha y cámara
dateInput.addEventListener("change", () => {
    listVideos.innerHTML = "";
    createList(cameraInput.value);
});

// Agrega evento de cambio de hash a la ventana
window.addEventListener("hashchange", () => {
    const videoPath = `/stream/${cameraInput.value}`;
    alertLoading("Iniciando transmisión", "Cargando video, por favor espere...");
    changeSource(videoPath);
});

// Agrega evento de cambio al input de cámara
cameraInput.addEventListener("change", () => {
    listVideos.innerHTML = "";
    createList(cameraInput.value);
    window.location.hash = cameraInput.value;
});

// Agrega evento de cambio al video
videoPlayer.addEventListener("loadeddata", () => {
    alertToast(null, "Video cargado %", "success", 3000);
    videoPlayer.play();
});

// Agrega evento de error al video
videoPlayer.addEventListener("error", () => {
    alertMessage("Error al cargar video", "No se pudo cargar el video, por favor intente nuevamente.", "error", 3000).finally(() => {
        window.location.reload();
    });
});
videoPlayer.addEventListener("stalled", () => {
    alertMessage("Error de conexión", "No se pudo cargar el video, por favor intente nuevamente.", "error", 3000).finally(() => {
        window.location.reload();
    });
});

// Agrega evento de clic al botón de cerrar sesión
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

// Ajusta el tamaño del video al tamaño de la ventana
document.querySelector(".main").style.height = `${window.innerHeight}px`;

// Cambia la fuente del video al cargar la página
cameraInput.value = hash;
changeSource(`/stream/${cameraInput.value}`);

// Crear la lista de videos al cargar la página
createList(hash);

// Alerta de carga al iniciar la transmisión
alertLoading("Iniciando transmisión", "Cargando video, por favor espere...");
