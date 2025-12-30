import { NextRequest, NextResponse } from 'next/server'

// Using sandbox for now - change to production API when ready with production key
const ASAAS_API_URL = 'https://sandbox.asaas.com/api/v3'
const ASAAS_API_KEY = process.env.ASAAS_API_KEY || '$aact_hmlg_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjNmMTNiODFkLTE4YmUtNDM5OS1iZGE3LTM3ZDRkZTk0MzI2OTo6JGFhY2hfMWIxOGQ3MjItNWJjNy00MjU3LWIyM2UtNTEyMWEzNzI4ZGVm'
const WEBHOOK_URL = 'https://n8n-panel.aria.social.br/webhook/manage'

// Debug: Log das variáveis de ambiente disponíveis
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
    console.log('🔍 DEBUG - Variáveis de ambiente:')
    console.log('  NODE_ENV:', process.env.NODE_ENV)
    console.log('  ASAAS_API_KEY exists?', !!process.env.ASAAS_API_KEY)
    console.log('  ASAAS_API_KEY length:', process.env.ASAAS_API_KEY?.length || 0)
    if (process.env.ASAAS_API_KEY) {
        console.log('  ASAAS_API_KEY start:', process.env.ASAAS_API_KEY.substring(0, 20) + '...')
    }
}

interface PaymentRequest {
    planId: string
    planValue: number
    userEmail: string
    userName: string
    cardNumber: string
    cardExpiryMonth: string
    cardExpiryYear: string
    cardCvv: string
    cardHolderName: string
    cardCpf: string
    cardEmail: string
    cardPhone: string
    cardCep: string
    addressNumber?: string
}

interface AsaasPaymentResponse {
    id: string
    dateCreated: string
    customer: string
    invoiceUrl: string
    status: string
    billingType: string
    value: number
    subscription?: string
}

