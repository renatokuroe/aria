import { Space_Grotesk } from 'next/font/google'
import { Metadata } from 'next'
import Providers from '@/src/components/Providers'
import JsonLdSchema from '@/src/components/JsonLdSchema'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
    title: 'ARIA - Assistente de IA para WhatsApp | Atendimento Automático',
    description: 'Conecte um assistente de IA ao WhatsApp da sua empresa em minutos. Automatize atendimento, respostas rápidas e precisas. Ideal para e-commerce, clínicas e negócios locais.',
    keywords: 'assistente IA WhatsApp, chatbot WhatsApp, automação atendimento, assistente virtual, ARIA',
    authors: [{ name: 'ARIA' }],
    creator: 'ARIA',
    publisher: 'ARIA',
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-snippet': -1,
            'max-image-preview': 'large',
            'max-video-preview': -1,
        },
    },
    openGraph: {
        type: 'website',
        locale: 'pt_BR',
        url: 'https://aria.app',
        title: 'ARIA - Assistente de IA para WhatsApp',
        description: 'Conecte um assistente de IA ao WhatsApp da sua empresa em minutos. Automatize atendimento com precisão.',
        siteName: 'ARIA',
        images: [
            {
                url: 'https://aria.app/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'ARIA - Assistente de IA para WhatsApp',
                type: 'image/jpeg',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'ARIA - Assistente de IA para WhatsApp',
        description: 'Automatize seu atendimento com inteligência artificial em poucos minutos',
        creator: '@ariaaib',
        images: ['https://aria.app/og-image.jpg'],
    },
    applicationName: 'ARIA',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent',
        title: 'ARIA',
    },
    formatDetection: {
        telephone: false,
    },
    other: {
        'canonical': 'https://aria.app',
    },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-BR" className={spaceGrotesk.variable}>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="#1b5e20" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="canonical" href="https://aria.app" />
                <JsonLdSchema />
            </head>
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
