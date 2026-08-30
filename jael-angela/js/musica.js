/* ==============================================
   MÚSICA - INVITACIÓN JAEL & ANGELA
============================================== */

(function () {

    const welcomeScreen =
        document.getElementById(
            "welcomeScreen"
        );

    const openButton =
        document.getElementById(
            "openInvitationButton"
        );

    const audio =
        document.getElementById(
            "weddingMusic"
        );

    const musicControl =
        document.getElementById(
            "musicControl"
        );

    const musicIcon =
        document.getElementById(
            "musicIcon"
        );


    /* ==========================================
       VALIDAR BOTÓN PRINCIPAL
    ========================================== */

    if (
        !welcomeScreen ||
        !openButton
    ) {

        console.error(
            "No se encontró la pantalla o el botón de apertura."
        );

        return;

    }


    /* ==========================================
       CONFIGURAR AUDIO
    ========================================== */

    if (audio) {

        audio.volume =
            0.35;

    }


    /* ==========================================
       ABRIR INVITACIÓN
    ========================================== */

    openButton.addEventListener(

        "click",

        function () {

            /*
                IMPORTANTE:
                la invitación se abre aunque
                el audio falle.
            */

            welcomeScreen.classList.add(
                "hidden"
            );


            setTimeout(
                function () {

                    welcomeScreen.style.display =
                        "none";

                },
                750
            );


            /* ==================================
               INTENTAR REPRODUCIR MÚSICA
            ================================== */

            if (!audio) {

                return;

            }


            const playPromise =
                audio.play();


            if (
                playPromise !==
                undefined
            ) {

                playPromise

                    .then(
                        function () {

                            if (musicControl) {

                                musicControl.classList.add(
                                    "playing"
                                );

                                musicControl.classList.remove(
                                    "muted"
                                );

                            }


                            if (musicIcon) {

                                musicIcon.textContent =
                                    "♫";

                            }

                        }
                    )

                    .catch(
                        function (error) {

                            console.warn(
                                "La invitación se abrió, pero el audio no pudo reproducirse:",
                                error
                            );


                            if (musicControl) {

                                musicControl.classList.remove(
                                    "playing"
                                );

                                musicControl.classList.add(
                                    "muted"
                                );

                            }


                            if (musicIcon) {

                                musicIcon.textContent =
                                    "♪";

                            }

                        }
                    );

            }

        }

    );


    /* ==========================================
       BOTÓN FLOTANTE
    ========================================== */

    if (
        audio &&
        musicControl
    ) {

        musicControl.addEventListener(

            "click",

            function () {

                if (
                    audio.paused
                ) {

                    audio
                        .play()
                        .then(
                            function () {

                                musicControl.classList.add(
                                    "playing"
                                );

                                musicControl.classList.remove(
                                    "muted"
                                );


                                if (musicIcon) {

                                    musicIcon.textContent =
                                        "♫";

                                }

                            }
                        )
                        .catch(
                            function (error) {

                                console.warn(
                                    "No se pudo iniciar la música:",
                                    error
                                );

                            }
                        );


                    return;

                }


                audio.pause();


                musicControl.classList.remove(
                    "playing"
                );

                musicControl.classList.add(
                    "muted"
                );


                if (musicIcon) {

                    musicIcon.textContent =
                        "♪";

                }

            }

        );

    }


    console.log(
        "✅ Control de música cargado correctamente."
    );

})();