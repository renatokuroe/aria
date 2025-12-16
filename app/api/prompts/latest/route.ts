import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/src/lib/auth'
import { prisma } from '@/src/lib/prisma'

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const prompt = await prisma.prompt.findFirst({ where: { userId: session.user?.id as string }, orderBy: { createdAt: 'desc' } })
    if (!prompt) return NextResponse.json({ prompt: null })
    return NextResponse.json({ prompt })
}
