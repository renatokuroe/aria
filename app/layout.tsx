import Providers from '@/src/components/Providers'

export const metadata = {
    title: 'ARIA',
    description: 'Frontend scaffold for ARIA',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-BR">
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
