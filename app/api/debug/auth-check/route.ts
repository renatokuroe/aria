import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
    const body = await req.json()
    const { email, password } = body
    if (!email || !password) return NextResponse.json({ error: 'Missing' }, { status: 400 })
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.password) return NextResponse.json({ ok: false, reason: 'no user/password' })
    const ok = bcrypt.compareSync(password, user.password)
    return NextResponse.json({ ok })
}
