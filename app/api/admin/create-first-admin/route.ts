import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import bcrypt from 'bcryptjs'

// Rota protegida para criar primeiro admin em produção
export async function POST(req: NextRequest) {
    try {
        // Verificar ADMIN_KEY
        const authHeader = req.headers.get('Authorization')
        const adminKey = process.env.ADMIN_KEY

        if (!adminKey || !authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Não autorizado' },
                { status: 401 }
            )
        }

        const token = authHeader.substring(7)
        if (token !== adminKey) {
            return NextResponse.json(
                { error: 'Chave de admin inválida' },
                { status: 401 }
            )
        }

        const body = await req.json()
        const { email, password, name } = body

        // Validar campos obrigatórios
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email e senha são obrigatórios' },
                { status: 400 }
            )
        }

        // Verificar se usuário já existe
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'Usuário já existe' },
                { status: 400 }
            )
        }

        // Hash da senha
        const hashedPassword = bcrypt.hashSync(password, 10)

        // Criar usuário admin
        const user = await prisma.user.create({
            data: {
                email,
                name: name || email.split('@')[0],
                password: hashedPassword,
                role: 'admin',
                credits: 1000
            }
        })

        return NextResponse.json(
            {
                success: true,
                message: 'Admin criado com sucesso',
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    credits: user.credits
                }
            },
            { status: 201 }
        )
    } catch (error: any) {
        console.error('Erro ao criar admin:', error)
        return NextResponse.json(
            { error: 'Erro ao criar admin' },
            { status: 500 }
        )
    }
}
