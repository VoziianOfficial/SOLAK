'use strict';

/* =========================================================
   SOLAK ABOUT JS
   About page enhancements:
   - marquee accessibility
   - reveal effects
   - values/focus helpers
   - organization JSON-LD
========================================================= */

(function () {
    const doc = document;

    function prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function improveAboutMarquee() {
        const marquee = doc.querySelector('.about-marquee');
        if (!marquee) return;

        const track = marquee.querySelector('.about-marquee__track');
        if (!track) return;

        const groups = track.querySelectorAll('.about-marquee__group');

        if (groups.length === 1) {
            const clone = groups[0].cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');

            clone.querySelectorAll('a, button').forEach((item) => {
                item.setAttribute('tabindex', '-1');
            });

            track.appendChild(clone);
        }

        if (prefersReducedMotion()) {
            track.style.animation = 'none';
        }

        marquee.addEventListener('focusin', () => {
            track.style.animationPlayState = 'paused';
        });

        marquee.addEventListener('focusout', () => {
            if (!prefersReducedMotion()) {
                track.style.animationPlayState = '';
            }
        });
    }

    function addRevealEffects() {
        const revealItems = doc.querySelectorAll(
            '.about-story__content, .about-story__visual, .about-why__item, .aggregator-model__step, .about-value'
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
                threshold: 0.16,
                rootMargin: '0px 0px -40px 0px'
            }
        );

        revealItems.forEach((item, index) => {
            item.classList.add('is-ready');
            item.style.setProperty('--reveal-delay', `${Math.min(index * 45, 240)}ms`);
            observer.observe(item);
        });
    }

    function addFocusHelpers() {
        const interactiveItems = doc.querySelectorAll(
            '.about-marquee__item, .about-value, .aggregator-model__step, .about-why__item'
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

    function addAboutJsonLd() {
        const config = window.SITE_CONFIG;
        if (!config) return;

        const oldScript = doc.getElementById('about-organization-jsonld');
        if (oldScript) oldScript.remove();

        const schema = {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: config.company?.name || 'SOLAK',
            description:
                config.footer?.description ||
                'SOLAK is an independent solar provider comparison platform.',
            email: config.contact?.email || 'hello@solaksolar.com',
            telephone: config.contact?.phoneRaw || '+18885550148',
            address: {
                '@type': 'PostalAddress',
                streetAddress: config.company?.address || '1846 Solar Ridge Avenue, Austin, TX 78701, USA',
                addressCountry: 'US'
            },
            areaServed: 'United States',
            knowsAbout: [
                'Solar provider comparison',
                'Residential solar',
                'Commercial solar',
                'Solar battery storage',
                'Solar maintenance',
                'Solar consultation'
            ],
            disambiguatingDescription:
                'SOLAK is an independent provider comparison platform and does not directly perform solar installation, repair, maintenance, or consultation services.'
        };

        const script = doc.createElement('script');
        script.type = 'application/ld+json';
        script.id = 'about-organization-jsonld';
        script.textContent = JSON.stringify(schema);

        doc.head.appendChild(script);
    }

    function addSmallParallax() {
        const visual = doc.querySelector('.about-story__visual');
        if (!visual || prefersReducedMotion()) return;

        let ticking = false;

        function update() {
            const rect = visual.getBoundingClientRect();
            const windowHeight = window.innerHeight || 1;
            const progress = 1 - Math.min(Math.max(rect.top / windowHeight, 0), 1);
            const offset = progress * 12;

            visual.style.setProperty('--about-visual-offset', `${offset}px`);
            ticking = false;
        }

        window.addEventListener(
            'scroll',
            () => {
                if (!ticking) {
                    window.requestAnimationFrame(update);
                    ticking = true;
                }
            },
            { passive: true }
        );

        update();
    }

    function initAboutPage() {
        improveAboutMarquee();
        // addRevealEffects();
        addFocusHelpers();
        addAboutJsonLd();
        addSmallParallax();

        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }

    if (doc.readyState === 'loading') {
        doc.addEventListener('DOMContentLoaded', initAboutPage);
    } else {
        initAboutPage();
    }
})();