(function () {

    const bridgeForm =
        document.getElementById("rsvpBridgeForm");

    if (!bridgeForm) {
        return;
    }


    const mainGuest =
        document.getElementById("mainGuest");

    const attendanceButtons =
        document.querySelectorAll(".attendance-option");

    const guestSection =
        document.getElementById("guestSection");

    const guestQuantity =
        document.getElementById("guestQuantity");

    const guestNames =
        document.getElementById("guestNames");

    const message =
        document.getElementById("rsvpMessage");

    const submitButton =
        document.getElementById("submitRsvp");

    const statusBox =
        document.getElementById("rsvpStatus");

    const payloadInput =
        document.getElementById("rsvpPayload");

    const formContainer =
        document.getElementById("rsvpFormContainer");

    const successContainer =
        document.getElementById("rsvpSuccess");

    const successMessage =
        document.getElementById("successMessage");

    const passQuantity =
        document.getElementById("passQuantity");

    const passGuests =
        document.getElementById("passGuests");

    const passCode =
        document.getElementById("passCode");

    const downloadButton =
        document.getElementById("downloadPass");


    let selectedStatus = "";
    let confirmedData = null;
    let waitingForResponse = false;


    /* =========================================
       SELECCIONAR ASISTENCIA
    ========================================== */

    attendanceButtons.forEach(

        button => {

            button.addEventListener(

                "click",

                function () {

                    attendanceButtons.forEach(

                        item => {

                            item.classList.remove(
                                "selected"
                            );

                        }

                    );


                    button.classList.add(
                        "selected"
                    );


                    selectedStatus =
                        button.dataset.status;


                    statusBox.textContent =
                        "";


                    if (
                        selectedStatus ===
                        "CONFIRMADO"
                    ) {

                        guestSection.classList.remove(
                            "hidden"
                        );

                        renderGuestInputs();

                    } else {

                        guestSection.classList.add(
                            "hidden"
                        );

                    }

                }

            );

        }

    );


    /* =========================================
       CANTIDAD DE PERSONAS
    ========================================== */

    guestQuantity.addEventListener(

        "change",

        renderGuestInputs

    );


    function renderGuestInputs() {

        const quantity =
            Number(
                guestQuantity.value
            ) || 1;


        guestNames.innerHTML =
            "";


        for (
            let i = 0;
            i < quantity;
            i++
        ) {

            const input =
                document.createElement(
                    "input"
                );


            input.type =
                "text";

            input.className =
                "guest-input";

            input.maxLength =
                80;

            input.autocomplete =
                "off";

            input.placeholder =
                `Nombre completo de la persona ${i + 1}`;

            input.dataset.guest =
                "true";


            if (
                i === 0 &&
                mainGuest.value.trim()
            ) {

                input.value =
                    mainGuest.value.trim();

            }


            guestNames.appendChild(
                input
            );

        }

    }


    /* =========================================
       SINCRONIZAR INVITADO PRINCIPAL
    ========================================== */

    mainGuest.addEventListener(

        "input",

        function () {

            const firstInput =
                guestNames.querySelector(
                    '[data-guest="true"]'
                );


            if (
                firstInput &&
                !firstInput.dataset.edited
            ) {

                firstInput.value =
                    mainGuest.value;

            }

        }

    );


    guestNames.addEventListener(

        "input",

        function (event) {

            if (
                event.target.matches(
                    '[data-guest="true"]'
                )
            ) {

                event.target.dataset.edited =
                    "true";

            }

        }

    );


    /* =========================================
       ENVIAR CONFIRMACIÓN
    ========================================== */

    submitButton.addEventListener(

        "click",

        function () {

            if (waitingForResponse) {
                return;
            }


            statusBox.textContent =
                "";


            const principal =
                mainGuest.value.trim();


            if (!principal) {

                showError(
                    "Ingresa tu nombre y apellido."
                );

                mainGuest.focus();

                return;

            }


            if (!selectedStatus) {

                showError(
                    "Indica si asistirás o no."
                );

                return;

            }


            let guests = [];


            if (
                selectedStatus ===
                "CONFIRMADO"
            ) {

                const inputs =
                    guestNames.querySelectorAll(
                        '[data-guest="true"]'
                    );


                guests =
                    Array
                        .from(inputs)
                        .map(
                            input =>
                                input.value.trim()
                        );


                if (
                    guests.some(
                        name => !name
                    )
                ) {

                    showError(
                        "Completa el nombre de todas las personas que asistirán."
                    );

                    return;

                }

            }


            const payload = {

                mainGuest:
                    principal,

                status:
                    selectedStatus,

                guests:
                    guests,

                message:
                    message.value.trim()

            };


            payloadInput.value =
                JSON.stringify(
                    payload
                );


            waitingForResponse =
                true;


            submitButton.disabled =
                true;


            submitButton.textContent =
                "Registrando...";


            statusBox.textContent =
                "Estamos registrando tu confirmación…";


            bridgeForm.submit();


            window.setTimeout(

                function () {

                    if (
                        waitingForResponse
                    ) {

                        waitingForResponse =
                            false;


                        submitButton.disabled =
                            false;


                        submitButton.textContent =
                            "Confirmar asistencia";


                        statusBox.textContent =
                            "La confirmación está tardando más de lo esperado. Intenta nuevamente.";

                    }

                },

                15000

            );

        }

    );


    /* =========================================
       RESPUESTA DE GOOGLE
    ========================================== */

    window.addEventListener(

        "message",

        function (event) {

            const data =
                event.data;


            if (
                !data ||
                data.source !==
                "jael-angela-rsvp"
            ) {

                return;

            }


            waitingForResponse =
                false;


            submitButton.disabled =
                false;


            submitButton.textContent =
                "Confirmar asistencia";


            if (!data.success) {

                showError(
                    data.message ||
                    "No se pudo registrar la confirmación."
                );

                return;

            }


            /*
                NO ASISTIRÁ
            */

            if (!data.attending) {

                formContainer.classList.add(
                    "hidden"
                );


                successContainer.classList.remove(
                    "hidden"
                );


                successMessage.textContent =
                    "Gracias por avisarnos. Tu respuesta quedó registrada.";


                document
                    .getElementById(
                        "digitalPass"
                    )
                    .classList
                    .add(
                        "hidden"
                    );


                downloadButton.classList.add(
                    "hidden"
                );


                return;

            }


            /*
                CONFIRMADO
            */

            confirmedData =
                data;


            showDigitalPass(
                data
            );

        }

    );


    /* =========================================
       MOSTRAR PASE
    ========================================== */

    function showDigitalPass(data) {

        formContainer.classList.add(
            "hidden"
        );


        successContainer.classList.remove(
            "hidden"
        );


        successMessage.textContent =
            "Tu asistencia quedó registrada correctamente.";


        passQuantity.textContent =
            data.quantity === 1
                ? "Pase válido para 1 persona"
                : `Pase válido para ${data.quantity} personas`;


        passCode.textContent =
            data.code;


        passGuests.innerHTML =
            "";


        data.guests.forEach(

            name => {

                const item =
                    document.createElement(
                        "span"
                    );


                item.textContent =
                    name;


                passGuests.appendChild(
                    item
                );

            }

        );


        successContainer.scrollIntoView({

            behavior:
                "smooth",

            block:
                "center"

        });

    }


    /* =========================================
       MOSTRAR ERROR
    ========================================== */

    function showError(text) {

        statusBox.textContent =
            text;

    }


    /* =========================================
       DESCARGAR PASE PNG
    ========================================== */

    downloadButton.addEventListener(

        "click",

        function () {

            if (!confirmedData) {
                return;
            }


            generatePassImage(
                confirmedData
            );

        }

    );


function generatePassImage(data) {

    const canvas =
        document.createElement(
            "canvas"
        );


    /*
        Formato 4:5.
        Ideal para WhatsApp y celular.
    */

    canvas.width =
        1080;

    canvas.height =
        1350;


    const ctx =
        canvas.getContext(
            "2d"
        );


    /* =========================================
       COLORES
    ========================================== */

    const OLIVE_DARK =
        "#354D40";

    const OLIVE =
        "#667A65";

    const SAGE =
        "#A9B9A0";

    const CREAM =
        "#F8F4EC";

    const GOLD =
        "#B79A67";

    const WHITE =
        "#FFFFFF";


    /* =========================================
       FONDO
    ========================================== */

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            1080,
            1350
        );


    gradient.addColorStop(
        0,
        "#FAF7F0"
    );


    gradient.addColorStop(
        0.55,
        "#F1F2E9"
    );


    gradient.addColorStop(
        1,
        "#DCE5D7"
    );


    ctx.fillStyle =
        gradient;


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* =========================================
       DETALLES DECORATIVOS
    ========================================== */

    ctx.save();


    ctx.globalAlpha =
        0.10;


    ctx.fillStyle =
        SAGE;


    ctx.beginPath();

    ctx.arc(
        80,
        90,
        210,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.beginPath();

    ctx.arc(
        1000,
        1280,
        260,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.restore();


    /* =========================================
       MARCO PRINCIPAL
    ========================================== */

    drawRoundedRect(
        ctx,
        55,
        55,
        970,
        1240,
        45
    );


    ctx.strokeStyle =
        GOLD;

    ctx.lineWidth =
        4;

    ctx.stroke();


    /* MARCO INTERIOR */

    drawRoundedRect(
        ctx,
        78,
        78,
        924,
        1194,
        35
    );


    ctx.strokeStyle =
        "rgba(102, 122, 101, 0.38)";

    ctx.lineWidth =
        2;

    ctx.stroke();


    /* =========================================
       ENCABEZADO
    ========================================== */

    ctx.textAlign =
        "center";


    ctx.fillStyle =
        OLIVE;


    ctx.font =
        "600 27px Arial";


    ctx.fillText(
        "BODA CIVIL",
        540,
        165
    );


    /* LÍNEAS DECORATIVAS */

    ctx.strokeStyle =
        GOLD;

    ctx.lineWidth =
        2;


    ctx.beginPath();

    ctx.moveTo(
        320,
        207
    );

    ctx.lineTo(
        455,
        207
    );

    ctx.stroke();


    ctx.beginPath();

    ctx.moveTo(
        625,
        207
    );

    ctx.lineTo(
        760,
        207
    );

    ctx.stroke();


    ctx.fillStyle =
        GOLD;


    ctx.font =
        "38px Georgia";


    ctx.fillText(
        "❦",
        540,
        220
    );


    /* =========================================
       NOMBRES DE LOS NOVIOS
    ========================================== */

    ctx.fillStyle =
        OLIVE_DARK;


    ctx.font =
        "italic 84px Georgia";


    ctx.fillText(
        "Jael & Angela",
        540,
        330
    );


    /* =========================================
       TÍTULO
    ========================================== */

    ctx.fillStyle =
        OLIVE;


    ctx.font =
        "600 25px Arial";


    ctx.fillText(
        "PASE DE INVITACIÓN",
        540,
        420
    );


    /* =========================================
       CANTIDAD
    ========================================== */

    const quantityText =
        data.quantity === 1
            ? "Pase válido para 1 persona"
            : "Pase válido para 2 personas";


    ctx.fillStyle =
        OLIVE_DARK;


    ctx.font =
        "bold 42px Georgia";


    ctx.fillText(
        quantityText,
        540,
        500
    );


    /* =========================================
       DIVISOR
    ========================================== */

    ctx.strokeStyle =
        "rgba(102, 122, 101, 0.30)";

    ctx.lineWidth =
        2;


    ctx.beginPath();

    ctx.moveTo(
        220,
        555
    );

    ctx.lineTo(
        860,
        555
    );

    ctx.stroke();


    /* =========================================
       INVITADOS
    ========================================== */

    ctx.fillStyle =
        GOLD;


    ctx.font =
        "600 22px Arial";


    ctx.fillText(
        data.quantity === 1
            ? "INVITADO"
            : "INVITADOS",
        540,
        620
    );


    let nameY =
        690;


    data.guests.forEach(

        (name, index) => {

            ctx.fillStyle =
                OLIVE_DARK;


            fitCanvasText(
                ctx,
                name,
                540,
                nameY,
                760,
                38,
                27
            );


            if (
                index <
                data.guests.length - 1
            ) {

                ctx.fillStyle =
                    GOLD;

                ctx.font =
                    "24px Georgia";

                ctx.fillText(
                    "·",
                    540,
                    nameY + 46
                );

            }


            nameY +=
                90;

        }

    );


    /* =========================================
       FECHA Y HORA
    ========================================== */

    ctx.fillStyle =
        OLIVE;


    ctx.font =
        "600 24px Arial";


    ctx.fillText(
        "17 · OCTUBRE · 2026",
        540,
        930
    );


    ctx.fillStyle =
        GOLD;


    ctx.font =
        "34px Georgia";


    ctx.fillText(
        "❦",
        540,
        985
    );


    ctx.fillStyle =
        OLIVE_DARK;


    ctx.font =
        "600 27px Arial";


    ctx.fillText(
        "3:00 P. M.",
        540,
        1040
    );


    /* =========================================
       CÓDIGO
    ========================================== */

    ctx.fillStyle =
        OLIVE;


    ctx.font =
        "500 19px Arial";


    ctx.fillText(
        "CÓDIGO DE CONFIRMACIÓN",
        540,
        1145
    );


    ctx.fillStyle =
        OLIVE_DARK;


    ctx.font =
        "bold 34px Arial";


    ctx.fillText(
        data.code,
        540,
        1195
    );


    /* =========================================
       PIE
    ========================================== */

    ctx.fillStyle =
        "rgba(53, 77, 64, 0.65)";


    ctx.font =
        "italic 19px Georgia";


    ctx.fillText(
        "Será un placer compartir este día contigo.",
        540,
        1250
    );


    /* =========================================
       DESCARGAR PNG
    ========================================== */

    const link =
        document.createElement(
            "a"
        );


    link.download =
        `Pase-Boda-Jael-Angela-${data.code}.png`;


    link.href =
        canvas.toDataURL(
            "image/png",
            1
        );


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();

}


/* =========================================================
   RECTÁNGULO REDONDEADO
========================================================= */

function drawRoundedRect(
    ctx,
    x,
    y,
    width,
    height,
    radius
) {

    ctx.beginPath();

    ctx.moveTo(
        x + radius,
        y
    );

    ctx.lineTo(
        x + width - radius,
        y
    );

    ctx.quadraticCurveTo(
        x + width,
        y,
        x + width,
        y + radius
    );

    ctx.lineTo(
        x + width,
        y + height - radius
    );

    ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - radius,
        y + height
    );

    ctx.lineTo(
        x + radius,
        y + height
    );

    ctx.quadraticCurveTo(
        x,
        y + height,
        x,
        y + height - radius
    );

    ctx.lineTo(
        x,
        y + radius
    );

    ctx.quadraticCurveTo(
        x,
        y,
        x + radius,
        y
    );

    ctx.closePath();

}


/* =========================================================
   AJUSTAR NOMBRES LARGOS
========================================================= */

function fitCanvasText(
    ctx,
    text,
    x,
    y,
    maxWidth,
    initialSize,
    minimumSize
) {

    let fontSize =
        initialSize;


    do {

        ctx.font =
            `500 ${fontSize}px Arial`;


        if (
            ctx.measureText(text).width <=
            maxWidth
        ) {

            break;

        }


        fontSize -=
            1;

    } while (
        fontSize >
        minimumSize
    );


    ctx.fillText(
        text,
        x,
        y
    );

}

})();