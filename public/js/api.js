import { alertLoading, alertMessage } from "./alert.js";

// Función para iniciar sesión
export const login = async (user, password) => {
    // Mostrar un mensaje de carga mientras se procesa la solicitud
    alertLoading("Autenticando", "Espere mientras validamos las credenciales...");

    // Realizar la solicitud de inicio de sesión al servidor
    const response = await fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user,
            password,
        }),
    });

    // Verificar si la respuesta es exitosa
    if (response.ok) {
        // Si la respuesta es exitosa, obtener los datos de la respuesta
        const data = await response.json();
        // Mostrar un mensaje de éxito y redirigir al usuario a la página de reproducción
        alertMessage("Éxito", data.message, "success", 3000).finally(async () => {
            // Realizar una solicitud para redirigir al usuario a la página de reproducción
            const redirect = await fetch("/player", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            // Verificar si la redirección fue exitosa
            if (redirect.ok) window.location.href = redirect.url;
            else {
                // Si la redirección falla, obtener los datos de error
                const errorData = await redirect.json();
                // Mostrar un mensaje de error
                alertMessage("Error", errorData.message, "error", 3000);
            }
        });
    } else {
        // Si la respuesta no es exitosa, obtener los datos de error
        const errorData = await response.json();
        // Mostrar un mensaje de error
        alertMessage("Error", errorData.message, "error", 3000);
    }
};

// Función para cerrar sesión
export const logout = async () => {
    // Mostrar un mensaje de carga mientras se procesa la solicitud
    alertLoading("Cerrando sesión", "Espere mientras cerramos su sesión...");

    // Realizar la solicitud de cierre de sesión al servidor
    const response = await fetch("/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });

    // Verificar si la respuesta es un redireccionamiento exitoso
    if (response.url) {
        // Redirigir al usuario a la página de inicio de sesión
        window.location.href = response.url;
    } else {
        // Si la respuesta no es exitosa, obtener los datos de error
        const errorData = await response.json();
        // Mostrar un mensaje de error
        alertMessage("Error", errorData.message, "error", 3000);
    }
};

// Función para obtener la lista de videos
export const getVideos = async (camera) => {
    // Realizar la solicitud para obtener la lista de videos al servidor
    const response = await fetch(`/thumbs/${camera}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    // Verificar si la respuesta es exitosa
    if (response.ok) {
        // Si la respuesta es exitosa, obtener los datos de la respuesta
        const data = await response.json();
        // retornar la lista de videos
        return data.list;
    } else {
        // Si la respuesta no es exitosa, obtener los datos de error
        const errorData = await response.json();
        // Mostrar un mensaje de error
        alertMessage("Error", errorData.message, "error", 3000);
        return null;
    }
};

// Función para obtener una miniatura específica
export const getThumb = async (thumb) => {
    // Realizar la solicitud para obtener las miniaturas de los videos al servidor
    const response = await fetch(`/thumbs/${thumb}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        redirect: "follow",
    });

    // Verificar si la respuesta es exitosa
    if (response.ok) {
        // retornar la miniatura
        return response.url;
    } else {
        // Si la respuesta no es exitosa, obtener los datos de error
        const errorData = await response.json();
        // Mostrar un mensaje de error
        alertMessage("Error", errorData.message, "error", 3000);
        return null;
    }
};

// Función para obtener un video específico
export const getVideo = async (video) => {
    // Mostrar un mensaje de carga mientras se procesa la solicitud
    alertLoading("Cargando video", "Cargando video, por favor espere...");

    // Realizar la solicitud para obtener el video al servidor
    const response = await fetch(`/videos/${video}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        redirect: "follow",
    });

    // Verificar si la respuesta es exitosa
    if (response.ok) {
        // retornar el video
        return response.url;
    } else {
        // Si la respuesta no es exitosa, obtener los datos de error
        const errorData = await response.json();
        // Mostrar un mensaje de error
        alertMessage("Error", errorData.message, "error", 3000);
        return null;
    }
};

// Función para cerrar el stream
export const closeStream = async () => {
    // Realizar la solicitud para cerrar el stream al servidor
    await fetch("/stream/close", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });
};
