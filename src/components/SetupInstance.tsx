'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import InputMask from 'react-input-mask'
import { Box, Button, Input, VStack, Heading, Text, Image, Spinner, useToast } from '@chakra-ui/react'
import QRCode from 'react-qr-code'

export default function SetupInstanceClient({ email }: { email: string }) {
    const router = useRouter()
    const [phone, setPhone] = useState('')
    const [loading, setLoading] = useState(false)
    const [qrData, setQrData] = useState<string | null>(null)
    const toast = useToast()

    function normalizePhone(v: string) {
        return v.replace(/[^0-9]/g, '')
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setQrData(null)

        const digits = normalizePhone(phone)
        if (digits.length < 10) {
            toast({ title: 'Telefone inválido', status: 'error' })
            setLoading(false)
            return
        }

        try {
            const res = await fetch('/api/evolution/init', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: digits }),
            })
            const data = await res.json().catch(() => ({}))
            if (!res.ok) {
                toast({ title: 'Erro', description: data?.error || 'Falha ao criar instância', status: 'error' })
                return
            }

            // prefer dataUri/base64
            let qr: string | null = null
            if (typeof data.qr === 'string') qr = data.qr
            else if (typeof data.qr === 'object' && data.qr !== null) {
                if (typeof data.qr.dataUri === 'string' && data.qr.dataUri.trim()) qr = data.qr.dataUri
                else if (typeof data.qr.base64 === 'string' && data.qr.base64.trim()) qr = data.qr.base64
                else if (typeof data.qr.qr === 'string' && data.qr.qr.trim()) qr = data.qr.qr
                else if (typeof data.qr.data === 'string' && data.qr.data.trim()) qr = data.qr.data
            } else if (typeof data.qrDataUri === 'string') qr = data.qrDataUri
            else if (typeof data.qrBase64 === 'string') qr = data.qrBase64

            if (qr) {
                setQrData(qr)
            } else {
                // try fallback scanning
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
                } else {
                    const vendorMessage = data?.message || data?.qr?.raw?.message || data?.raw?.message
                    if (vendorMessage) toast({ title: 'Sem QR', description: vendorMessage, status: 'warning' })
                }
            }
        } catch (err: any) {
            toast({ title: 'Erro', description: err?.message || 'Erro desconhecido', status: 'error' })
        } finally {
            setLoading(false)
        }
    }

    // derive an image src if qrData is raw base64 or already a data URI
    const imageSrc = useMemo(() => {
        function extractBase64(s: string | null) {
            if (!s) return null
            const trimmed = s.trim()
            if (trimmed.startsWith('data:image')) return trimmed
            const base64Index = trimmed.indexOf('base64,')
            let candidate = base64Index >= 0 ? trimmed.slice(base64Index + 'base64,'.length) : trimmed
            candidate = candidate.replace(/\s+/g, '')
            const matches = candidate.match(/[A-Za-z0-9+/=]{40,}/g)
            if (matches && matches.length) {
                const longest = matches.reduce((a, b) => (a.length >= b.length ? a : b))
                return `data:image/png;base64,${longest}`
            }
            if (/^[A-Za-z0-9+/=]+$/.test(candidate) && candidate.length >= 40) return `data:image/png;base64,${candidate}`
            return null
        }

        const fromQrData = extractBase64(qrData)
        if (fromQrData) return fromQrData
        return null
    }, [qrData])

    return (
        <Box p={8} maxW="md" mx="auto">
            <VStack spacing={4} as="form" onSubmit={handleSubmit}>
                <Heading size="md">Configurar Instância</Heading>
                <Text>Usuário: {email}</Text>

                <Input as={InputMask} mask="(99) 99999-9999" value={phone} onChange={(e: any) => setPhone(e.target.value)} placeholder="(XX) XXXXX-XXXX" />

                <Button type="submit" colorScheme="blue" isLoading={loading}>Criar instância</Button>

                {loading && <Spinner />}

                {qrData ? (
                    <Box mt={4} textAlign="center">
                        <Text mb={2}>QR Code</Text>
                        {imageSrc ? (
                            <Image src={imageSrc} alt="qr" mx="auto" />
                        ) : (
                            <div style={{ background: 'white', display: 'inline-block', padding: 8 }}>
                                <QRCode value={qrData} />
                            </div>
                        )}

                        {/* Button to continue once user scanned the QR */}
                        <Button mt={4} colorScheme="green" onClick={() => router.push('/dashboard')}>
                            Pronto! Já escaneei o QR Code.
                        </Button>
                    </Box>
                ) : null}
            </VStack>
        </Box>
    )
}