// POST - Criar pagamento com cartão de crédito (recorrente)
export async function POST(request: NextRequest) {
    try {
        const body: PaymentRequest = await request.json()
        const { planId, planValue, userEmail, userName, cardNumber, cardExpiryMonth, cardExpiryYear, cardCvv, cardHolderName, cardCpf, cardEmail, cardPhone, cardCep, addressNumber } = body

        console.log('🔍 DEBUG no POST:')
        console.log('  process.env.ASAAS_API_KEY exists?', !!process.env.ASAAS_API_KEY)
        console.log('  process.env.ASAAS_API_KEY length:', process.env.ASAAS_API_KEY?.length || 0)
        console.log('  Todas as env vars com ASAAS:', Object.keys(process.env).filter(k => k.includes('ASAAS')))

        console.log('📝 POST /api/payment/asaas recebido:', { planId, planValue, userEmail, cardHolderName, cardCpf })

        // Validar dados obrigatórios
        if (!userEmail || !planValue || !cardNumber || !cardCvv || !cardCpf) {
            return NextResponse.json(
                { error: 'Email, valor, dados do cartão e CPF são obrigatórios' },
                { status: 400 }
            )
        }

        // Garantir nome do titular
        const finalCardHolderName = (cardHolderName || userName || userEmail.split('@')[0]).trim()
        if (!finalCardHolderName) {
            return NextResponse.json(
                { error: 'Informe o nome do titular do cartão' },
                { status: 400 }
            )
        }

        if (!ASAAS_API_KEY) {
            console.error('❌ Chave API ASAAS não configurada')
            console.error('  NODE_ENV:', process.env.NODE_ENV)
            console.error('  Todas as variáveis com ASAAS:', Object.keys(process.env).filter(k => k.includes('ASAAS')))
            return NextResponse.json(
                { error: 'Chave API ASAAS não configurada. Verifique a variável ASAAS_API_KEY no arquivo .env (ou .env.local em desenvolvimento)' },
                { status: 500 }
            )
        }

        console.log('✓ API Key encontrada, criando pagamento...')

        // Primeiro, buscar se customer já existe pelo email
        console.log('📋 Verificando se customer já existe...')

        const searchResponse = await fetch(`${ASAAS_API_URL}/customers?email=${encodeURIComponent(userEmail)}`, {
            method: 'GET',
            headers: {
                'access_token': ASAAS_API_KEY,
            },
        })

        let customerId: string
        let existingCustomers = []

        if (searchResponse.ok) {
            const searchData = await searchResponse.json()
            existingCustomers = searchData.data || []
            
            if (existingCustomers.length > 0) {
                // Customer já existe, usar o primeiro
                customerId = existingCustomers[0].id
                console.log('✓ Customer existente encontrado:', customerId, '(', existingCustomers[0].name, ')')
            } else {
                // Customer não existe, criar novo
                console.log('📋 Customer não existe, criando novo...')

                const customerPayload = {
                    name: finalCardHolderName,
                    email: userEmail,
                    cpfCnpj: cardCpf, // Usar CPF fornecido pelo usuário
                }

                const customerResponse = await fetch(`${ASAAS_API_URL}/customers`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'access_token': ASAAS_API_KEY,
                    },
                    body: JSON.stringify(customerPayload),
                })

                if (customerResponse.ok) {
                    const customerData = await customerResponse.json()
                    customerId = customerData.id
                    console.log('✓ Customer criado:', customerId)
                } else {
                    const errorData = await customerResponse.json()
                    console.error('❌ Erro ao criar customer:', {
                        status: customerResponse.status,
                        errors: errorData?.errors,
                        message: errorData?.message,
                        fullError: JSON.stringify(errorData)
                    })

                    // Retornar erro ao invés de usar ID alternativo
                    return NextResponse.json(
                        {
                            error: 'Erro ao criar cliente na ASAAS',
                            asaasError: errorData?.errors?.[0]?.description || errorData?.message || 'Erro ao processar dados do cliente',
                            details: errorData
                        },
                        { status: customerResponse.status }
                    )
                }
            }
        } else {
            console.warn('⚠️ Aviso ao buscar customers:', searchResponse.status)
            
            // Se não conseguir buscar, tenta criar novo mesmo assim
            const customerPayload = {
                name: finalCardHolderName,
                email: userEmail,
                cpfCnpj: cardCpf,
            }

            const customerResponse = await fetch(`${ASAAS_API_URL}/customers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'access_token': ASAAS_API_KEY,
                },
                body: JSON.stringify(customerPayload),
            })

            if (customerResponse.ok) {
                const customerData = await customerResponse.json()
                customerId = customerData.id
                console.log('✓ Customer criado (fallback):', customerId)
            } else {
                const errorData = await customerResponse.json()
                console.error('❌ Erro ao criar customer:', errorData)
                return NextResponse.json(
                    {
                        error: 'Erro ao criar cliente na ASAAS',
                        asaasError: errorData?.errors?.[0]?.description || errorData?.message || 'Erro desconhecido',
                        details: errorData
                    },
                    { status: customerResponse.status }
                )
            }
        }

        // Remover espaços e traços do número do cartão
        const cleanCardNumber = cardNumber.replace(/\s|-/g, '')

        // Criar cobrança recorrente com cartão de crédito
        // ASAAS requer creditCard e creditCardHolderInfo como objetos separados
        const paymentPayload = {
            customer: customerId,
            billingType: 'CREDIT_CARD',
            creditCard: {
                holderName: finalCardHolderName,
                number: cleanCardNumber,
                expiryMonth: cardExpiryMonth.padStart(2, '0'),
                expiryYear: '20' + cardExpiryYear, // Converte YY para YYYY
                ccv: cardCvv,
            },
            creditCardHolderInfo: {
                name: finalCardHolderName,
                email: cardEmail,
                cpfCnpj: cardCpf,
                mobilePhone: cardPhone,
                postalCode: cardCep,
                addressNumber: addressNumber || '0',
            },
            cycle: 'MONTHLY', // Recorrência mensal
            value: parseFloat(String(planValue)),
            dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            description: `Plano ${planId} - ARIA (Recorrente)`,
            externalReference: userEmail.replace('@', '-'),
            notificationUrl: `https://${request.headers.get('host')}/api/payment/webhook`,
        }

        console.log('📤 Enviando para ASAAS:', { ...paymentPayload, creditCard: { ...paymentPayload.creditCard, number: 'REDACTED' } })

        const paymentResponse = await fetch(`${ASAAS_API_URL}/payments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'access_token': ASAAS_API_KEY,
            },
            body: JSON.stringify(paymentPayload),
        })

        console.log('📥 Response ASAAS Status:', paymentResponse.status)

        if (!paymentResponse.ok) {
            const errorData = await paymentResponse.json()
            console.error('❌ Erro ASAAS:', {
                status: paymentResponse.status,
                statusText: paymentResponse.statusText,
                errors: errorData?.errors,
                fullError: JSON.stringify(errorData)
            })
            return NextResponse.json(
                {
                    error: 'Erro ao criar pagamento no ASAAS',
                    asaasError: errorData?.errors?.[0]?.description || errorData?.message || JSON.stringify(errorData),
                    details: errorData
                },
                { status: paymentResponse.status }
            )
        }

        const paymentData: AsaasPaymentResponse = await paymentResponse.json()
        console.log('✓ Pagamento criado com sucesso:', paymentData.id)
        console.log('✓ Subscription ID:', paymentData.subscription)

        return NextResponse.json({
            success: true,
            paymentId: paymentData.id,
            subscriptionId: paymentData.subscription,
            status: paymentData.status,
            value: paymentData.value,
            nextDueDate: paymentData.dateCreated,
        })
    } catch (error) {
        console.error('Erro ao processar pagamento:', error)
        return NextResponse.json(
            { error: 'Erro interno ao processar pagamento' },
            { status: 500 }
        )
    }
}

// GET - Verificar status do pagamento
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const paymentId = searchParams.get('paymentId')

        if (!paymentId) {
            return NextResponse.json(
                { error: 'ID do pagamento é obrigatório' },
                { status: 400 }
            )
        }

        if (!ASAAS_API_KEY) {
            return NextResponse.json(
                { error: 'Chave API ASAAS não configurada' },
                { status: 500 }
            )
        }

        const statusResponse = await fetch(`${ASAAS_API_URL}/payments/${paymentId}`, {
            method: 'GET',
            headers: {
                'access_token': ASAAS_API_KEY,
            },
        })

        if (!statusResponse.ok) {
            return NextResponse.json(
                { error: 'Erro ao verificar status do pagamento' },
                { status: statusResponse.status }
            )
        }

        const paymentData = await statusResponse.json()

        return NextResponse.json({
            id: paymentData.id,
            status: paymentData.status,
            value: paymentData.value,
            paidDate: paymentData.confirmedDate,
            externalReference: paymentData.externalReference,
        })
    } catch (error) {
        console.error('Erro ao verificar status:', error)
        return NextResponse.json(
            { error: 'Erro ao verificar status do pagamento' },
            { status: 500 }
        )
    }
}
