import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/src/lib/auth'
import { prisma } from '@/src/lib/prisma'

// Middleware para verificar se é admin
async function checkAdmin(req: NextRequest) {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
        return { isAdmin: false, user: null }
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    })

    if (!user || user.role !== 'admin') {
        return { isAdmin: false, user: null }
    }

    return { isAdmin: true, user }
}

// GET - Listar todos os usuários com consumo de mensagens
export async function GET(req: NextRequest) {
    const { isAdmin } = await checkAdmin(req)

    if (!isAdmin) {
        return NextResponse.json(
            { error: 'Não autorizado' },
            { status: 401 }
        )
    }

    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                credits: true,
                createdAt: true,
                _count: {
                    select: {
                        prompts: true,
                        qrReads: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(users)
    } catch (error) {
        console.error('Erro ao buscar usuários:', error)
        return NextResponse.json(
            { error: 'Erro ao buscar usuários' },
            { status: 500 }
        )
    }
}

// POST - Criar usuário (admin)
export async function POST(req: NextRequest) {
    const { isAdmin } = await checkAdmin(req)

    if (!isAdmin) {
        return NextResponse.json(
            { error: 'Não autorizado' },
            { status: 401 }
        )
    }

    try {
        const body = await req.json()
        const { email, name, role = 'user', credits = 0 } = body

        if (!email) {
            return NextResponse.json(
                { error: 'Email é obrigatório' },
                { status: 400 }
            )
        }

        const user = await prisma.user.create({
            data: {
                email,
                name,
                role,
                credits
            }
        })

        return NextResponse.json(user, { status: 201 })
    } catch (error: any) {
        console.error('Erro ao criar usuário:', error)
        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: 'Email já existe' },
                { status: 400 }
            )
        }
        return NextResponse.json(
            { error: 'Erro ao criar usuário' },
            { status: 500 }
        )
    }
}
