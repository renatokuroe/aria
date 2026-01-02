import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/src/lib/auth'
import { prisma } from '@/src/lib/prisma'

// Middleware para verificar se é admin
async function checkAdmin() {
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

// GET - Obter estatísticas gerais
export async function GET(req: NextRequest) {
    const { isAdmin } = await checkAdmin()

    if (!isAdmin) {
        return NextResponse.json(
            { error: 'Não autorizado' },
            { status: 401 }
        )
    }

    try {
        const totalUsers = await prisma.user.count()

        const totalPrompts = await prisma.prompt.count()

        const totalQRReads = await prisma.qRReading.count()

        const totalCredits = await prisma.user.aggregate({
            _sum: {
                credits: true
            }
        })

        // Usuários por tipo
        const usersByRole = await prisma.user.groupBy({
            by: ['role'],
            _count: true
        })

        // Usuários criados nos últimos 7 dias
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        const newUsersThisWeek = await prisma.user.count({
            where: {
                createdAt: {
                    gte: sevenDaysAgo
                }
            }
        })

        return NextResponse.json({
            totalUsers,
            totalPrompts,
            totalQRReads,
            totalCredits: totalCredits._sum.credits || 0,
            usersByRole,
            newUsersThisWeek,
            timestamp: new Date()
        })
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error)
        return NextResponse.json(
            { error: 'Erro ao buscar estatísticas' },
            { status: 500 }
        )
    }
}
