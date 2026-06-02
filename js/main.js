'use strict';

/* =========================================================
   SOLAK MAIN JS
   Global config injection, header interactions, mobile menu,
   dropdown delay, FAQ lines, cookie banner, reusable carousel.
========================================================= */

(function () {
    const doc = document;
    const body = doc.body;

    const SELECTORS = {
        mobileMenu: '[data-mobile-menu]',
        mobileMenuPanel: '[data-mobile-menu-panel]',
        mobileMenuOpen: '[data-mobile-menu-open]',
        mobileMenuClose: '[data-mobile-menu-close]',
        servicesMenu: '[data-services-menu]',
        servicesDropdown: '[data-services-dropdown]',
        faqItem: '[data-faq-item]',
        faqQuestion: '[data-faq-question]',
        faqAnswer: '[data-faq-answer]',
        cookieBanner: '[data-cookie-banner]',
        cookieAccept: '[data-cookie-accept]',
        cookieDecline: '[data-cookie-decline]'
    };

    const COOKIE_STORAGE_KEY = 'solak_cookie_choice';

    function getConfigValue(path) {
        if (!path || !window.SITE_CONFIG) return '';

        return path.split('.').reduce((current, key) => {
            if (current && Object.prototype.hasOwnProperty.call(current, key)) {
                return current[key];
            }

            return '';
        }, window.SITE_CONFIG);
    }

    function normalizeTel(value) {
        return String(value || '').replace(/[^\d+]/g, '');
    }

    function setTextFromConfig() {
        const textNodes = doc.querySelectorAll('[data-config]');

        textNodes.forEach((node) => {
            const value = getConfigValue(node.dataset.config);

            if (value !== undefined && value !== null) {
                node.textContent = value;
            }
        });
    }

    function setHtmlFromConfig() {
        const htmlNodes = doc.querySelectorAll('[data-config-html]');

        htmlNodes.forEach((node) => {
            const value = getConfigValue(node.dataset.configHtml);

            if (value !== undefined && value !== null) {
                node.innerHTML = value;
            }
        });
    }

    function setHrefFromConfig() {
        const hrefNodes = doc.querySelectorAll('[data-config-href]');

        hrefNodes.forEach((node) => {
            const value = getConfigValue(node.dataset.configHref);

            if (!value) return;

            const normalized = normalizeTel(value);
            node.setAttribute('href', `tel:${normalized}`);

            if (!node.getAttribute('aria-label')) {
                const display = getConfigValue('contact.phoneDisplay') || normalized;
                node.setAttribute('aria-label', `Call ${display}`);
            }
        });
    }

    function setMailtoFromConfig() {
        const mailNodes = doc.querySelectorAll('[data-config-mailto]');

        mailNodes.forEach((node) => {
            const value = getConfigValue(node.dataset.configMailto);

            if (!value) return;

            node.setAttribute('href', `mailto:${value}`);

            if (!node.getAttribute('aria-label')) {
                node.setAttribute('aria-label', `Email ${value}`);
            }
        });
    }

    function setUrlFromConfig() {
        const urlNodes = doc.querySelectorAll('[data-config-url]');

        urlNodes.forEach((node) => {
            const value = getConfigValue(node.dataset.configUrl);

            if (value) {
                node.setAttribute('href', value);
            }
        });
    }

    function setAriaFromConfig() {
        const ariaNodes = doc.querySelectorAll('[data-config-aria]');

        ariaNodes.forEach((node) => {
            const value = getConfigValue(node.dataset.configAria);

            if (value) {
                node.setAttribute('aria-label', value);
            }
        });
    }

    function setPlaceholderFromConfig() {
        const placeholderNodes = doc.querySelectorAll('[data-config-placeholder]');

        placeholderNodes.forEach((node) => {
            const value = getConfigValue(node.dataset.configPlaceholder);

            if (value) {
                node.setAttribute('placeholder', value);
            }
        });
    }

    function setValueFromConfig() {
        const valueNodes = doc.querySelectorAll('[data-config-value]');

        valueNodes.forEach((node) => {
            const value = getConfigValue(node.dataset.configValue);

            if (value) {
                node.setAttribute('value', value);
            }
        });
    }

    function setCurrentYear() {
        const yearNodes = doc.querySelectorAll('[data-current-year]');
        const year = new Date().getFullYear();

        yearNodes.forEach((node) => {
            node.textContent = year;
        });
    }

    function renderLogo() {
        const config = window.SITE_CONFIG;
        if (!config || !config.logo) return;

        const fullLogoTargets = doc.querySelectorAll('[data-site-logo]');
        const iconTargets = doc.querySelectorAll('[data-logo-icon]');
        const textTargets = doc.querySelectorAll('[data-logo-text]');

        fullLogoTargets.forEach((target) => {
            target.innerHTML = `
                <span class="site-logo__icon" aria-hidden="true">${config.logo.svg}</span>
                <span class="site-logo__text">${config.logo.label}</span>
            `;
        });

        iconTargets.forEach((target) => {
            target.innerHTML = config.logo.svg;
        });

        textTargets.forEach((target) => {
            target.textContent = config.logo.label;
        });
    }

    function createIconSvg(name) {
        const icons = {
            panel: `
                <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
                    <path d="M10 14h24l4 20H6l4-20Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                    <path d="M15 14l-2 20M24 14v20M33 14l2 20M8 24h28" stroke="currentColor" stroke-width="2"/>
                    <path d="M24 34v7M15 41h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M37 6v5M37 18v3M29 14h-3M45 14h-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            `,
            home: `
                <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
                    <path d="M8 24 24 10l16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M13 22v18h22V22" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                    <path d="M20 40V28h8v12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                    <path d="M29 13h8v8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            `,
            building: `
                <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
                    <path d="M10 42V12h16v30M26 22h12v20" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                    <path d="M15 18h5M15 25h5M15 32h5M30 28h4M30 34h4M7 42h34" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            `,
            battery: `
                <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
                    <path d="M17 8h14v5h4v29H13V13h4V8Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                    <path d="m25 18-6 10h6l-3 9 8-12h-6l1-7Z" fill="currentColor"/>
                </svg>
            `,
            maintenance: `
                <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
                    <path d="m30 10 8 8-7 7-8-8 7-7Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                    <path d="M24 18 9 33a5 5 0 0 0 7 7l15-15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="m11 37 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            `,
            consultation: `
                <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
                    <path d="M10 12h28v18H22l-8 7v-7h-4V12Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                    <path d="M17 20h14M17 25h9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <circle cx="36" cy="35" r="5" stroke="currentColor" stroke-width="2"/>
                    <path d="m40 39 4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            `,
            quote: `
                <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
                    <path d="M14 8h16l8 8v24H14V8Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                    <path d="M30 8v9h8" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                    <path d="M20 24h11M20 30h11M20 36h7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            `,
            location: `
                <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
                    <path d="M24 43s14-13 14-25a14 14 0 1 0-28 0c0 12 14 25 14 25Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                    <circle cx="24" cy="18" r="5" stroke="currentColor" stroke-width="2"/>
                </svg>
            `
        };

        return icons[name] || icons.panel;
    }

    function renderServiceLinks() {
        const config = window.SITE_CONFIG;
        if (!config || !Array.isArray(config.services)) return;

        const dropdownTargets = doc.querySelectorAll('[data-dropdown-services]');
        const mobileTargets = doc.querySelectorAll('[data-mobile-services]');
        const footerTargets = doc.querySelectorAll('[data-footer-services]');
        const serviceListTargets = doc.querySelectorAll('[data-services-list]');
        const serviceOptionsTargets = doc.querySelectorAll('[data-service-options]');

        dropdownTargets.forEach((target) => {
            target.innerHTML = config.services.map((service) => `
                <a class="services-dropdown__link" href="${service.url}">
                    ${service.title}
                </a>
            `).join('') + `
                <a class="services-dropdown__link services-dropdown__all" href="services.html">
                    ${config.cta.allServices || 'View All Services'}
                </a>
            `;
        });

        mobileTargets.forEach((target) => {
            target.innerHTML = config.services.map((service) => `
                <a class="mobile-menu__service" href="${service.url}">
                    ${service.title}
                </a>
            `).join('');
        });

        footerTargets.forEach((target) => {
            target.innerHTML = config.services.map((service) => `
                <li>
                    <a href="${service.url}">${service.title}</a>
                </li>
            `).join('');
        });

        serviceListTargets.forEach((target) => {
            target.innerHTML = config.services.map((service) => `
                <a class="service-mini-link" href="${service.url}">
                    <span class="service-mini-link__icon">${createIconSvg(service.icon)}</span>
                    <span>${service.title}</span>
                </a>
            `).join('');
        });

        serviceOptionsTargets.forEach((target) => {
            const placeholder = target.getAttribute('data-placeholder') || 'Select solar interest';

            target.innerHTML = `
                <option value="">${placeholder}</option>
                ${config.services.map((service) => `
                    <option value="${service.title}">${service.title}</option>
                `).join('')}
            `;
        });
    }

    function renderLegalLinks() {
        const config = window.SITE_CONFIG;
        if (!config || !Array.isArray(config.legal)) return;

        const footerTargets = doc.querySelectorAll('[data-footer-legal]');
        const cookieTargets = doc.querySelectorAll('[data-cookie-legal]');

        footerTargets.forEach((target) => {
            target.innerHTML = config.legal.map((item) => `
                <li>
                    <a href="${item.url}">${item.title}</a>
                </li>
            `).join('');
        });

        cookieTargets.forEach((target) => {
            target.innerHTML = config.legal.map((item) => `
                <a href="${item.url}">${item.title}</a>
            `).join('');
        });
    }

    function applySiteConfig() {
        setTextFromConfig();
        setHtmlFromConfig();
        setHrefFromConfig();
        setMailtoFromConfig();
        setUrlFromConfig();
        setAriaFromConfig();
        setPlaceholderFromConfig();
        setValueFromConfig();
        setCurrentYear();
        renderLogo();
        renderServiceLinks();
        renderLegalLinks();
    }

    function initLucideIcons() {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }

    function initActiveNavigation() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const links = doc.querySelectorAll('.site-nav__link, .mobile-menu__link, .site-footer__links a');

        links.forEach((link) => {
            const href = link.getAttribute('href');

            if (!href) return;

            const linkPage = href.split('#')[0];

            if (linkPage === currentPage) {
                link.classList.add('is-active');

                if (link.classList.contains('site-nav__link')) {
                    link.setAttribute('aria-current', 'page');
                }
            }
        });

        const servicePages = [
            'solar-panel-installation.html',
            'residential-solar.html',
            'commercial-solar.html',
            'solar-battery-storage.html',
            'solar-maintenance.html',
            'solar-consultation.html'
        ];

        if (servicePages.includes(currentPage)) {
            const serviceNav = doc.querySelector('[data-services-nav-button]');

            if (serviceNav) {
                serviceNav.classList.add('is-active');
                serviceNav.setAttribute('aria-current', 'page');
            }
        }
    }

    function initMobileMenu() {
        const menu = doc.querySelector(SELECTORS.mobileMenu);
        const panel = doc.querySelector(SELECTORS.mobileMenuPanel);
        const openButtons = doc.querySelectorAll(SELECTORS.mobileMenuOpen);
        const closeButtons = doc.querySelectorAll(SELECTORS.mobileMenuClose);

        if (!menu || !panel || !openButtons.length) return;

        let lastFocusedElement = null;

        function openMenu() {
            lastFocusedElement = doc.activeElement;

            menu.classList.add('is-open');
            body.classList.add('menu-open');

            openButtons.forEach((button) => {
                button.setAttribute('aria-expanded', 'true');
            });

            const closeButton = menu.querySelector(SELECTORS.mobileMenuClose);
            if (closeButton) {
                closeButton.focus({ preventScroll: true });
            }
        }

        function closeMenu() {
            menu.classList.remove('is-open');
            body.classList.remove('menu-open');

            openButtons.forEach((button) => {
                button.setAttribute('aria-expanded', 'false');
            });

            if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
                lastFocusedElement.focus({ preventScroll: true });
            }
        }

        openButtons.forEach((button) => {
            button.addEventListener('click', openMenu);
        });

        closeButtons.forEach((button) => {
            button.addEventListener('click', closeMenu);
        });

        menu.addEventListener('click', (event) => {
            if (!panel.contains(event.target)) {
                closeMenu();
            }
        });

        menu.addEventListener('click', (event) => {
            const link = event.target.closest('a');

            if (link) {
                closeMenu();
            }
        });

        doc.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && menu.classList.contains('is-open')) {
                closeMenu();
            }
        });
    }

    function initServicesDropdown() {
        const menus = doc.querySelectorAll(SELECTORS.servicesMenu);

        menus.forEach((menu) => {
            const dropdown = menu.querySelector(SELECTORS.servicesDropdown);
            const button = menu.querySelector('[data-services-nav-button]');
            let closeTimer = null;

            if (!dropdown || !button) return;

            function openDropdown() {
                window.clearTimeout(closeTimer);
                dropdown.classList.add('is-open');
                button.setAttribute('aria-expanded', 'true');
            }

            function closeDropdown() {
                closeTimer = window.setTimeout(() => {
                    dropdown.classList.remove('is-open');
                    button.setAttribute('aria-expanded', 'false');
                }, 220);
            }

            menu.addEventListener('pointerenter', openDropdown);
            menu.addEventListener('pointerleave', closeDropdown);

            menu.addEventListener('focusin', openDropdown);
            menu.addEventListener('focusout', (event) => {
                if (!menu.contains(event.relatedTarget)) {
                    closeDropdown();
                }
            });

            button.addEventListener('keydown', (event) => {
                if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    openDropdown();

                    const firstLink = dropdown.querySelector('a');
                    if (firstLink) firstLink.focus();
                }

                if (event.key === 'Escape') {
                    dropdown.classList.remove('is-open');
                    button.setAttribute('aria-expanded', 'false');
                    button.focus();
                }
            });

            dropdown.addEventListener('keydown', (event) => {
                if (event.key === 'Escape') {
                    dropdown.classList.remove('is-open');
                    button.setAttribute('aria-expanded', 'false');
                    button.focus();
                }
            });
        });
    }

    function initFaqAccordions(scope = doc) {
        const items = scope.querySelectorAll(SELECTORS.faqItem);

        items.forEach((item) => {
            const question = item.querySelector(SELECTORS.faqQuestion);
            const answer = item.querySelector(SELECTORS.faqAnswer);

            if (!question || !answer) return;

            const isOpen = question.getAttribute('aria-expanded') === 'true';

            question.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

            if (isOpen) {
                answer.classList.add('is-open');
            } else {
                answer.classList.remove('is-open');
            }

            question.addEventListener('click', () => {
                const expanded = question.getAttribute('aria-expanded') === 'true';

                question.setAttribute('aria-expanded', expanded ? 'false' : 'true');
                answer.classList.toggle('is-open', !expanded);
            });
        });
    }

    function createCookieBanner() {
        const existing = doc.querySelector(SELECTORS.cookieBanner);

        if (existing) return existing;

        const banner = doc.createElement('aside');
        banner.className = 'cookie-banner';
        banner.setAttribute('data-cookie-banner', '');
        banner.setAttribute('aria-label', 'Cookie consent');

        banner.innerHTML = `
            <div class="cookie-banner__inner">
                <div class="cookie-banner__content">
                    <h2>Cookie preferences</h2>
                    <p>
                        SOLAK uses essential browser storage to remember your cookie choice and improve the website experience.
                    </p>
                    <div class="cookie-banner__links" data-cookie-legal>
                        <a href="privacy-policy.html">Privacy Policy</a>
                        <a href="cookie-policy.html">Cookie Policy</a>
                        <a href="terms-of-service.html">Terms of Service</a>
                    </div>
                </div>

                <div class="cookie-banner__actions">
                    <button class="btn btn--light btn--small" type="button" data-cookie-decline>
                        Decline
                    </button>
                    <button class="btn btn--primary btn--small" type="button" data-cookie-accept>
                        Accept
                    </button>
                </div>
            </div>
        `;

        body.appendChild(banner);
        return banner;
    }

    function initCookieBanner() {
        const banner = createCookieBanner();
        const acceptButton = banner.querySelector(SELECTORS.cookieAccept);
        const declineButton = banner.querySelector(SELECTORS.cookieDecline);
        const savedChoice = localStorage.getItem(COOKIE_STORAGE_KEY);

        if (!savedChoice) {
            window.setTimeout(() => {
                banner.classList.add('is-visible');
            }, 650);
        }

        function saveChoice(choice) {
            localStorage.setItem(COOKIE_STORAGE_KEY, choice);
            banner.classList.remove('is-visible');
        }

        if (acceptButton) {
            acceptButton.addEventListener('click', () => saveChoice('accepted'));
        }

        if (declineButton) {
            declineButton.addEventListener('click', () => saveChoice('declined'));
        }
    }

    function createFaqJsonLd(items, id = 'faq-jsonld') {
        if (!items || !items.length) return;

        const oldScript = doc.getElementById(id);
        if (oldScript) oldScript.remove();

        const schema = {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: items.map((item) => ({
                '@type': 'Question',
                name: item.question,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: item.answer
                }
            }))
        };

        const script = doc.createElement('script');
        script.type = 'application/ld+json';
        script.id = id;
        script.textContent = JSON.stringify(schema);

        doc.head.appendChild(script);
    }

    class SolakCarousel {
        constructor(root, options = {}) {
            this.root = root;
            this.track = root.querySelector('[data-carousel-track]');
            this.slides = Array.from(root.querySelectorAll('[data-carousel-slide]'));
            this.prev = root.querySelector('[data-carousel-prev]');
            this.next = root.querySelector('[data-carousel-next]');
            this.pagination = root.querySelector('[data-carousel-pagination]');

            this.options = {
                loop: options.loop !== false,
                autoplay: options.autoplay || false,
                autoplayDelay: options.autoplayDelay || 5500,
                drag: options.drag !== false
            };

            this.index = 0;
            this.perView = 1;
            this.maxIndex = 0;
            this.slideStep = 0;
            this.isDragging = false;
            this.startX = 0;
            this.currentX = 0;
            this.dragOffset = 0;
            this.autoplayTimer = null;

            if (!this.root || !this.track || !this.slides.length) return;

            this.init();
        }

        init() {
            this.updateLayout();
            this.createPagination();
            this.bindEvents();
            this.goTo(0, false);

            if (this.options.autoplay) {
                this.startAutoplay();
            }
        }

        updateLayout() {
            const width = window.innerWidth;

            if (width >= 1024) {
                this.perView = 3;
            } else if (width >= 768) {
                this.perView = 2;
            } else {
                this.perView = 1;
            }

            this.maxIndex = Math.max(0, this.slides.length - this.perView);
            this.slideStep = this.slides[0].getBoundingClientRect().width + this.getGap();

            if (this.index > this.maxIndex) {
                this.index = this.maxIndex;
            }

            this.update();
            this.updatePagination();
        }

        getGap() {
            const styles = window.getComputedStyle(this.track);
            const gap = parseFloat(styles.columnGap || styles.gap || '0');

            return Number.isFinite(gap) ? gap : 0;
        }

        createPagination() {
            if (!this.pagination) return;

            const dotsCount = this.maxIndex + 1;

            this.pagination.innerHTML = '';

            for (let i = 0; i < dotsCount; i += 1) {
                const dot = doc.createElement('button');
                dot.type = 'button';
                dot.className = 'swiper-pagination__dot';
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                dot.addEventListener('click', () => this.goTo(i));

                this.pagination.appendChild(dot);
            }

            this.updatePagination();
        }

        bindEvents() {
            if (this.prev) {
                this.prev.addEventListener('click', () => this.goPrev());
            }

            if (this.next) {
                this.next.addEventListener('click', () => this.goNext());
            }

            window.addEventListener('resize', this.debounce(() => {
                this.updateLayout();
                this.createPagination();
            }, 160));

            this.root.addEventListener('mouseenter', () => this.stopAutoplay());
            this.root.addEventListener('mouseleave', () => this.startAutoplay());

            if (this.options.drag) {
                this.bindDrag();
            }
        }

        bindDrag() {
            this.track.addEventListener('pointerdown', (event) => {
                this.isDragging = true;
                this.startX = event.clientX;
                this.currentX = event.clientX;
                this.dragOffset = 0;
                this.track.setPointerCapture(event.pointerId);
                this.track.style.transition = 'none';
                this.stopAutoplay();
            });

            this.track.addEventListener('pointermove', (event) => {
                if (!this.isDragging) return;

                this.currentX = event.clientX;
                this.dragOffset = this.currentX - this.startX;
                this.update();
            });

            this.track.addEventListener('pointerup', (event) => {
                if (!this.isDragging) return;

                this.isDragging = false;
                this.track.releasePointerCapture(event.pointerId);
                this.track.style.transition = '';

                if (Math.abs(this.dragOffset) > 60) {
                    if (this.dragOffset < 0) {
                        this.goNext();
                    } else {
                        this.goPrev();
                    }
                } else {
                    this.update();
                }

                this.dragOffset = 0;
                this.startAutoplay();
            });

            this.track.addEventListener('pointercancel', () => {
                this.isDragging = false;
                this.track.style.transition = '';
                this.dragOffset = 0;
                this.update();
                this.startAutoplay();
            });
        }

        goPrev() {
            if (this.index <= 0) {
                this.goTo(this.options.loop ? this.maxIndex : 0);
                return;
            }

            this.goTo(this.index - 1);
        }

        goNext() {
            if (this.index >= this.maxIndex) {
                this.goTo(this.options.loop ? 0 : this.maxIndex);
                return;
            }

            this.goTo(this.index + 1);
        }

        goTo(index, animate = true) {
            const nextIndex = Math.max(0, Math.min(index, this.maxIndex));
            this.index = nextIndex;

            if (!animate) {
                this.track.style.transition = 'none';
                this.update();

                window.requestAnimationFrame(() => {
                    this.track.style.transition = '';
                });
            } else {
                this.update();
            }

            this.updatePagination();
        }

        update() {
            const offset = -(this.index * this.slideStep) + this.dragOffset;
            this.track.style.transform = `translate3d(${offset}px, 0, 0)`;
        }

        updatePagination() {
            if (!this.pagination) return;

            const dots = Array.from(this.pagination.querySelectorAll('.swiper-pagination__dot'));

            dots.forEach((dot, dotIndex) => {
                const active = dotIndex === this.index;

                dot.classList.toggle('is-active', active);
                dot.setAttribute('aria-current', active ? 'true' : 'false');
            });
        }

        startAutoplay() {
            if (!this.options.autoplay) return;

            this.stopAutoplay();

            this.autoplayTimer = window.setInterval(() => {
                this.goNext();
            }, this.options.autoplayDelay);
        }

        stopAutoplay() {
            if (this.autoplayTimer) {
                window.clearInterval(this.autoplayTimer);
                this.autoplayTimer = null;
            }
        }

        debounce(callback, delay) {
            let timer = null;

            return (...args) => {
                window.clearTimeout(timer);
                timer = window.setTimeout(() => callback.apply(this, args), delay);
            };
        }
    }

    function initGlobalCarousels() {
        const carousels = doc.querySelectorAll('[data-carousel="global"]');

        carousels.forEach((carousel) => {
            if (carousel.dataset.carouselReady === 'true') return;

            carousel.dataset.carouselReady = 'true';

            new SolakCarousel(carousel, {
                loop: true,
                drag: true,
                autoplay: carousel.dataset.autoplay === 'true',
                autoplayDelay: Number(carousel.dataset.autoplayDelay || 5500)
            });
        });
    }

    function initGlobal() {
        applySiteConfig();
        initLucideIcons();
        initActiveNavigation();
        initMobileMenu();
        initServicesDropdown();
        initFaqAccordions();
        initCookieBanner();
        initGlobalCarousels();
        initLucideIcons();
    }

    window.applySiteConfig = applySiteConfig;
    window.initFaqAccordions = initFaqAccordions;
    window.createFaqJsonLd = createFaqJsonLd;
    window.SolakCarousel = SolakCarousel;
    window.createSolakIconSvg = createIconSvg;

    doc.addEventListener('DOMContentLoaded', initGlobal);
})();