'use strict';


(function () {
    const doc = document;

    const CONTACT_FAQ = [
        {
            question: 'Does SOLAK install solar panels?',
            answer:
                'No. SOLAK is an independent comparison platform. It does not install, repair, maintain, or consult on solar projects directly.'
        },
        {
            question: 'Can I compare battery storage options?',
            answer:
                'Yes. Users can select solar battery storage as an interest and compare provider options that may support backup energy and battery-ready systems.'
        },
        {
            question: 'How quickly can providers respond?',
            answer:
                'Response timing can vary by provider, location, project type, and availability. Users should review each provider response carefully.'
        },
        {
            question: 'Can businesses use SOLAK?',
            answer:
                'Yes. SOLAK includes commercial solar as a category for businesses that want to compare provider options for larger or business-related properties.'
        }
    ];

    function getFormValue(form, name) {
        const field = form.elements[name];

        if (!field) return '';

        if (field.type === 'checkbox') {
            return field.checked;
        }

        return String(field.value || '').trim();
    }

    function isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
    }

    function isValidPhone(value) {
        const digits = value.replace(/\D/g, '');
        return digits.length >= 7;
    }

    function isValidZip(value) {
        return /^\d{5}(?:-\d{4})?$/.test(value);
    }

    function clearMessages(form) {
        const success = form.querySelector('[data-form-success]');
        const error = form.querySelector('[data-form-error]');

        if (success) success.textContent = '';
        if (error) error.textContent = '';
    }

    function setFieldState(field, isInvalid) {
        if (!field) return;

        field.setAttribute('aria-invalid', isInvalid ? 'true' : 'false');
    }

    function clearFieldStates(form) {
        const fields = form.querySelectorAll('input, select, textarea');

        fields.forEach((field) => {
            field.removeAttribute('aria-invalid');
        });
    }

    function validateContactForm(form) {
        const errors = [];

        const fullName = getFormValue(form, 'fullName');
        const email = getFormValue(form, 'email');
        const phone = getFormValue(form, 'phone');
        const zipCode = getFormValue(form, 'zipCode');
        const solarInterest = getFormValue(form, 'solarInterest');
        const message = getFormValue(form, 'message');
        const consent = getFormValue(form, 'consent');

        const fields = {
            fullName: form.elements.fullName,
            email: form.elements.email,
            phone: form.elements.phone,
            zipCode: form.elements.zipCode,
            solarInterest: form.elements.solarInterest,
            message: form.elements.message,
            consent: form.elements.consent
        };

        clearFieldStates(form);

        if (fullName.length < 2) {
            errors.push({
                field: fields.fullName,
                message: 'Please enter your full name.'
            });
        }

        if (!isValidEmail(email)) {
            errors.push({
                field: fields.email,
                message: 'Please enter a valid email address.'
            });
        }

        if (!isValidPhone(phone)) {
            errors.push({
                field: fields.phone,
                message: 'Please enter a valid phone number.'
            });
        }

        if (!isValidZip(zipCode)) {
            errors.push({
                field: fields.zipCode,
                message: 'Please enter a valid ZIP code.'
            });
        }

        if (!solarInterest) {
            errors.push({
                field: fields.solarInterest,
                message: 'Please choose a solar interest.'
            });
        }

        if (message.length < 10) {
            errors.push({
                field: fields.message,
                message: 'Please add a short message about what you want to compare.'
            });
        }

        if (!consent) {
            errors.push({
                field: fields.consent,
                message: 'Please confirm the consent checkbox.'
            });
        }

        errors.forEach((error) => {
            setFieldState(error.field, true);
        });

        return errors;
    }

    function initContactForm() {
        const form = doc.querySelector('[data-contact-form]');
        if (!form) return;

        const success = form.querySelector('[data-form-success]');
        const error = form.querySelector('[data-form-error]');

        form.addEventListener('input', (event) => {
            const field = event.target.closest('input, select, textarea');

            if (!field) return;

            field.removeAttribute('aria-invalid');
            clearMessages(form);
        });

        form.addEventListener('change', (event) => {
            const field = event.target.closest('input, select, textarea');

            if (!field) return;

            field.removeAttribute('aria-invalid');
            clearMessages(form);
        });

        form.addEventListener('submit', (event) => {
            event.preventDefault();

            clearMessages(form);

            const errors = validateContactForm(form);

            if (errors.length > 0) {
                if (error) {
                    error.textContent = errors[0].message;
                }

                const firstInvalid = errors[0].field;

                if (firstInvalid && typeof firstInvalid.focus === 'function') {
                    firstInvalid.focus({ preventScroll: false });
                }

                return;
            }

            const selectedInterest = getFormValue(form, 'solarInterest');
            const companyName = window.SITE_CONFIG?.company?.name || 'SOLAK';

            if (success) {
                success.textContent =
                    `Thank you. ${companyName} received your ${selectedInterest} comparison request. This demo form is frontend-only and can be connected to a backend later.`;
            }

            if (error) {
                error.textContent = '';
            }

            form.reset();
            clearFieldStates(form);
        });
    }

    function addContactFaqSchema() {
        if (typeof window.createFaqJsonLd !== 'function') return;

        window.createFaqJsonLd(CONTACT_FAQ, 'contact-faq-jsonld');
    }

    function addContactOptionFocusStates() {
        const items = doc.querySelectorAll('.contact-option, .service-area-panel__meta-row');

        items.forEach((item) => {
            item.addEventListener('focusin', () => {
                item.classList.add('is-focused');
            });

            item.addEventListener('focusout', () => {
                item.classList.remove('is-focused');
            });
        });
    }

    function addMapPanelPointerEffect() {
        const mapCard = doc.querySelector('.map-card');
        if (!mapCard) return;

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reducedMotion) return;

        mapCard.addEventListener('pointermove', (event) => {
            const rect = mapCard.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
            const y = ((event.clientY - rect.top) / rect.height - 0.5) * 10;

            mapCard.style.setProperty('--map-shift-x', `${x}px`);
            mapCard.style.setProperty('--map-shift-y', `${y}px`);
        });

        mapCard.addEventListener('pointerleave', () => {
            mapCard.style.removeProperty('--map-shift-x');
            mapCard.style.removeProperty('--map-shift-y');
        });
    }

    function addContactRevealEffects() {
        const revealItems = doc.querySelectorAll(
            '.contact-option, .contact-form-card, .service-area-panel__content, .map-card, .contact-faq .faq-item'
        );

        if (!revealItems.length) return;

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!('IntersectionObserver' in window) || reducedMotion) {
            revealItems.forEach((item) => item.classList.add('is-visible'));
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
            item.style.setProperty('--reveal-delay', `${Math.min(index * 45, 240)}ms`);
            observer.observe(item);
        });
    }

    function initContactPage() {
        initContactForm();
        addContactFaqSchema();
        addContactOptionFocusStates();
        addMapPanelPointerEffect();

        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }

    if (doc.readyState === 'loading') {
        doc.addEventListener('DOMContentLoaded', initContactPage);
    } else {
        initContactPage();
    }
})();