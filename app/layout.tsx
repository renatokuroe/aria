import { Space_Grotesk } from 'next/font/google'
import Providers from '@/src/components/Providers'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-space-grotesk',
})

export const metadata = {
    title: 'ARIA',
    description: 'Frontend scaffold for ARIA',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-BR" className={spaceGrotesk.variable}>
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
