'use strict';

/* =========================================================
   SOLAK LEGAL JS
   Legal pages:
   - active legal sidebar state
   - reveal effects
   - smooth anchor behavior
   - copy contact values
   - legal page JSON-LD
========================================================= */

(function () {
    const doc = document;

    function prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function setActiveLegalPageLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const links = doc.querySelectorAll('.legal-sidebar__links a');

        links.forEach((link) => {
            const href = link.getAttribute('href');

            if (href === currentPage) {
                link.classList.add('is-active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.classList.remove('is-active');
                link.removeAttribute('aria-current');
            }
        });
    }

    function addLegalRevealEffects() {
        const revealItems = doc.querySelectorAll(
            '.legal-sidebar__card, .legal-content, .legal-block, .legal-contact-box__item'
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
                threshold: 0.12,
                rootMargin: '0px 0px -40px 0px'
            }
        );

        revealItems.forEach((item, index) => {
            item.classList.add('is-ready');
            item.style.setProperty('--reveal-delay', `${Math.min(index * 35, 220)}ms`);
            observer.observe(item);
        });
    }

    function addSmoothLegalAnchors() {
        const links = doc.querySelectorAll('.legal-content a[href^="#"], .legal-sidebar a[href^="#"]');

        links.forEach((link) => {
            link.addEventListener('click', (event) => {
                const href = link.getAttribute('href');
                if (!href || href === '#') return;

                const target = doc.querySelector(href);
                if (!target) return;

                event.preventDefault();

                target.scrollIntoView({
                    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
                    block: 'start'
                });

                history.pushState(null, '', href);
            });
        });
    }

    function copyText(value) {
        if (!value) return Promise.reject();

        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(value);
        }

        const textarea = doc.createElement('textarea');
        textarea.value = value;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';

        doc.body.appendChild(textarea);
        textarea.select();

        const copied = doc.execCommand('copy');
        textarea.remove();

        return copied ? Promise.resolve() : Promise.reject();
    }

    function addCopySupportForLegalContacts() {
        const contactItems = doc.querySelectorAll('.legal-contact-box__item');

        contactItems.forEach((item) => {
            const valueElement = item.querySelector('a span, span[data-config], a');
            if (!valueElement) return;

            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'button');
            item.setAttribute('aria-label', 'Copy contact information');

            function handleCopy() {
                const value = valueElement.textContent.trim();
                if (!value) return;

                copyText(value)
                    .then(() => {
                        item.classList.add('is-copied');

                        window.setTimeout(() => {
                            item.classList.remove('is-copied');
                        }, 1200);
                    })
                    .catch(() => {
                        item.classList.add('is-copy-error');

                        window.setTimeout(() => {
                            item.classList.remove('is-copy-error');
                        }, 1200);
                    });
            }

            item.addEventListener('click', (event) => {
                const clickedLink = event.target.closest('a');

                if (clickedLink) return;

                handleCopy();
            });

            item.addEventListener('keydown', (event) => {
                if (event.key !== 'Enter' && event.key !== ' ') return;

                event.preventDefault();
                handleCopy();
            });
        });
    }

    function addLegalPageJsonLd() {
        const config = window.SITE_CONFIG;
        if (!config) return;

        const oldScript = doc.getElementById('legal-page-jsonld');
        if (oldScript) oldScript.remove();

        const title = doc.querySelector('h1')?.textContent.trim() || doc.title;
        const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';

        const schema = {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: title,
            description,
            publisher: {
                '@type': 'Organization',
                name: config.company?.name || 'SOLAK',
                email: config.contact?.email || 'hello@solaksolar.com',
                telephone: config.contact?.phoneRaw || '+18885550148',
                address: config.company?.address || '1846 Solar Ridge Avenue, Austin, TX 78701, USA'
            },
            about: 'Legal information for an independent solar provider comparison platform'
        };

        const script = doc.createElement('script');
        script.type = 'application/ld+json';
        script.id = 'legal-page-jsonld';
        script.textContent = JSON.stringify(schema);

        doc.head.appendChild(script);
    }

    function initLegalPage() {
        setActiveLegalPageLink();
        addLegalRevealEffects();
        addSmoothLegalAnchors();
        addCopySupportForLegalContacts();
        addLegalPageJsonLd();

        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }

    if (doc.readyState === 'loading') {
        doc.addEventListener('DOMContentLoaded', initLegalPage);
    } else {
        initLegalPage();
    }
})();