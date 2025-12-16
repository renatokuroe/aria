'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Button, VStack, Heading, Text, Image, Spinner, useToast } from '@chakra-ui/react'

export default function QRReader() {
    const router = useRouter()
    const toast = useToast()
    const [loading, setLoading] = useState(false)
    const [qrData, setQrData] = useState<string | null>(null)

    async function fetchQr() {
        setLoading(true)
        setQrData(null)
        try {
            const res = await fetch('/api/evolution/qr', { method: 'POST', headers: { 'Content-Type': 'application/json' } })
            const data = await res.json().catch(() => ({}))
            if (!res.ok) {
                toast({ title: 'Erro', description: data?.error || 'Falha ao obter QR', status: 'error' })
                return
            }

            // prefer dataUri, then base64, then raw.qr
            const qrCandidate =
                data?.qrDataUri ||
                data?.qr?.dataUri ||
                data?.qrBase64 ||
                data?.qr?.base64 ||
                data?.qr?.qr ||
                data?.qr?.data ||
                data?.qr?.raw?.qrCodeBase64 ||
                data?.raw?.qrCodeBase64 ||
                (typeof data?.qr === 'string' ? data.qr : null)

            if (qrCandidate) {
                setQrData(qrCandidate)
                return
            }

            // try to find any base64-like string inside the response
            function looksLikeBase64(s: string) {
                const t = s.replace(/\s+/g, '')
                return /^[A-Za-z0-9+/=]+$/.test(t) && t.length >= 40 && (t.includes('=') || t.length % 4 === 0)
            }
            function findBase64(obj: any): string | null {
                if (!obj) return null
                if (typeof obj === 'string') {
                    const t = obj.trim()
                    if (t.startsWith('data:image')) return t
                    if (looksLikeBase64(t)) return t
                    return null
                }
                if (Array.isArray(obj)) {
                    for (const item of obj) {
                        const f = findBase64(item)
                        if (f) return f
                    }
                }
                if (typeof obj === 'object') {
                    for (const k of Object.keys(obj)) {
                        const f = findBase64(obj[k])
                        if (f) return f
                    }
                }
                return null
            }
            const fallback = findBase64(data.qr || data)
            if (fallback) {
                setQrData(fallback)
                return
            }

            const vendorMessage = data?.message || data?.qr?.raw?.message || data?.raw?.message
            if (vendorMessage) toast({ title: 'Sem QR', description: vendorMessage || 'Resposta não continha QR', status: 'warning' })
            return
        } catch (err: any) {
            toast({ title: 'Erro', description: err?.message || 'Erro desconhecido', status: 'error' })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchQr()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const imageSrc = useMemo(() => {
        function extractBase64(s: string | null) {
            if (!s) return null
            const trimmed = s.trim()
            if (trimmed.startsWith('data:image')) return trimmed
            // if it contains 'base64,' extract part after it
            const base64Index = trimmed.indexOf('base64,')
            let candidate = base64Index >= 0 ? trimmed.slice(base64Index + 'base64,'.length) : trimmed
            // remove whitespace/newlines
            candidate = candidate.replace(/\s+/g, '')
            // find longest contiguous run of base64-like chars
            const matches = candidate.match(/[A-Za-z0-9+/=]{40,}/g)
            if (matches && matches.length) {
                const longest = matches.reduce((a, b) => (a.length >= b.length ? a : b))
                return `data:image/png;base64,${longest}`
            }
            // fallback: if whole candidate looks base64-ish
            if (/^[A-Za-z0-9+/=]+$/.test(candidate) && candidate.length >= 40) return `data:image/png;base64,${candidate}`
            return null
        }

        // try qrData first
        const fromQrData = extractBase64(qrData)
        if (fromQrData) return fromQrData

        return null
    }, [qrData])

    return (
        <Box p={8} maxW="md" mx="auto">
            <VStack spacing={4}>
                <Heading size="md">Ler / Regenerar QR</Heading>
                <Text>Regenerate o QR Code para sua instância (pode ser necessário quando o QR expira).</Text>

                {loading && <Spinner />}

                {qrData ? (
                    <Box textAlign="center" mt={4}>
                        <Text mb={2}>QR Code</Text>
                        {imageSrc ? (
                            <Image src={imageSrc} alt="qr" mx="auto" />
                        ) : (
                            <Box bg="white" display="inline-block" p={4}>
                                <pre style={{ whiteSpace: 'pre-wrap' }}>{qrData}</pre>
                            </Box>
                        )}

                        <Button mt={4} colorScheme="green" onClick={() => router.push('/dashboard')}>
                            Pronto! Já escaneei o QR Code.
                        </Button>
                    </Box>
                ) : null}

                <VStack spacing={2} mt={4}>
                    <Button onClick={() => fetchQr()} colorScheme="blue">Regenerar QR</Button>
                    <Button variant="ghost" onClick={() => router.push('/dashboard')}>Voltar</Button>
                </VStack>

            </VStack>
        </Box>
    )
}
