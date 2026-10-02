const c = SITE_CONFIG;
document
    .querySelectorAll("[data-key]")
    .forEach((e) => (e.textContent = c[e.dataset.key] || ""));
document.querySelectorAll("[data-link]").forEach((e) => {
    const k = e.dataset.link;
    e.href = k === "phone" ? "tel:" + c.phoneHref : c[k];
});
hours.textContent = c.hours.join("\n");
year.textContent = new Date().getFullYear();
document.querySelector(".menu").onclick = () =>
    document.querySelector("nav").classList.toggle("open");
document
    .querySelectorAll("nav a")
    .forEach(
        (a) =>
        (a.onclick = () =>
            document.querySelector("nav").classList.remove("open")),
    );
addEventListener("scroll", () =>
    document.querySelector("header").classList.toggle("stick", scrollY > 40),
);
const io = new IntersectionObserver(
    (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("show")),
    { threshold: 0.12 },
);
document.querySelectorAll(".reveal").forEach((e) => io.observe(e));

document.addEventListener("DOMContentLoaded", () => {

    const carousel =
        document.querySelector(".jewelry-carousel");

    if (!carousel) return;


    const slides =
        Array.from(
            carousel.querySelectorAll(".jewelry-slide")
        );


    const prev =
        carousel.querySelector(".jewelry-prev");

    const next =
        carousel.querySelector(".jewelry-next");

    const current =
        carousel.querySelector(".jewelry-current");

    const total =
        carousel.querySelector(".jewelry-total");


    const numberOfSlides = slides.length;

    let activeIndex = 0;

    let autoplay;


    total.textContent =
        String(numberOfSlides).padStart(2, "0");


    /*
     * Restituisce l'indice corretto
     * anche quando andiamo oltre
     * l'inizio o la fine.
     */

    function normalize(index) {

        return (
            (index % numberOfSlides) +
            numberOfSlides
        ) % numberOfSlides;

    }


    /*
     * Aggiorna le tre posizioni.
     */

    function render() {

        const centerIndex =
            normalize(activeIndex);

        const leftIndex =
            normalize(activeIndex - 1);

        const rightIndex =
            normalize(activeIndex + 1);


        slides.forEach((slide, index) => {

            slide.classList.remove(
                "position-left",
                "position-center",
                "position-right"
            );


            if (index === centerIndex) {

                slide.classList.add(
                    "position-center"
                );

            }

            else if (index === leftIndex) {

                slide.classList.add(
                    "position-left"
                );

            }

            else if (index === rightIndex) {

                slide.classList.add(
                    "position-right"
                );

            }

        });


        current.textContent =
            String(centerIndex + 1)
                .padStart(2, "0");

    }


    /*
     * Vai alla prossima immagine.
     */

    function nextSlide() {

        activeIndex++;

        render();

        restartAutoplay();

    }


    /*
     * Vai alla precedente.
     */

    function previousSlide() {

        activeIndex--;

        render();

        restartAutoplay();

    }


    /*
     * Autoplay
     */

    function startAutoplay() {

        clearInterval(autoplay);

        autoplay =
            setInterval(() => {

                activeIndex++;

                render();

            }, 4200);

    }


    function restartAutoplay() {

        startAutoplay();

    }


    /*
     * Pulsanti
     */

    next.addEventListener(
        "click",
        nextSlide
    );


    prev.addEventListener(
        "click",
        previousSlide
    );


    /*
     * Quando il mouse è sopra,
     * fermiamo il movimento.
     */

    carousel.addEventListener(
        "mouseenter",
        () => {
            clearInterval(autoplay);
        }
    );


    carousel.addEventListener(
        "mouseleave",
        () => {
            startAutoplay();
        }
    );


    /*
     * TOUCH / SWIPE
     */

    let touchStartX = 0;


    carousel.addEventListener(
        "touchstart",
        event => {

            touchStartX =
                event.touches[0].clientX;

            clearInterval(autoplay);

        },
        { passive: true }
    );


    carousel.addEventListener(
        "touchend",
        event => {

            const touchEndX =
                event.changedTouches[0].clientX;

            const distance =
                touchStartX - touchEndX;


            if (Math.abs(distance) > 50) {

                if (distance > 0) {

                    activeIndex++;

                } else {

                    activeIndex--;

                }

                render();

            }


            startAutoplay();

        },
        { passive: true }
    );


    /*
     * Ridimensionamento
     */

    window.addEventListener(
        "resize",
        render
    );


    /*
     * Avvio
     */

    render();

    startAutoplay();

});

document.addEventListener("DOMContentLoaded", () => {

    const items = [...document.querySelectorAll(".gallery-item")];
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = lightbox.querySelector(".lightbox-image");

    const closeBtn = lightbox.querySelector(".lightbox-close");
    const prevBtn = lightbox.querySelector(".lightbox-prev");
    const nextBtn = lightbox.querySelector(".lightbox-next");

    let currentIndex = 0;


    function openLightbox(index) {

        currentIndex = index;

        const item = items[currentIndex];
        const img = item.querySelector("img");

        lightboxImage.src = item.dataset.full || img.src;
        lightboxImage.alt = img.alt;

        lightbox.classList.add("active");
        lightbox.setAttribute("aria-hidden", "false");

        document.body.style.overflow = "hidden";
    }


    function closeLightbox() {

        lightbox.classList.remove("active");
        lightbox.setAttribute("aria-hidden", "true");

        document.body.style.overflow = "";

        setTimeout(() => {
            if (!lightbox.classList.contains("active")) {
                lightboxImage.src = "";
            }
        }, 300);
    }


    function showImage(index) {

        currentIndex = (index + items.length) % items.length;

        const item = items[currentIndex];
        const img = item.querySelector("img");

        lightboxImage.src = item.dataset.full || img.src;
        lightboxImage.alt = img.alt;
    }


    /* apertura */

    items.forEach((item, index) => {

        item.addEventListener("click", () => {
            openLightbox(index);
        });

    });


    /* precedente */

    prevBtn.addEventListener("click", (event) => {

        event.stopPropagation();

        showImage(currentIndex - 1);

    });


    /* successiva */

    nextBtn.addEventListener("click", (event) => {

        event.stopPropagation();

        showImage(currentIndex + 1);

    });


    /* chiudi */

    closeBtn.addEventListener("click", (event) => {

        event.stopPropagation();

        closeLightbox();

    });


    /* click sullo sfondo */

    lightbox.addEventListener("click", (event) => {

        if (event.target === lightbox) {
            closeLightbox();
        }

    });


    /* tastiera */

    document.addEventListener("keydown", (event) => {

        if (!lightbox.classList.contains("active")) return;

        if (event.key === "Escape") {
            closeLightbox();
        }

        if (event.key === "ArrowLeft") {
            showImage(currentIndex - 1);
        }

        if (event.key === "ArrowRight") {
            showImage(currentIndex + 1);
        }

    });


    /* swipe mobile */

    let touchStartX = 0;

    lightbox.addEventListener("touchstart", (event) => {

        touchStartX = event.changedTouches[0].screenX;

    }, { passive: true });


    lightbox.addEventListener("touchend", (event) => {

        const touchEndX = event.changedTouches[0].screenX;
        const difference = touchStartX - touchEndX;

        if (Math.abs(difference) < 50) return;

        if (difference > 0) {
            showImage(currentIndex + 1);
        } else {
            showImage(currentIndex - 1);
        }

    }, { passive: true });

});
