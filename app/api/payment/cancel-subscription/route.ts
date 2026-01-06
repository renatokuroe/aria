import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Production API - changed from sandbox to production
const ASAAS_API_URL = 'https://api.asaas.com/v3'
const ASAAS_API_KEY = '$aact_prod_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OmMwZWI5NjZlLTJhNzEtNDc2OS05MTQ2LTQzOGZmM2VkODc3ZDo6JGFhY2hfMjI1YmUwNjYtMzczNi00YmZkLWE2ZGUtZTY5YjU0YzBkODUx'

interface CancelSubscriptionRequest {
    userEmail: string
    currentPlanValue: number
}

// POST - Cancelar subscription ao fazer downgrade
export async function POST(request: NextRequest) {
    try {
        const body: CancelSubscriptionRequest = await request.json()
        const { userEmail, currentPlanValue } = body

        console.log('📋 POST /api/payment/cancel-subscription:', { userEmail, currentPlanValue })

        if (!userEmail || !currentPlanValue) {
            return NextResponse.json(
                { error: 'Email e valor do plano atual são obrigatórios' },
                { status: 400 }
            )
        }

        if (!ASAAS_API_KEY) {
            console.error('❌ Chave API ASAAS não configurada')
            console.error('  NODE_ENV:', process.env.NODE_ENV)
            console.error('  Todas as variáveis com ASAAS:', Object.keys(process.env).filter(k => k.includes('ASAAS')))
            return NextResponse.json(
                { error: 'Chave API ASAAS não configurada' },
                { status: 500 }
            )
        }

        // PASSO 1: Buscar o subscriptionId do usuário no banco de dados
        console.log('🔍 PASSO 1: Buscando subscriptionId no banco de dados...')

        let user = null
        try {
            user = await prisma.user.findUnique({
                where: { email: userEmail },
            })
        } catch (prismaError) {
            console.error('❌ Erro ao buscar usuário no banco:', prismaError)
            return NextResponse.json(
                { warning: 'Erro ao buscar usuário no banco' },
                { status: 200 }
            )
        }

        if (!user || !user.asaasSubscriptionId) {
            console.log('ℹ️ Usuário não tem subscriptionId registrado')
            return NextResponse.json({
                success: true,
                message: 'Nenhuma subscription para cancelar',
            })
        }

        const subscriptionId = user.asaasSubscriptionId
        console.log('✓ SubscriptionId encontrado:', subscriptionId)

        // PASSO 2: Cancelar a subscription no Asaas
        console.log('🔄 PASSO 2: Cancelando subscription no Asaas...')

        try {
            const cancelResponse = await fetch(
                `${ASAAS_API_URL}/subscriptions/${subscriptionId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'access_token': ASAAS_API_KEY,
                    },
                }
            )

            if (cancelResponse.ok) {
                console.log(`✓ Subscription ${subscriptionId} cancelada no Asaas`)
                
                // PASSO 3: Limpar o subscriptionId do banco
                console.log('💾 PASSO 3: Limpando subscriptionId do banco...')
                try {
                    await prisma.user.update({
                        where: { email: userEmail },
                        data: { asaasSubscriptionId: null },
                    })
                    console.log('✓ SubscriptionId removido do banco')
                } catch (prismaError) {
                    console.error('⚠️ Erro ao limpar subscriptionId do banco:', prismaError)
                }

                return NextResponse.json({
                    success: true,
                    message: 'Subscription cancelada com sucesso',
                    subscriptionId: subscriptionId,
                })
            } else {
                const errorResponse = await cancelResponse.text()
                console.warn(`⚠️ Erro ao cancelar subscription ${subscriptionId}:`, cancelResponse.status, errorResponse)
                
                return NextResponse.json(
                    { warning: 'Erro ao cancelar subscription no Asaas' },
                    { status: 200 } // Retorna sucesso mesmo assim para não bloquear o downgrade
                )
            }
        } catch (error) {
            console.error('❌ Erro ao cancelar subscription:', error)
            return NextResponse.json(
                { warning: 'Erro ao cancelar subscription' },
                { status: 200 } // Retorna sucesso mesmo assim para não bloquear o downgrade
            )
        }
    } catch (error) {
        console.error('❌ Erro ao cancelar subscription:', error)
        return NextResponse.json(
            { warning: 'Erro ao cancelar subscription' },
            { status: 200 } // Retorna sucesso mesmo assim para não bloquear o downgrade
        )
    }
}
