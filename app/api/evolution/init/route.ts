import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/src/lib/auth'
import { prisma } from '@/src/lib/prisma'

const BASE = 'https://n8n-panel.aria.social.br/webhook/manage'

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const body = await req.json()
    const phone = body.phone?.toString() || null
    const name = body.name?.toString() || null
    const email = session.user?.email
    if (!email) return NextResponse.json({ error: 'User email missing' }, { status: 400 })
    if (!phone) return NextResponse.json({ error: 'Phone required' }, { status: 400 })

    // sanitize instanceName: vendor cannot handle '@' in instance names, replace with space
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
        await callOp('CREATE_INSTANCE', { phoneNumber: phone })
        await callOp('SET_WEBHOOKS')
        
        // Salvar nome e telefone no banco de dados
        try {
            await prisma.user.update({
                where: { email },
                data: {
                    ...(name && { name }),
                    ...(phone && { phone }),
                }
            })
        } catch (dbError) {
            console.error('Erro ao salvar dados do usuário:', dbError)
            // Continua mesmo se falhar ao salvar
        }
        
        // After setup, poll GET_QR_CODE a few times (short delay) until we find base64/dataUri or exhaust retries
        async function fetchQrWithRetries(attempts = 6, delayMs = 1500) {
            let lastResp: any = null
            for (let i = 0; i < attempts; i++) {
                const q = await callOp('GET_QR_CODE')
                lastResp = q

                function looksLikeBase64(s: string) {
                    const t = s.replace(/\s+/g, '')
                    return /^[A-Za-z0-9+/=]+$/.test(t) && t.length >= 40
                }

                function extractFromObject(obj: any): { dataUri: string | null; base64: string | null } {
                    let dataUri: string | null = null
                    let base64: string | null = null

                    if (!obj) return { dataUri: null, base64: null }
                    if (typeof obj === 'string') {
                        const t = obj.trim()
                        if (t.startsWith('data:image')) return { dataUri: t, base64: null }
                        if (looksLikeBase64(t)) return { dataUri: `data:image/png;base64,${t}`, base64: t }
                        return { dataUri: null, base64: t }
                    }
                    if (typeof obj === 'object') {
                        if (typeof obj.dataUri === 'string') dataUri = obj.dataUri
                        if (typeof obj.qrBase64 === 'string') {
                            base64 = obj.qrBase64
                            if (!dataUri) dataUri = `data:image/png;base64,${obj.qrBase64}`
                        }
                        if (typeof obj.base64 === 'string') {
                            base64 = obj.base64
                            if (!dataUri) dataUri = `data:image/png;base64,${obj.base64}`
                        }
                        if (typeof obj.qr === 'string') {
                            const t = obj.qr.trim()
                            if (t.startsWith('data:image')) dataUri = t
                            else if (looksLikeBase64(t)) {
                                base64 = t
                                if (!dataUri) dataUri = `data:image/png;base64,${t}`
                            } else if (!dataUri) dataUri = t
                        }
                        // vendor uses qrCodeBase64
                        if (!dataUri && typeof obj.qrCodeBase64 === 'string') {
                            const v = obj.qrCodeBase64.trim()
                            if (v.startsWith('data:image')) dataUri = v
                            else if (looksLikeBase64(v.replace(/^data:\/\/.+;base64,/, ''))) {
                                const cleaned = v.includes('base64,') ? v.slice(v.indexOf('base64,') + 'base64,'.length) : v
                                base64 = cleaned.replace(/\s+/g, '')
                                dataUri = `data:image/png;base64,${base64}`
                            }
                        }
                        if (!dataUri && obj.raw && typeof obj.raw === 'object' && typeof obj.raw.qrCodeBase64 === 'string') {
                            const v = obj.raw.qrCodeBase64.trim()
                            if (v.startsWith('data:image')) dataUri = v
                            else if (looksLikeBase64(v.replace(/^data:\/\/.+;base64,/, ''))) {
                                const cleaned = v.includes('base64,') ? v.slice(v.indexOf('base64,') + 'base64,'.length) : v
                                base64 = cleaned.replace(/\s+/g, '')
                                dataUri = `data:image/png;base64,${base64}`
                            }
                        }
                        if (!dataUri && obj.data && typeof obj.data === 'string') {
                            const d = obj.data.trim()
                            if (d.startsWith('data:image')) dataUri = d
                            else if (looksLikeBase64(d)) {
                                base64 = d
                                dataUri = `data:image/png;base64,${d}`
                            }
                        }
                    }

                    // recursive scan: try to find embedded runs anywhere in the object
                    function findBase64InObject(objInner: any): { dataUri?: string; base64?: string } | null {
                        if (!objInner) return null
                        if (typeof objInner === 'string') {
                            const t = objInner.trim()
                            if (t.startsWith('data:image')) return { dataUri: t }
                            const base64Index = t.indexOf('base64,')
                            const candidate = base64Index >= 0 ? t.slice(base64Index + 'base64,'.length) : t
                            const cleaned = candidate.replace(/\s+/g, '')
                            const matches = cleaned.match(/[A-Za-z0-9+/=]{40,}/g)
                            if (matches && matches.length) {
                                const longest = matches.reduce((a: string, b: string) => (a.length >= b.length ? a : b))
                                return { dataUri: `data:image/png;base64,${longest}`, base64: longest }
                            }
                            if (/^[A-Za-z0-9+/=]+$/.test(cleaned) && cleaned.length >= 40) return { dataUri: `data:image/png;base64,${cleaned}`, base64: cleaned }
                            return null
                        }
                        if (Array.isArray(objInner)) {
                            for (const item of objInner) {
                                const f = findBase64InObject(item)
                                if (f) return f
                            }
                        }
                        if (typeof objInner === 'object') {
                            for (const k of Object.keys(objInner)) {
                                try {
                                    const f = findBase64InObject(objInner[k])
                                    if (f) return f
                                } catch (e) {
                                    // ignore
                                }
                            }
                        }
                        return null
                    }

                    const recovered = findBase64InObject(obj)
                    if (recovered) return { dataUri: recovered.dataUri || null, base64: recovered.base64 || null }

                    return { dataUri, base64 }
                }

                const extracted = extractFromObject(q)
                if (extracted && (extracted.dataUri || extracted.base64)) return { data: q, dataUri: extracted.dataUri || null, base64: extracted.base64 || null }

                // Wait before next retry
                if (i < attempts - 1) {
                    await new Promise(resolve => setTimeout(resolve, delayMs))
                }
            }

            // polling removed: returning null to indicate no QR found in polling function
            return { data: lastResp, dataUri: null, base64: null }
        }

        const qrResult = await fetchQrWithRetries()
        // eslint-disable-next-line no-console
        console.info('[evo] init GET_QR_CODE sampleLen=', JSON.stringify(qrResult?.data || {}).length)
        if (!qrResult || !(qrResult.dataUri || qrResult.base64)) {
            // no QR after retries
            const vendorMessage = qrResult?.data?.raw?.message || qrResult?.data?.message || qrResult?.data?.raw?.status || null
            try {
                // eslint-disable-next-line no-console
                console.info('[evo] QR raw sample:', JSON.stringify(qrResult?.data || qrResult || {}, Object.keys(qrResult?.data || qrResult || {}).slice(0, 20), 2).slice(0, 4000))
            } catch (e) {
                // ignore
            }

            return NextResponse.json({ ok: false, message: vendorMessage || 'Resposta não continha QR', qr: { dataUri: null, base64: null, raw: qrResult?.data || qrResult || null }, qrDataUri: null, qrBase64: null })
        }

        // provide convenience top-level fields for easier testing
        const { dataUri, base64 } = qrResult
        return NextResponse.json({ ok: true, qr: { dataUri, base64, raw: qrResult.data }, qrDataUri: dataUri, qrBase64: base64 })
    } catch (err: any) {
        return NextResponse.json({ error: err?.message || 'Error from EVO API' }, { status: 502 })
    }
}
