/* ==============================================
   MANYATUPROFE / M2 MARKETING
   INVITACIÓN BODA CIVIL
============================================== */


/* ==============================================
   CONFIGURACIÓN
============================================== */

const WEDDING_DATE =
    new Date(
        "2026-10-17T15:00:00-05:00"
    );


/*
    PEGA AQUÍ EL LINK DE GOOGLE FORMS.

    Ejemplo:

    const GOOGLE_FORM_URL =
        "https://forms.gle/xxxxxxxxxx";
*/

const GOOGLE_FORM_URL =
    "";



/* ==============================================
   CUENTA REGRESIVA
============================================== */

function updateCountdown() {

    const now =
        new Date();


    const difference =
        WEDDING_DATE.getTime() -
        now.getTime();


    if (
        difference <=
        0
    ) {

        setCountdownValue(
            "days",
            "00"
        );

        setCountdownValue(
            "hours",
            "00"
        );

        setCountdownValue(
            "minutes",
            "00"
        );

        setCountdownValue(
            "seconds",
            "00"
        );

        return;

    }


    const days =
        Math.floor(
            difference /
            (
                1000 *
                60 *
                60 *
                24
            )
        );


    const hours =
        Math.floor(
            (
                difference /
                (
                    1000 *
                    60 *
                    60
                )
            ) %
            24
        );


    const minutes =
        Math.floor(
            (
                difference /
                (
                    1000 *
                    60
                )
            ) %
            60
        );


    const seconds =
        Math.floor(
            (
                difference /
                1000
            ) %
            60
        );


    setCountdownValue(
        "days",
        days
    );

    setCountdownValue(
        "hours",
        hours
    );

    setCountdownValue(
        "minutes",
        minutes
    );

    setCountdownValue(
        "seconds",
        seconds
    );

}


function setCountdownValue(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (!element) {

        return;

    }


    element.textContent =
        String(
            value
        )
            .padStart(
                2,
                "0"
            );

}


/* ==============================================
   CONFIRMACIÓN GOOGLE FORMS
============================================== */

function initializeConfirmation() {

    const button =
        document.getElementById(
            "confirmButton"
        );


    if (!button) {

        return;

    }


    button.addEventListener(

        "click",

        () => {


            if (!GOOGLE_FORM_URL) {

                alert(
                    "La confirmación de asistencia aún no está conectada al formulario."
                );

                return;

            }


            window.open(
                GOOGLE_FORM_URL,
                "_blank",
                "noopener,noreferrer"
            );

        }

    );

}


/* ==============================================
   ANIMACIONES AL HACER SCROLL
============================================== */

function initializeRevealAnimations() {

    const elements =
        document.querySelectorAll(
            ".reveal"
        );


    if (
        !(
            "IntersectionObserver"
            in window
        )
    ) {

        elements.forEach(

            element => {

                element.classList.add(
                    "visible"
                );

            }

        );

        return;

    }


    const observer =
        new IntersectionObserver(

            entries => {

                entries.forEach(

                    entry => {

                        if (
                            !entry.isIntersecting
                        ) {

                            return;

                        }


                        entry.target
                            .classList
                            .add(
                                "visible"
                            );


                        observer.unobserve(
                            entry.target
                        );

                    }

                );

            },

            {

                threshold:
                    0.15

            }

        );


    elements.forEach(

        element => {

            observer.observe(
                element
            );

        }

    );

}


/* ==============================================
   INICIAR
============================================== */

updateCountdown();

setInterval(
    updateCountdown,
    1000
);


initializeConfirmation();

initializeRevealAnimations();