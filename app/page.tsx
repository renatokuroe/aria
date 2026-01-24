import { getServerSession } from 'next-auth'
import { authOptions } from '@/src/lib/auth'
import { redirect } from 'next/navigation'
import LandingPage from '@/src/components/LandingPage'

export default async function Home() {
    const session = await getServerSession(authOptions)

    if (session) {
        redirect('/dashboard')
    }

    return <LandingPage />
}