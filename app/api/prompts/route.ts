import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/src/lib/auth'

export async function GET() {
    const prompts = await prisma.prompt.findMany({ take: 50, orderBy: { createdAt: 'desc' } })
    return NextResponse.json(prompts)
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    const body = await req.json()
    const { title, content, sendToEvolution, upsert } = body

    // Dev-only logging to help debug client failures
    if (process.env.NODE_ENV === 'development') {
        try {
            console.log('[prompts] POST by', session?.user?.email, 'payload:', JSON.stringify(body).slice(0, 1000))
        } catch (e) {
            console.log('[prompts] POST logging error', e)
        }
    }

    if (!content) return NextResponse.json({ error: 'Content required' }, { status: 400 })

    // If upsert flag is set, update the user's latest prompt or create one
    let prompt
    if (upsert) {
        const existing = await prisma.prompt.findFirst({ where: { userId: session.user?.id as string }, orderBy: { createdAt: 'desc' } })
        if (existing) {
            prompt = await prisma.prompt.update({ where: { id: existing.id }, data: { title: title ?? existing.title, content } })
        } else {
            prompt = await prisma.prompt.create({ data: { title: title ?? null, content, userId: session.user?.id as string } })
        }
    } else {
        prompt = await prisma.prompt.create({ data: { title, content, userId: session.user?.id as string } })
    }
    // If requested, forward prompt to Evolution (n8n-panel) using server-side ENV key
    if (sendToEvolution) {
        const evoKey = process.env.EVO_API_KEY
        if (!evoKey) return NextResponse.json({ error: 'EVO_API_KEY not configured' }, { status: 500 })

        // Build payload and send as JSON (no need to depend on jq/curl on the server)
        const rawInstance = session.user?.email || session.user?.name || 'unknown'
        const instanceName = (rawInstance || 'unknown').replace(/@/g, ' ')

        const payload = {
            operation: 'SET_PROMPT',
            instanceName,
            systemPrompt: content,
        }

        try {
            const res = await fetch('https://n8n-panel.aria.social.br/webhook/manage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-api-key': `${evoKey}` },
                body: JSON.stringify(payload),
            })
            const body = await res.text().catch(() => '')
            // Attempt to parse JSON body if any
            let parsed: any = null
            try { parsed = body ? JSON.parse(body) : null } catch (e) { parsed = body }
            return NextResponse.json({ prompt, evolution: { ok: res.ok, status: res.status, body: parsed } })
        } catch (err: any) {
            return NextResponse.json({ prompt, evolution: { ok: false, error: err?.message || String(err) } }, { status: 502 })
        }
    }

    return NextResponse.json(prompt)
}
