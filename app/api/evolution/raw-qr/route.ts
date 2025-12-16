import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/src/lib/auth'

const BASE = 'https://n8n-panel.aria.social.br/webhook/manage'

export async function GET(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const email = session.user?.email
    if (!email) return NextResponse.json({ error: 'User email missing' }, { status: 400 })

    // sanitize instanceName
    const instanceName = (email || '').replace(/@/g, ' ')

    const apiKey = process.env.EVO_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'EVO API key not configured' }, { status: 500 })

    async function callOp(operation: string, extra: any = {}) {
        const body = { operation, instanceName, ...extra }
        const res = await fetch(BASE, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': `${apiKey}` }, body: JSON.stringify(body) })
        let json
        try {
            json = await res.json()
        } catch (e) {
            json = { status: res.status }
        }
        if (!res.ok) throw new Error(json?.error || `Operation ${operation} failed`)
        return json
    }

    try {
        const raw = await callOp('GET_QR_CODE')

        // Helpful debug log: show type and sample of the payload (avoid huge dumps)
        try {
            // eslint-disable-next-line no-console
            console.info('[evo:raw] type=', typeof raw, 'keys=', raw && typeof raw === 'object' ? Object.keys(raw) : undefined)
            // eslint-disable-next-line no-console
            console.info('[evo:raw] sample:', JSON.stringify(raw, Object.keys(raw || {}).slice(0, 10), 2).slice(0, 2000))
        } catch (e) {
            // ignore logging failures
        }

        return NextResponse.json({ ok: true, raw })
    } catch (err: any) {
        return NextResponse.json({ error: err?.message || 'Error from EVO API' }, { status: 502 })
    }
}
