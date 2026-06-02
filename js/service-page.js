'use strict';

/* =========================================================
   SOLAK SERVICE PAGE JS
   Shared script for all 6 service detail pages:
   - related services carousel controls
   - service FAQ JSON-LD
   - reveal effects
   - card image fallback
   - accessibility helpers
========================================================= */

(function () {
    const doc = document;

    const DEFAULT_SERVICE_FAQ = [
        {
            question: 'Does SOLAK provide this solar service directly?',
            answer:
                'No. SOLAK is an independent comparison platform. It does not install, repair, maintain, or consult on solar projects directly.'
        },
        {
            question: 'Can I compare local provider options?',
            answer:
                'Yes. SOLAK helps users explore solar provider categories and request quote options from independent companies that may serve their area.'
        },
        {
            question: 'What should I verify before hiring a provider?',
            answer:
                'Users should verify licensing, insurance, warranties, service area, quote terms, equipment details, and project scope directly with any independent provider.'
        },
        {
            question: 'Can homeowners and businesses use SOLAK?',
            answer:
                'Yes. SOLAK includes solar comparison categories for residential and commercial interests, along with battery storage, maintenance, and consultation paths.'
        }
    ];

    const SERVICE_IMAGE_MAP = {
        'solar-panel-installation.html': 'assets/images/solar-panels-roof.jpg',
        'residential-solar.html': 'assets/images/residential-solar.jpg',
        'commercial-solar.html': 'assets/images/commercial-solar.jpg',
        'solar-battery-storage.html': 'assets/images/solar-battery.jpg',
        'solar-maintenance.html': 'assets/images/solar-maintenance.jpg',
        'solar-consultation.html': 'assets/images/solar-consultation.jpg'
    };

    function prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function connectRelatedCarouselControls() {
        const sections = doc.querySelectorAll('.related-services');

        sections.forEach((section) => {
            const carousel = section.querySelector('.related-services__carousel');
            if (!carousel) return;

            const externalPrev = section.querySelector('[data-related-carousel-prev]');
            const externalNext = section.querySelector('[data-related-carousel-next]');

            let internalPrev = carousel.querySelector('[data-carousel-prev]');
            let internalNext = carousel.querySelector('[data-carousel-next]');

            if (!internalPrev) {
                internalPrev = doc.createElement('button');
                internalPrev.type = 'button';
                internalPrev.hidden = true;
                internalPrev.setAttribute('data-carousel-prev', '');
                internalPrev.setAttribute('aria-label', 'Previous related service');
                carousel.appendChild(internalPrev);
            }

            if (!internalNext) {
                internalNext = doc.createElement('button');
                internalNext.type = 'button';
                internalNext.hidden = true;
                internalNext.setAttribute('data-carousel-next', '');
                internalNext.setAttribute('aria-label', 'Next related service');
                carousel.appendChild(internalNext);
            }

            if (externalPrev && internalPrev && externalPrev.dataset.bound !== 'true') {
                externalPrev.dataset.bound = 'true';
                externalPrev.addEventListener('click', () => {
                    internalPrev.click();
                });
            }

            if (externalNext && internalNext && externalNext.dataset.bound !== 'true') {
                externalNext.dataset.bound = 'true';
                externalNext.addEventListener('click', () => {
                    internalNext.click();
                });
            }
        });
    }

    function applyRelatedCardImages() {
        const cards = doc.querySelectorAll('.related-services__card');

        cards.forEach((card) => {
            const href = card.getAttribute('href');
            const image = SERVICE_IMAGE_MAP[href];

            if (!image || card.style.getPropertyValue('--card-image')) return;

            card.style.setProperty(
                '--card-image',
                `linear-gradient(180deg, rgba(3, 42, 90, 0.08), rgba(3, 42, 90, 0.9)), url("../${image}")`
            );
        });
    }

    function getServiceFaqFromPage() {
        if (Array.isArray(window.SOLAK_SERVICE_FAQ) && window.SOLAK_SERVICE_FAQ.length) {
            return window.SOLAK_SERVICE_FAQ;
        }

        const faqItems = Array.from(doc.querySelectorAll('.service-faq [data-faq-item]'));

        const parsed = faqItems.map((item) => {
            const question = item.querySelector('[data-faq-question] span:first-child');
            const answer = item.querySelector('[data-faq-answer] p');

            return {
                question: question ? question.textContent.trim() : '',
                answer: answer ? answer.textContent.trim() : ''
            };
        }).filter((item) => item.question && item.answer);

        return parsed.length ? parsed : DEFAULT_SERVICE_FAQ;
    }

    function addServiceFaqSchema() {
        if (typeof window.createFaqJsonLd !== 'function') return;

        const faq = getServiceFaqFromPage();
        window.createFaqJsonLd(faq, 'service-page-faq-jsonld');
    }

    function addRevealEffects() {
        const revealItems = doc.querySelectorAll(
            '.service-overview__content, .service-overview__panel, .service-compare-line, .service-factor, .service-photo-split__content, .service-photo-split__photo, .service-faq .faq-item'
        );

        if (!revealItems.length) return;

        if (!('IntersectionObserver' in window) || prefersReducedMotion()) {
            revealItems.forEach((item) => {
                item.classList.add('is-visible');
            });
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.14,
                rootMargin: '0px 0px -40px 0px'
            }
        );

        revealItems.forEach((item, index) => {
            item.classList.add('is-ready');
            item.style.setProperty('--reveal-delay', `${Math.min(index * 45, 260)}ms`);
            observer.observe(item);
        });
    }

    function addFocusHelpers() {
        const interactiveItems = doc.querySelectorAll(
            '.service-compare-line, .service-factor, .photo-card, .service-hero__chip'
        );

        interactiveItems.forEach((item) => {
            item.addEventListener('focusin', () => {
                item.classList.add('is-focused');
            });

            item.addEventListener('focusout', () => {
                item.classList.remove('is-focused');
            });
        });
    }

    function setCurrentServiceInRelated() {
        const currentPage = window.location.pathname.split('/').pop();

        const relatedLinks = doc.querySelectorAll('.related-services__card');

        relatedLinks.forEach((link) => {
            const href = link.getAttribute('href');

            if (href === currentPage) {
                link.setAttribute('aria-current', 'page');
                link.classList.add('is-current-service');
            }
        });
    }

    function addServicePageJsonLd() {
        const config = window.SITE_CONFIG;
        if (!config) return;

        const pageTitle = doc.querySelector('.service-hero__title')?.textContent.trim()
            || doc.querySelector('h1')?.textContent.trim()
            || 'Solar Provider Comparison';

        const description = doc.querySelector('.service-hero__text')?.textContent.trim()
            || 'Compare solar provider options through SOLAK.';

        const oldScript = doc.getElementById('service-page-jsonld');
        if (oldScript) oldScript.remove();

        const schema = {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: pageTitle,
            description,
            provider: {
                '@type': 'Organization',
                name: config.company?.name || 'SOLAK',
                email: config.contact?.email || 'hello@solaksolar.com',
                telephone: config.contact?.phoneRaw || '+18885550148'
            },
            about: 'Independent solar provider comparison',
            disambiguatingDescription:
                'SOLAK is an independent comparison platform and does not directly perform solar installation, repair, maintenance, or consultation services.'
        };

        const script = doc.createElement('script');
        script.type = 'application/ld+json';
        script.id = 'service-page-jsonld';
        script.textContent = JSON.stringify(schema);

        doc.head.appendChild(script);
    }

    function initServicePage() {
        connectRelatedCarouselControls();
        applyRelatedCardImages();
        addServiceFaqSchema();
        addServicePageJsonLd();
        // addRevealEffects();
        addFocusHelpers();
        setCurrentServiceInRelated();

        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }

    /*
       Runs before DOMContentLoaded carousel setup if possible.
       This ensures hidden internal buttons exist before main.js initializes carousels.
    */
    connectRelatedCarouselControls();

    if (doc.readyState === 'loading') {
        doc.addEventListener('DOMContentLoaded', initServicePage);
    } else {
        initServicePage();
    }
})();