import Swal from "./sweetalert2.esm.all.min.js";

// Alerta de carga con loader y sin aceptación
export const alertLoading = (_title, _text) => {
    Swal.fire({
        iconHtml: `
            <div class="loading"></div>
        `,
        title: _title,
        text: _text,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        timerProgressBar: true,
        customClass: {
            popup: "alert-popup",
        },
    });
};

// Alerta de mensaje con aceptación y temporizador opcional
export const alertMessage = async (_title, _text, _icon, _timer) => {
    const res = await Swal.fire({
        title: _title,
        text: _text,
        icon: _icon,
        timer: _timer,
        showConfirmButton: true,
        confirmButtonText: "Aceptar",
        allowOutsideClick: false,
        timerProgressBar: true,
        customClass: {
            popup: "alert-popup",
            confirmButton: "alert-confirm",
        },
    });
    return res.isConfirmed;
};

// Alerta de confirmación con aceptación y cancelación
export const alertConfirm = async (_title, _text, _icon) => {
    const res = await Swal.fire({
        title: _title,
        text: _text,
        icon: _icon,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
        allowOutsideClick: false,
        customClass: {
            popup: "alert-popup",
            confirmButton: "alert-confirm",
            cancelButton: "alert-cancel",
        },
    });
    return res.isConfirmed;
};

// Alerta toast con temporizador
export const alertToast = async (_title, _text, _icon, _timer) => {
    let timeLeft = _timer / 1000;

    const Toast = Swal.mixin({
        toast: true,
        position: "bottom-end",
        timer: _timer,
        showConfirmButton: false,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;

            const content = toast.querySelector(".swal2-html-container");

            content.innerHTML = _text.replace("%", timeLeft);

            const countdown = setInterval(() => {
                timeLeft--;
                content.innerHTML = _text.replace("%", timeLeft);
                if (timeLeft <= 0) {
                    clearInterval(countdown);
                }
            }, 1000);
        },
    });

    const res = await Toast.fire({
        title: _title,
        text: _text.replace("%", timeLeft),
        icon: _icon,
        customClass: { popup: "alert-popup" },
    });

    return res.isConfirmed;
};
