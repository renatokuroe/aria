import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/src/lib/prisma'

export async function POST(req: Request) {
    const body = await req.json()
    const email = (body.email || '').toString().trim().toLowerCase()
    const password = (body.password || '').toString()

    if (!email || !password) return NextResponse.json({ error: 'Campos obrigatórios' }, { status: 400 })
    if (!email.includes('@')) return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
    if (password.length < 8) return NextResponse.json({ error: 'Senha precisa ter ao menos 8 caracteres' }, { status: 400 })

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ error: 'Usuário já existe' }, { status: 400 })

    // bcryptjs is pure JS, use hashSync here to avoid native bindings on dev machines
    const hashed = bcrypt.hashSync(password, 10)
    const user = await prisma.user.create({ data: { email, password: hashed } })

    return NextResponse.json({ ok: true, id: user.id })
}
