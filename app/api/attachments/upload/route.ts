import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/src/lib/auth'

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        console.log('Session:', session?.user?.email)

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
        }

        const body = await req.json()
        const { keyword, base64_content } = body

        console.log('Keyword:', keyword)
        console.log('Base64 length:', base64_content?.length)

        if (!keyword || !base64_content) {
            return NextResponse.json({ error: 'Palavra-chave e arquivo são obrigatórios' }, { status: 400 })
        }

        // Obter instanceName do usuário (sanitize email)
        const instanceName = session.user.email.replace(/@/g, ' ')

        const apiKey = process.env.EVO_API_KEY
        if (!apiKey) {
            console.error('EVO_API_KEY não configurada')
            return NextResponse.json({ error: 'Configuração da API não encontrada' }, { status: 500 })
        }

        console.log('Enviando para N8N - instanceName:', instanceName, 'keyword:', keyword)

        // Enviar para N8N
        const n8nResponse = await fetch('https://n8n-panel.aria.social.br/webhook/manage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                operation: 'UPLOAD_PDF',
                apiKey,
                instanceName,
                base64_content,
                keyword: keyword.toLowerCase().trim(),
            }),
        })

        console.log('N8N Response status:', n8nResponse.status)
        console.log('N8N Response headers:', Object.fromEntries(n8nResponse.headers.entries()))

        if (!n8nResponse.ok) {
            const text = await n8nResponse.text()
            console.error('Erro N8N - Status:', n8nResponse.status, 'Response:', text)
            return NextResponse.json(
                { error: 'Erro ao processar anexo no servidor' },
                { status: 500 }
            )
        }

        const text = await n8nResponse.text()
        console.log('N8N Response text:', text)

        let result
        try {
            result = text ? JSON.parse(text) : { success: true }
        } catch (e) {
            console.log('N8N retornou resposta não-JSON:', text)
            result = { success: true, message: text }
        }

        console.log('Sucesso N8N:', result)
        return NextResponse.json({ ok: true, result })
    } catch (error: any) {
        console.error('Erro ao fazer upload de anexo:', error.message, error.stack)
        return NextResponse.json({ error: 'Erro ao enviar anexo: ' + error.message }, { status: 500 })
    }
}
