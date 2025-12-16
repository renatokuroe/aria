import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'

export async function GET(req: Request) {
    const url = new URL(req.url)
    const email = url.searchParams.get('email')
    if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 })
    const user = await prisma.user.findUnique({ where: { email } })
    return NextResponse.json(user)
}
