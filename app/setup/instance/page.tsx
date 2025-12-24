import { getServerSession } from 'next-auth'
import { authOptions } from '@/src/lib/auth'
import { redirect } from 'next/navigation'
import SetupInstanceClient from '@/src/components/SetupInstance'

export default async function Page() {
    const session = await getServerSession(authOptions)
    if (!session) redirect('/auth/login')
    const email = session.user?.email ?? ''

    return (
        <main style={{ padding: 24 }}>
            <SetupInstanceClient email={email} />
        </main>
    )
}
