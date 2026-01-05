import { NextRequest, NextResponse } from 'next/server'

// Production API - changed from sandbox to production
const ASAAS_API_URL = 'https://api.asaas.com/v3'
const ASAAS_API_KEY = process.env.ASAAS_API_KEY

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

        // Buscar subscriptions do cliente
        const externalReference = userEmail.replace('@', '-')

        console.log('🔍 Buscando subscriptions com externalReference:', externalReference)

        const subscriptionsResponse = await fetch(
            `${ASAAS_API_URL}/subscriptions?externalReference=${externalReference}`,
            {
                method: 'GET',
                headers: {
                    'access_token': ASAAS_API_KEY,
                },
            }
        )

        if (!subscriptionsResponse.ok) {
            console.warn('⚠️ Erro ao buscar subscriptions:', subscriptionsResponse.status)
            return NextResponse.json(
                { warning: 'Não foi possível buscar subscriptions' },
                { status: 200 } // Retorna sucesso mesmo assim
            )
        }

        const subscriptionsData = await subscriptionsResponse.json()
        const subscriptions = subscriptionsData.data || []

        console.log(`📋 Encontradas ${subscriptions.length} subscriptions`)

        if (subscriptions.length === 0) {
            console.log('ℹ️ Nenhuma subscription encontrada para cancelar')
            return NextResponse.json({
                success: true,
                message: 'Nenhuma subscription para cancelar',
            })
        }

        // Cancelar todas as subscriptions ativas
        let canceledCount = 0
        for (const subscription of subscriptions) {
            if (subscription.status === 'ACTIVE' || subscription.status === 'PENDING') {
                console.log(`🔄 Cancelando subscription ${subscription.id}...`)

                const cancelResponse = await fetch(
                    `${ASAAS_API_URL}/subscriptions/${subscription.id}`,
                    {
                        method: 'DELETE',
                        headers: {
                            'access_token': ASAAS_API_KEY,
                        },
                    }
                )

                if (cancelResponse.ok) {
                    console.log(`✓ Subscription ${subscription.id} cancelada`)
                    canceledCount++
                } else {
                    console.warn(`⚠️ Erro ao cancelar subscription ${subscription.id}:`, cancelResponse.status)
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: `${canceledCount} subscription(s) cancelada(s)`,
            canceledCount,
        })
    } catch (error) {
        console.error('❌ Erro ao cancelar subscription:', error)
        return NextResponse.json(
            { warning: 'Erro ao cancelar subscription' },
            { status: 200 } // Retorna sucesso mesmo assim para não bloquear o downgrade
        )
    }
}
