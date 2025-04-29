import { alertMessage } from "./alert.js";
import { login } from "./api.js";

const formLogin = document.getElementById("formLogin");
const userInput = document.getElementById("userName");
const passwordInput = document.getElementById("password");
const inputs = [userInput, passwordInput];
const eyeBtn = document.getElementById("eye");

// Obtener la altura de la ventana y aplicarla al elemento con clase "background"
document.querySelector(".background").style.height = `${window.innerHeight}px`;

// Carga el evento DOMContentLoaded para asegurarse de que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", () => {
    // Lista de inputs para aplicar el efecto de animación
    inputs.forEach((input) => {
        // Obtener el placeholder del input
        const inputPlaceholder = input.placeholder;
        // Obtener el elemento hermano del input (label)
        const brother = input.previousElementSibling && input.previousElementSibling.tagName.toLowerCase() === "label" ? input.previousElementSibling : input.parentElement.previousElementSibling;

        // Agregar el efecto de animación al hacer foco en el input
        input.addEventListener("focus", () => {
            input.placeholder = "";
            brother.classList.add("bounce");
        });
        // Remover el efecto de animación al perder el foco en el input
        input.addEventListener("focusout", () => {
            input.placeholder = inputPlaceholder;
            brother.classList.remove("bounce");
        });
    });

    // Agregar el evento de clic al botón de ojo para mostrar/ocultar la contraseña
    eyeBtn.addEventListener("click", () => {
        // Cambiar el tipo de input de password a text y viceversa
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            // Cambiar el icono del ojo al estado de contraseña visible
            eyeBtn.querySelector("i").classList.replace("bi-eye", "bi-eye-slash");
        } else {
            passwordInput.type = "password";
            // Cambiar el icono del ojo al estado de contraseña oculta
            eyeBtn.querySelector("i").classList.replace("bi-eye-slash", "bi-eye");
        }
    });

    // Agregar el evento de clic al botón de inicio de sesión
    formLogin.addEventListener("submit", async (e) => {
        // Prevenir el comportamiento por defecto del formulario
        e.preventDefault();
        // Validar que los campos no estén vacíos
        if (userInput.value === "" || passwordInput.value === "") {
            alertMessage("Error", "Por favor, complete todos los campos.", "error", 3000);
            return;
        }

        // Validar que el campo de usuario tenga al menos 3 caracteres
        if (userInput.value.length < 3) {
            // Mostrar un mensaje de error si el usuario tiene menos de 3 caracteres
            alertMessage("Error", "El usuario debe tener al menos 3 caracteres.", "error", 3000);
            // Cambiar el foco al campo de usuario
            userInput.focus();
            return;
        }

        // Validar que el campo de contraseña tenga al menos 6 caracteres
        if (passwordInput.value.length < 8) {
            // Mostrar un mensaje de error si la contraseña tiene menos de 8 caracteres
            alertMessage("Error", "La contraseña debe tener al menos 8 caracteres.", "error", 3000);
            // Cambiar el foco al campo de contraseña
            passwordInput.focus();
            return;
        }

        try {
            // Ejecutar la función de inicio de sesión y esperar su resultado
            await login(userInput.value, passwordInput.value);
        } catch (error) {
            console.error("Error:", error);
            // Mostrar un mensaje de error si ocurre un problema durante el inicio de sesión
            alertMessage("Error", error.message, "error", 3000);
        }
    });
});
