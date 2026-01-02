import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/src/lib/auth'
import { prisma } from '@/src/lib/prisma'
import bcrypt from 'bcryptjs'

// GET - Obter perfil do usuário
export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
        return NextResponse.json(
            { error: 'Não autenticado' },
            { status: 401 }
        )
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
            },
        })

        if (!user) {
            return NextResponse.json(
                { error: 'Usuário não encontrado' },
                { status: 404 }
            )
        }

        console.log('[profile] Dados retornados:', user)
        return NextResponse.json(user)
    } catch (error: any) {
        console.error('Erro ao buscar perfil:', error)
        return NextResponse.json(
            { error: 'Erro ao buscar perfil', details: error.message },
            { status: 500 }
        )
    }
}

// PATCH - Atualizar perfil do usuário
export async function PATCH(req: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
        return NextResponse.json(
            { error: 'Não autenticado' },
            { status: 401 }
        )
    }

    try {
        const body = await req.json()
        const { name, password, phone } = body

        // Validações
        if (!name || !name.trim()) {
            return NextResponse.json(
                { error: 'Nome é obrigatório' },
                { status: 400 }
            )
        }

        // Preparar dados para atualização
        const updateData: any = {
            name: name.trim(),
            phone: phone ? phone.trim() : null,
        }

        // Se uma nova senha foi fornecida, fazer hash dela
        if (password && password.trim() !== '') {
            if (password.length < 6) {
                return NextResponse.json(
                    { error: 'Senha deve ter pelo menos 6 caracteres' },
                    { status: 400 }
                )
            }
            const hashedPassword = bcrypt.hashSync(password, 10)
            updateData.password = hashedPassword
        }

        const user = await prisma.user.update({
            where: { email: session.user.email },
            data: updateData,
            select: {
                id: true,
                email: true,
                name: true,
            },
        })

        return NextResponse.json(user)
    } catch (error: any) {
        console.error('Erro ao atualizar perfil:', error)
        return NextResponse.json(
            { error: 'Erro ao atualizar perfil' },
            { status: 500 }
        )
    }
}
