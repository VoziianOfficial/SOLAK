'use strict';


(function () {
    const doc = document;

    const SERVICE_IMAGE_MAP = {
        'solar-panel-installation.html': 'assets/images/solar-panels-roof.jpg',
        'residential-solar.html': 'assets/images/residential-solar.jpg',
        'commercial-solar.html': 'assets/images/commercial-solar.jpg',
        'solar-battery-storage.html': 'assets/images/solar-battery.jpg',
        'solar-maintenance.html': 'assets/images/solar-maintenance.jpg',
        'solar-consultation.html': 'assets/images/solar-consultation.jpg'
    };

    function getReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function applyHomeServiceCardImages() {
        const cards = doc.querySelectorAll('.home-services__card');

        cards.forEach((card) => {
            const href = card.getAttribute('href');
            const image = SERVICE_IMAGE_MAP[href];

            if (!image) return;

            card.style.setProperty(
                '--card-image',
                `linear-gradient(180deg, rgba(3, 42, 90, 0.08), rgba(3, 42, 90, 0.9)), url("../${image}")`
            );
        });
    }

    function prepareExternalCarouselControls() {
        const carousels = doc.querySelectorAll('.home-services__carousel[data-carousel="global"]');

        carousels.forEach((carousel, index) => {
            if (carousel.dataset.homeControlsPrepared === 'true') return;

            const section = carousel.closest('.home-services');
            if (!section) return;

            const externalPrev = section.querySelector('.section-heading__actions [data-carousel-prev]');
            const externalNext = section.querySelector('.section-heading__actions [data-carousel-next]');

            if (!externalPrev || !externalNext) return;

            const internalPrev = doc.createElement('button');
            const internalNext = doc.createElement('button');

            internalPrev.type = 'button';
            internalNext.type = 'button';

            internalPrev.hidden = true;
            internalNext.hidden = true;

            internalPrev.setAttribute('data-carousel-prev', '');
            internalNext.setAttribute('data-carousel-next', '');

            internalPrev.setAttribute('aria-label', `Previous home service slide ${index + 1}`);
            internalNext.setAttribute('aria-label', `Next home service slide ${index + 1}`);

            carousel.appendChild(internalPrev);
            carousel.appendChild(internalNext);

            externalPrev.addEventListener('click', () => {
                internalPrev.click();
            });

            externalNext.addEventListener('click', () => {
                internalNext.click();
            });

            carousel.dataset.homeControlsPrepared = 'true';
        });
    }

    function improveHomeMarquee() {
        const marquee = doc.querySelector('.home-marquee');
        if (!marquee) return;

        const track = marquee.querySelector('.home-marquee__track');
        if (!track) return;

        const groups = track.querySelectorAll('.home-marquee__group');

        if (groups.length === 1) {
            const clone = groups[0].cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');

            clone.querySelectorAll('a, button').forEach((item) => {
                item.setAttribute('tabindex', '-1');
            });

            track.appendChild(clone);
        }

        if (getReducedMotion()) {
            track.style.animation = 'none';
        }

        marquee.addEventListener('focusin', () => {
            track.style.animationPlayState = 'paused';
        });

        marquee.addEventListener('focusout', () => {
            if (!getReducedMotion()) {
                track.style.animationPlayState = '';
            }
        });
    }

    function addHeroParallaxHint() {
        const hero = doc.querySelector('.home-hero');
        if (!hero || getReducedMotion()) return;

        let ticking = false;

        function updateHeroLight() {
            const scrollY = window.scrollY || window.pageYOffset;
            const offset = Math.min(scrollY * 0.08, 28);

            hero.style.backgroundPosition = `center calc(50% + ${offset}px)`;
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateHeroLight);
                ticking = true;
            }
        }, { passive: true });
    }

    function addOrbitKeyboardHint() {
        const nodes = doc.querySelectorAll('.home-orbit__node');

        nodes.forEach((node) => {
            node.addEventListener('focus', () => {
                node.classList.add('is-focused');
            });

            node.addEventListener('blur', () => {
                node.classList.remove('is-focused');
            });
        });
    }

    function addRoundBenefitsTouchSupport() {
        const list = doc.querySelector('.round-benefits__list');
        if (!list) return;

        let isDown = false;
        let startX = 0;
        let scrollLeft = 0;

        list.addEventListener('pointerdown', (event) => {
            if (window.innerWidth > 767) return;

            isDown = true;
            startX = event.pageX - list.offsetLeft;
            scrollLeft = list.scrollLeft;
            list.setPointerCapture(event.pointerId);
        });

        list.addEventListener('pointermove', (event) => {
            if (!isDown || window.innerWidth > 767) return;

            const x = event.pageX - list.offsetLeft;
            const walk = (x - startX) * 1.25;
            list.scrollLeft = scrollLeft - walk;
        });

        list.addEventListener('pointerup', (event) => {
            if (!isDown) return;

            isDown = false;

            try {
                list.releasePointerCapture(event.pointerId);
            } catch (error) {
            }
        });

        list.addEventListener('pointercancel', () => {
            isDown = false;
        });
    }

    function initHomePage() {
        applyHomeServiceCardImages();
        improveHomeMarquee();
        addHeroParallaxHint();
        addOrbitKeyboardHint();
        addRoundBenefitsTouchSupport();

        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }

        prepareExternalCarouselControls();

    if (doc.readyState === 'loading') {
        doc.addEventListener('DOMContentLoaded', initHomePage);
    } else {
        initHomePage();
    }
})();