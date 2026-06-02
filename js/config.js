'use strict';

window.SITE_CONFIG = {
    company: {
        name: 'SOLAK',
        companyId: 'SLK-SOLAR-4827',
        address: '1846 Solar Ridge Avenue, Austin, TX 78701, USA',
        serviceArea: 'Independent solar provider comparison across selected areas in the United States',
        type: 'Independent solar provider comparison platform'
    },

    contact: {
        phoneRaw: '+18885550148',
        phoneDisplay: '(888) 555-0148',
        phoneButtonText: 'Call Now',
        email: 'hello@solaksolar.com',
        supportHours: 'Mon–Fri, 8:00 AM–7:00 PM'
    },

    cta: {
        primary: 'Compare Solar Providers',
        secondary: 'Explore Services',
        quote: 'Request Solar Quotes',
        contact: 'Contact SOLAK',
        phone: 'Call Now',
        viewOptions: 'View Service Options',
        allServices: 'View All Services'
    },

    footer: {
        description:
            'SOLAK is an independent solar provider comparison platform that helps homeowners and businesses explore local solar company options, review service categories, and request quotes from independent providers.',
        disclaimer:
            'Disclaimer: This site is a free service to assist homeowners in connecting with local service providers. All contractors/providers are independent and this site does not warrant or guarantee any work performed. It is the responsibility of the homeowner to verify that the hired contractor furnishes the necessary license and insurance required for the work being performed. All persons depicted in a photo or video are actors or models and not contractors listed on this site.'
    },

    legal: [
        {
            title: 'Privacy Policy',
            url: 'privacy-policy.html'
        },
        {
            title: 'Cookie Policy',
            url: 'cookie-policy.html'
        },
        {
            title: 'Terms of Service',
            url: 'terms-of-service.html'
        }
    ],

    navigation: [
        {
            title: 'Home',
            url: 'index.html'
        },
        {
            title: 'Services',
            url: 'services.html'
        },
        {
            title: 'About',
            url: 'about.html'
        },
        {
            title: 'Contact',
            url: 'contact.html'
        }
    ],

    services: [
        {
            title: 'Solar Panel Installation',
            url: 'solar-panel-installation.html',
            short: 'Compare local providers for new solar panel project options.',
            image: 'assets/images/solar-panels-roof.jpg',
            icon: 'panel'
        },
        {
            title: 'Residential Solar',
            url: 'residential-solar.html',
            short: 'Explore provider options for home solar systems.',
            image: 'assets/images/residential-solar.jpg',
            icon: 'home'
        },
        {
            title: 'Commercial Solar',
            url: 'commercial-solar.html',
            short: 'Review solar provider categories for business properties.',
            image: 'assets/images/commercial-solar.jpg',
            icon: 'building'
        },
        {
            title: 'Solar Battery Storage',
            url: 'solar-battery-storage.html',
            short: 'Compare battery-ready solar options and storage support.',
            image: 'assets/images/solar-battery.jpg',
            icon: 'battery'
        },
        {
            title: 'Solar Maintenance',
            url: 'solar-maintenance.html',
            short: 'Find providers for solar panel maintenance.',
            image: 'assets/images/solar-maintenance.jpg',
            icon: 'maintenance'
        },
        {
            title: 'Solar Consultation',
            url: 'solar-consultation.html',
            short: 'Request quote guidance and compare local solar options.',
            image: 'assets/images/solar-consultation.jpg',
            icon: 'consultation'
        }
    ],

    images: {
        homeHero: 'assets/images/solar-hero.jpg',
        servicesHero: 'assets/images/solar-field.jpg',
        aboutHero: 'assets/images/solar-panels-roof.jpg',
        contactHero: 'assets/images/solar-consultation.jpg',
        roundHome: 'assets/images/solar-home-round.jpg',
        workerModel: 'assets/images/solar-worker-model.jpg'
    },

    logo: {
        label: 'SOLAK',
        svg: `
<svg width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <defs>
        <linearGradient id="panelGlass" x1="40" y1="40" x2="170" y2="150" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#EAF6FF"/>
            <stop offset="100%" stop-color="#A8D8FF"/>
        </linearGradient>

        <linearGradient id="frameBlue" x1="52" y1="48" x2="165" y2="150" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#0B4A8F"/>
            <stop offset="100%" stop-color="#032A5A"/>
        </linearGradient>

        <filter id="softShadow" x="0" y="0" width="220" height="220" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#032A5A" flood-opacity="0.18"/>
        </filter>
    </defs>

    <g transform="translate(162 26)">
        <circle cx="18" cy="18" r="12" fill="#FFD23F"/>
        <g stroke="#FFD23F" stroke-width="3" stroke-linecap="round">
            <line x1="18" y1="0" x2="18" y2="7"/>
            <line x1="18" y1="29" x2="18" y2="36"/>
            <line x1="0" y1="18" x2="7" y2="18"/>
            <line x1="29" y1="18" x2="36" y2="18"/>
            <line x1="5.5" y1="5.5" x2="10.5" y2="10.5"/>
            <line x1="25.5" y1="25.5" x2="30.5" y2="30.5"/>
            <line x1="30.5" y1="5.5" x2="25.5" y2="10.5"/>
            <line x1="10.5" y1="25.5" x2="5.5" y2="30.5"/>
        </g>
    </g>

    <g filter="url(#softShadow)" transform="rotate(-10 104 108)">
        <rect x="42" y="54" width="120" height="82" rx="10" fill="url(#frameBlue)"/>
        <rect x="50" y="62" width="104" height="66" rx="6" fill="url(#panelGlass)"/>

        <g stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="2">
            <line x1="76" y1="62" x2="76" y2="128"/>
            <line x1="102" y1="62" x2="102" y2="128"/>
            <line x1="128" y1="62" x2="128" y2="128"/>
            <line x1="50" y1="84" x2="154" y2="84"/>
            <line x1="50" y1="106" x2="154" y2="106"/>
        </g>

        <path d="M58 68L93 68L58 104V68Z" fill="white" fill-opacity="0.22"/>
    </g>

    <g>
        <path d="M92 138L79 174" stroke="#063B7A" stroke-width="6" stroke-linecap="round"/>
        <path d="M124 138L137 174" stroke="#063B7A" stroke-width="6" stroke-linecap="round"/>
        <path d="M68 182H148" stroke="#063B7A" stroke-width="7" stroke-linecap="round"/>
        <path d="M94 159H122" stroke="#16B83E" stroke-width="6" stroke-linecap="round"/>
    </g>

    <g transform="translate(142 122)">
        <circle cx="14" cy="14" r="13" fill="#16B83E"/>
        <path d="M18 6L11.5 14H16L10 22L16.5 14H12L18 6Z" fill="white"/>
    </g>
</svg>`
    }
};