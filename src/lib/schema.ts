export const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ARIA',
    alternateName: 'Assistente de Respostas Inteligentes Automatizadas',
    url: 'https://aria.app',
    logo: 'https://aria.app/logo-full-green-no-bg.webp',
    description: 'Plataforma de assistente de IA para automação de atendimento no WhatsApp',
    sameAs: [
        'https://twitter.com/ariaaib',
        'https://instagram.com/ariaaib',
        'https://linkedin.com/company/ariaaib',
    ],
    contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Customer Service',
        email: 'support@aria.app',
        availableLanguage: ['pt-BR', 'en'],
    },
}

export const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ARIA',
    url: 'https://aria.app',
    potentialAction: {
        '@type': 'SearchAction',
        target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://aria.app/search?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
    },
}

export const faqs = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: 'O que é um Agente de IA para WhatsApp?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Um agente de IA para WhatsApp é uma ferramenta capaz de responder automaticamente aos seus clientes utilizando inteligência artificial baseada em documentos e instruções que você fornece.',
            },
        },
        {
            '@type': 'Question',
            name: 'Quanto tempo leva para configurar?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Em poucos instantes, você conecta a Inteligência Artificial ao WhatsApp da sua empresa. Nada de configurações extensas ou processos demorados.',
            },
        },
        {
            '@type': 'Question',
            name: 'Para quem é o ARIA?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'O ARIA é ideal para e-commerce, negócios locais, clínicas e pequenas empresas que precisam automatizar o atendimento ao cliente.',
            },
        },
    ],
}

export const softwareApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ARIA',
    description: 'Assistente de IA para automação de atendimento no WhatsApp',
    url: 'https://aria.app',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web-based',
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'BRL',
        availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '150',
    },
}
