/* =========================================================
   ANIMACIONES AL HACER SCROLL
========================================================= */

const revealElements =
    document.querySelectorAll(
        ".reveal"
    );


const observer =
    new IntersectionObserver(

        entries => {

            entries.forEach(
                entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target
                            .classList
                            .add(
                                "active"
                            );


                        observer.unobserve(
                            entry.target
                        );

                    }

                }
            );

        },

        {

            threshold:
                0.25

        }

    );


revealElements.forEach(
    element => {

        observer.observe(
            element
        );

    }
);



/* =========================================================
   EFECTO ESCRITURA
========================================================= */

const typeElements =
    document.querySelectorAll(
        ".typewriter, .typewriter-title, .typewriter-large"
    );


const typeObserver =
    new IntersectionObserver(

        entries => {

            entries.forEach(
                entry => {

                    if (
                        !entry.isIntersecting
                    ) {
                        return;
                    }


                    typeText(
                        entry.target
                    );


                    typeObserver.unobserve(
                        entry.target
                    );

                }
            );

        },

        {
            threshold:
                0.5
        }

    );


typeElements.forEach(
    element => {

        typeObserver.observe(
            element
        );

    }
);



function typeText(
    element
) {

    const text =
        element.dataset.text || "";


    element.textContent =
        "";


    let index =
        0;


    const speed =
        element.classList.contains(
            "typewriter-large"
        )
            ? 55
            : 45;


    const interval =
        setInterval(
            () => {

                element.textContent +=
                    text.charAt(
                        index
                    );


                index++;


                if (
                    index >=
                    text.length
                ) {

                    clearInterval(
                        interval
                    );

                }

            },

            speed

        );

}



/* =========================================================
   MÚSICA
========================================================= */

const musicButton =
    document.getElementById(
        "musicButton"
    );


const backgroundMusic =
    document.getElementById(
        "backgroundMusic"
    );


let musicPlaying =
    false;


musicButton.addEventListener(
    "click",
    async () => {

        if (
            !musicPlaying
        ) {

            try {

                await backgroundMusic.play();

                musicPlaying =
                    true;

                musicButton.textContent =
                    "❚❚";

            } catch (error) {

                console.error(
                    "No se pudo reproducir la música:",
                    error
                );

            }

        }

        else {

            backgroundMusic.pause();

            musicPlaying =
                false;

            musicButton.textContent =
                "♫";

        }

    }
);