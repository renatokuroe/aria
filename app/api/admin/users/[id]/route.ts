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

// GET - Obter usuário específico
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { isAdmin } = await checkAdmin()

    if (!isAdmin) {
        return NextResponse.json(
            { error: 'Não autorizado' },
            { status: 401 }
        )
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: params.id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                credits: true,
                createdAt: true,
                prompts: {
                    select: {
                        id: true,
                        title: true,
                        createdAt: true,
                    }
                },
                qrReads: {
                    select: {
                        id: true,
                        code: true,
                        createdAt: true,
                    }
                }
            }
        })

        if (!user) {
            return NextResponse.json(
                { error: 'Usuário não encontrado' },
                { status: 404 }
            )
        }

        // Buscar contagem de mensagens do webhook
        let messageCount = 0
        try {
            const emailWithoutAt = user.email.replace('@', ' ')
            const countResponse = await fetch('https://n8n-panel.aria.social.br/webhook/manage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    operation: 'GET_MESSAGE_COUNT',
                    apiKey: 'EvoApiKeySecreta2025',
                    instanceName: emailWithoutAt,
                }),
            })

            if (countResponse.ok) {
                const countData = await countResponse.json()

                // Tratar diferentes formatos de resposta
                if (typeof countData === 'number') {
                    messageCount = countData
                } else if (typeof countData === 'string') {
                    const parsed = parseInt(countData, 10)
                    messageCount = isNaN(parsed) ? 0 : parsed
                } else if (countData?.messageCount) {
                    messageCount = countData.messageCount
                } else if (countData?.message_count) {
                    messageCount = countData.message_count
                } else if (countData?.count) {
                    messageCount = countData.count
                }
            }
        } catch (error) {
            console.error('Erro ao buscar message count:', error)
            // Continua mesmo se falhar
        }

        // Buscar plano atual do webhook
        let currentPlan = 0
        try {
            const emailWithoutAt = user.email.replace('@', ' ')
            const planResponse = await fetch('https://n8n-panel.aria.social.br/webhook/manage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    operation: 'GET_PLAN',
                    apiKey: 'EvoApiKeySecreta2025',
                    instanceName: emailWithoutAt,
                }),
            })

            if (planResponse.ok) {
                const planData = await planResponse.json()

                // Tratar diferentes formatos de resposta
                if (typeof planData === 'number' && planData > 0) {
                    currentPlan = planData
                } else if (typeof planData === 'string') {
                    const parsed = parseInt(planData, 10)
                    currentPlan = !isNaN(parsed) && parsed > 0 ? parsed : 0
                } else if (typeof planData === 'object' && planData) {
                    currentPlan = planData.plan || planData.Plan || planData.messageLimit || planData.planLimit || 0
                }
            }
        } catch (error) {
            console.error('Erro ao buscar plano atual:', error)
            // Continua mesmo se falhar
        }

        return NextResponse.json({
            ...user,
            messageCount,
            currentPlan
        })
    } catch (error) {
        console.error('Erro ao buscar usuário:', error)
        return NextResponse.json(
            { error: 'Erro ao buscar usuário' },
            { status: 500 }
        )
    }
}

// PATCH - Atualizar usuário
export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { isAdmin } = await checkAdmin()

    if (!isAdmin) {
        return NextResponse.json(
            { error: 'Não autorizado' },
            { status: 401 }
        )
    }

    try {
        const body = await req.json()
        const { name, role, credits } = body

        const user = await prisma.user.update({
            where: { id: params.id },
            data: {
                ...(name !== undefined && { name }),
                ...(role !== undefined && { role }),
                ...(credits !== undefined && { credits }),
            }
        })

        return NextResponse.json(user)
    } catch (error: any) {
        console.error('Erro ao atualizar usuário:', error)
        if (error.code === 'P2025') {
            return NextResponse.json(
                { error: 'Usuário não encontrado' },
                { status: 404 }
            )
        }
        return NextResponse.json(
            { error: 'Erro ao atualizar usuário' },
            { status: 500 }
        )
    }
}

// DELETE - Deletar usuário
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { isAdmin } = await checkAdmin()

    if (!isAdmin) {
        return NextResponse.json(
            { error: 'Não autorizado' },
            { status: 401 }
        )
    }

    try {
        // Deletar prompts associados ao usuário
        await prisma.prompt.deleteMany({
            where: { userId: params.id }
        })

        // Deletar QR readings associadas ao usuário
        await prisma.qRReading.deleteMany({
            where: { userId: params.id }
        })

        // Deletar o usuário
        await prisma.user.delete({
            where: { id: params.id }
        })

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Erro ao deletar usuário:', error)
        if (error.code === 'P2025') {
            return NextResponse.json(
                { error: 'Usuário não encontrado' },
                { status: 404 }
            )
        }
        return NextResponse.json(
            { error: 'Erro ao deletar usuário' },
            { status: 500 }
        )
    }
}
