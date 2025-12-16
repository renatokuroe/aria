import { getServerSession } from 'next-auth'
import { authOptions } from '@/src/lib/auth'

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)
    if (!session) return <div style={{ padding: 24 }}>Acesse sua conta em /auth/login</div>

    return (
        <main style={{ padding: 24 }}>
            <h2>Dashboard</h2>
            <p>Bem-vindo, {session.user?.email}</p>
            <ul>
                <li><a href="/prompt/new">Instruções para IA</a></li>
                <li><a href="/qr/read">Ler QR</a></li>
                <li><a href="/dashboard/settings">Ver créditos / Upgrade</a></li>
            </ul>
        </main>
    )
}
