import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/src/lib/auth'

const BASE = 'https://n8n-panel.aria.social.br/webhook/manage'

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const email = session.user?.email
    if (!email) return NextResponse.json({ error: 'User email missing' }, { status: 400 })

    // sanitize instanceName to remove '@'
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
        // Single attempt: GET_QR_CODE once
        const qr = await callOp('GET_QR_CODE')
        // debug: log small sample/length to help trace whether vendor returned data
        // eslint-disable-next-line no-console
        console.info('[evo] GET_QR_CODE called - sampleLen=', JSON.stringify(qr || '').length)

        // normalize result (same logic used in /init)
        function looksLikeBase64(s: string) {
            const t = s.replace(/\s+/g, '')
            return /^[A-Za-z0-9+/=]+$/.test(t) && t.length >= 40
        }

        // search recursively through nested objects/strings for a data:image or base64 run
        function findBase64InObject(obj: any): { dataUri?: string; base64?: string } | null {
            if (!obj) return null
            if (typeof obj === 'string') {
                const t = obj.trim()
                if (t.startsWith('data:image')) return { dataUri: t }
                const base64Index = t.indexOf('base64,')
                const candidate = base64Index >= 0 ? t.slice(base64Index + 'base64,'.length) : t
                const cleaned = candidate.replace(/\s+/g, '')
                const matches = cleaned.match(/[A-Za-z0-9+/=]{40,}/g)
                if (matches && matches.length) {
                    const longest = matches.reduce((a: string, b: string) => (a.length >= b.length ? a : b))
                    return { dataUri: `data:image/png;base64,${longest}`, base64: longest }
                }
                if (looksLikeBase64(cleaned)) return { dataUri: `data:image/png;base64,${cleaned}`, base64: cleaned }
                return null
            }
            if (Array.isArray(obj)) {
                for (const item of obj) {
                    const f = findBase64InObject(item)
                    if (f) return f
                }
            }
            if (typeof obj === 'object') {
                for (const k of Object.keys(obj)) {
                    try {
                        const f = findBase64InObject(obj[k])
                        if (f) return f
                    } catch (e) {
                        // ignore
                    }
                }
            }
            return null
        }

        let dataUri: string | null = null
        let base64: string | null = null

        if (typeof qr === 'string') {
            const t = qr.trim()
            if (t.startsWith('data:image')) dataUri = t
            else if (looksLikeBase64(t)) {
                base64 = t
                dataUri = `data:image/png;base64,${t}`
            } else {
                base64 = t
            }
        } else if (qr && typeof qr === 'object') {
            if (typeof qr.dataUri === 'string') dataUri = qr.dataUri
            if (typeof qr.qrBase64 === 'string') {
                base64 = qr.qrBase64
                if (!dataUri) dataUri = `data:image/png;base64,${qr.qrBase64}`
            }
            if (typeof qr.base64 === 'string') {
                base64 = qr.base64
                if (!dataUri) dataUri = `data:image/png;base64,${qr.base64}`
            }
            if (typeof qr.qr === 'string') {
                const t = qr.qr.trim()
                if (t.startsWith('data:image')) dataUri = t
                else if (looksLikeBase64(t)) {
                    base64 = t
                    if (!dataUri) dataUri = `data:image/png;base64,${t}`
                } else if (!dataUri) dataUri = t
            }
            // vendor uses qrCodeBase64
            if (!dataUri && typeof qr.qrCodeBase64 === 'string') {
                const v = qr.qrCodeBase64.trim()
                if (v.startsWith('data:image')) dataUri = v
                else if (looksLikeBase64(v.replace(/^data:\/\/.+;base64,/, ''))) {
                    const cleaned = v.includes('base64,') ? v.slice(v.indexOf('base64,') + 'base64,'.length) : v
                    base64 = cleaned.replace(/\s+/g, '')
                    dataUri = `data:image/png;base64,${base64}`
                }
            }
            if (!dataUri && qr.raw && typeof qr.raw === 'object' && typeof qr.raw.qrCodeBase64 === 'string') {
                const v = qr.raw.qrCodeBase64.trim()
                if (v.startsWith('data:image')) dataUri = v
                else if (looksLikeBase64(v.replace(/^data:\/\/.+;base64,/, ''))) {
                    const cleaned = v.includes('base64,') ? v.slice(v.indexOf('base64,') + 'base64,'.length) : v
                    base64 = cleaned.replace(/\s+/g, '')
                    dataUri = `data:image/png;base64,${base64}`
                }
            }
            if (!dataUri && qr.data && typeof qr.data === 'string') {
                const d = qr.data.trim()
                if (d.startsWith('data:image')) dataUri = d
                else if (looksLikeBase64(d)) {
                    base64 = d
                    dataUri = `data:image/png;base64,${d}`
                }
            }
        }

        if (!dataUri && !base64) {
            // try to scan the raw payload for embedded base64/data:image strings
            const fromScan = findBase64InObject(qr)
            if (fromScan) {
                base64 = fromScan.base64 || null
                dataUri = fromScan.dataUri || null
                // eslint-disable-next-line no-console
                console.info('[evo] QR recovered from raw payload via scanner')
            }
        }

        if (!dataUri && !base64) {
            // collect vendor message if present
            const vendorMessage = qr && typeof qr === 'object' ? (qr.raw?.message || qr.message || qr.raw?.status || null) : null
            try {
                // eslint-disable-next-line no-console
                console.info('[evo] QR normalized { hasDataUri: false, hasBase64: false }')
                // eslint-disable-next-line no-console
                console.info('[evo] QR raw sample:', JSON.stringify(qr, Object.keys(qr || {}).slice(0, 20), 2).slice(0, 4000))
            } catch (e) {
                // ignore
            }

            return NextResponse.json({ ok: false, message: vendorMessage || 'Resposta não continha QR', qr: { dataUri, base64, raw: qr }, qrDataUri: null, qrBase64: null })
        }

        return NextResponse.json({ ok: true, qr: { dataUri, base64, raw: qr }, qrDataUri: dataUri, qrBase64: base64 })
    } catch (err: any) {
        return NextResponse.json({ error: err?.message || 'Error from EVO API' }, { status: 502 })
    }
}
