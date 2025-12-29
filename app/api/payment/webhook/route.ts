import { NextRequest, NextResponse } from 'next/server'

const N8N_WEBHOOK_URL = 'https://n8n-panel.aria.social.br/webhook/manage'

// Webhook para processar notificações do ASAAS
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Estrutura do webhook do ASAAS
        const {
            id,
            event,
            payment: {
                id: paymentId,
                externalReference,
                value,
                status,
            } = {},
        } = body

        console.log('🔔 Webhook ASAAS recebido:', { event, status, externalReference, value })

        // Processa pagamentos confirmados (tanto PIX quanto cartão)
        if (event === 'payment_confirmed' || status === 'CONFIRMED') {
            // Extrair email da referência externa
            const email = externalReference?.replace('-', '@') || ''

            if (!email) {
                console.error('❌ Email não encontrado na referência externa')
                return NextResponse.json({ error: 'Email não encontrado' }, { status: 400 })
            }

            console.log('✓ Pagamento confirmado para:', email)
            console.log('  Valor:', value)
            console.log('  Payment ID:', paymentId)

            // Preparar dados para enviar ao n8n
            // Remover @ e substituir por espaço conforme o formato esperado
            const instanceName = email.replace('@', ' ')

            const webhookPayload = {
                operation: 'PAYMENT_RECEIVED',
                payment: {
                    value: parseFloat(String(value)),
                    externalReference: instanceName,
                },
                instanceName: instanceName,
            }

            console.log('📤 Enviando para n8n:', webhookPayload)

            // Enviar para n8n com retry
            let n8nResponse
            let retries = 0
            const maxRetries = 3

            while (retries < maxRetries) {
                try {
                    n8nResponse = await fetch(N8N_WEBHOOK_URL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(webhookPayload),
                    })

                    if (n8nResponse.ok) {
                        console.log('✓ Webhook enviado com sucesso para n8n')
                        break
                    } else if (retries < maxRetries - 1) {
                        retries++
                        console.warn(`⚠️ Erro ao enviar para n8n (tentativa ${retries}):`, n8nResponse.status)
                        await new Promise(resolve => setTimeout(resolve, 1000 * retries)) // Espera progressivamente
                    } else {
                        console.error('❌ Falha ao enviar para n8n após', maxRetries, 'tentativas')
                        throw new Error(`HTTP ${n8nResponse.status}`)
                    }
                } catch (error) {
                    if (retries < maxRetries - 1) {
                        retries++
                        console.warn(`⚠️ Erro de rede ao enviar para n8n (tentativa ${retries}):`, error)
                        await new Promise(resolve => setTimeout(resolve, 1000 * retries))
                    } else {
                        console.error('❌ Falha de rede ao enviar para n8n após', maxRetries, 'tentativas:', error)
                        throw error
                    }
                }
            }

            // Atualizar status de pagamento no banco de dados (opcional)
            // Você pode guardar o registro de pagamento para referência
            console.log('✓ Pagamento processado com sucesso para:', email)
            return NextResponse.json({ success: true, processed: true, email, value })
        }

        // Outros eventos são ignorados
        console.log('⏭️ Evento ignorado:', event)
        return NextResponse.json({ success: true, processed: false })
    } catch (error) {
        console.error('❌ Erro ao processar webhook:', error)
        return NextResponse.json(
            { error: 'Erro ao processar webhook', details: String(error) },
            { status: 500 }
        )
    }
}

