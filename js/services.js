'use strict';

/* =========================================================
   SOLAK SERVICES JS
   Services page enhancements:
   - external carousel buttons
   - FAQ JSON-LD
   - small accessibility helpers
========================================================= */

(function () {
    const doc = document;

    const SERVICES_FAQ = [
        {
            question: 'How do I compare local solar providers?',
            answer:
                'Start by choosing a solar category, reviewing comparison factors, and requesting quote options. Independent providers may then respond with information about coverage, scope, and next steps.'
        },
        {
            question: 'Are quotes from providers usually free?',
            answer:
                'Many solar providers offer quote discussions at no upfront cost, but terms can vary. Users should confirm quote details directly with any provider they contact.'
        },
        {
            question: 'Can I compare battery storage options?',
            answer:
                'Yes. SOLAK includes solar battery storage as a comparison category so users can explore backup energy goals, battery compatibility, and provider support options.'
        },
        {
            question: 'Are commercial solar options included?',
            answer:
                'Yes. Businesses can review commercial solar categories and compare provider options based on property type, usage goals, coverage, and quote paths.'
        },
        {
            question: 'How do I know if a provider serves my area?',
            answer:
                'Provider coverage can vary by location. Users should confirm service area, licensing, insurance, and project suitability directly with any independent provider before hiring.'
        }
    ];

    function connectServicesCarouselControls() {
        const section = doc.querySelector('.services-page-swiper');
        if (!section) return;

        const carousel = section.querySelector('.services-page-swiper__carousel');
        if (!carousel) return;

        const externalPrev = section.querySelector('[data-services-carousel-prev]');
        const externalNext = section.querySelector('[data-services-carousel-next]');

        const internalPrev = carousel.querySelector('[data-carousel-prev]');
        const internalNext = carousel.querySelector('[data-carousel-next]');

        if (externalPrev && internalPrev) {
            externalPrev.addEventListener('click', () => {
                internalPrev.click();
            });
        }

        if (externalNext && internalNext) {
            externalNext.addEventListener('click', () => {
                internalNext.click();
            });
        }
    }

    function enhanceServiceCards() {
        const cards = doc.querySelectorAll('.services-grid__card, .services-page-swiper__card');

        cards.forEach((card) => {
            card.addEventListener('mouseenter', () => {
                card.classList.add('is-hovered');
            });

            card.addEventListener('mouseleave', () => {
                card.classList.remove('is-hovered');
            });

            card.addEventListener('focus', () => {
                card.classList.add('is-hovered');
            });

            card.addEventListener('blur', () => {
                card.classList.remove('is-hovered');
            });
        });
    }

    function addServicesFaqSchema() {
        if (typeof window.createFaqJsonLd !== 'function') return;

        window.createFaqJsonLd(SERVICES_FAQ, 'services-faq-jsonld');
    }

    function addLineRevealClass() {
        const lineItems = doc.querySelectorAll('.provider-factor, .services-process__step');

        if (!('IntersectionObserver' in window)) {
            lineItems.forEach((item) => item.classList.add('is-visible'));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.18
            }
        );

        lineItems.forEach((item) => {
            item.classList.add('is-ready');
            observer.observe(item);
        });
    }

    function initServicesPage() {
        connectServicesCarouselControls();
        enhanceServiceCards();
        addServicesFaqSchema();
        // addLineRevealClass();

        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }

    if (doc.readyState === 'loading') {
        doc.addEventListener('DOMContentLoaded', initServicesPage);
    } else {
        initServicesPage();
    }
})();