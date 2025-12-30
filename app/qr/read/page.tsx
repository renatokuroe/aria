'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Button, VStack, Heading, Text, Image, Spinner, Alert, AlertIcon } from '@chakra-ui/react'

export default function QRReader() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [qrData, setQrData] = useState<string | null>(null)
    const [isConnected, setIsConnected] = useState(false)

    async function fetchQr() {
        setLoading(true)
        setQrData(null)
        setIsConnected(false)
        try {
            console.log('[qr/read] Fetching QR code...')
            const res = await fetch('/api/evolution/qr', { method: 'POST', headers: { 'Content-Type': 'application/json' } })
            const data = await res.json().catch(() => ({}))

            console.log('[qr/read] Response status:', res.status)
            console.log('[qr/read] Response ok:', res.ok)
            console.log('[qr/read] Response keys:', data ? Object.keys(data) : [])
            console.log('[qr/read] Full response:', JSON.stringify(data).slice(0, 500))

            if (!res.ok) {
                console.warn('[qr/read] Error response:', data?.error || data?.message)
                return
            }

            let qrCandidate =
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
                console.log('[qr/read] Found QR candidate')
                setQrData(qrCandidate)
                return
            }

            function findBase64(obj: any): string | null {
                if (!obj) return null
                if (typeof obj === 'string') {
                    const t = obj.trim()
                    if (t.startsWith('data:image')) return t
                    if (/^[A-Za-z0-9+/=]{40,}$/.test(t.replace(/\s+/g, ''))) return t
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
                        try {
                            const f = findBase64(obj[k])
                            if (f) return f
                        } catch (e) {
                            // ignore
                        }
                    }
                }
                return null
            }

            const fallback = findBase64(data)
            if (fallback) {
                console.log('[qr/read] Found via fallback scan')
                setQrData(fallback)
                return
            }

            const vendorMessage = data?.message || data?.qr?.raw?.message || data?.raw?.message
            console.warn('[qr/read] No QR found. Vendor message:', vendorMessage)
            console.warn('[qr/read] Full payload:', JSON.stringify(data, null, 2).slice(0, 2000))

            // Se não encontrou QR, provavelmente está conectado
            setIsConnected(true)
        } catch (err: any) {
            console.error('[qr/read] Exception:', err?.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchQr()
    }, [])

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
        <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="white" py={12} px={6}>
            <VStack spacing={4} maxW="md" w="full">
                <Heading size="md">Escanear QR Code</Heading>
                <Text>Refaça a leitura do QR Code para dar acesso à IA (pode ser necessário quando o QR code expira).</Text>

                {loading && <Spinner />}

                {isConnected && !qrData && (
                    <Alert status="info" variant="left-accent">
                        <AlertIcon />
                        <VStack align="flex-start" spacing={2} w="full">
                            <Text fontWeight="bold">Instância já conectada</Text>
                            <Text fontSize="sm">
                                Esta instância já está conectada a um dispositivo WhatsApp.
                                Para gerar um novo QR Code, você precisa desconectar primeiro.
                            </Text>
                            <Button colorScheme="blue" size="sm" mt={2} onClick={() => router.push('/dashboard')}>
                                Voltar para o Dashboard
                            </Button>
                        </VStack>
                    </Alert>
                )}

                {qrData ? (
                    <Box textAlign="center" mt={4}>
                        {imageSrc ? (
                            <Image src={imageSrc} alt="qr" mx="auto" maxW="350px" h="350px" />
                        ) : (
                            <Box bg="white" display="inline-block" p={4} minW="350px" minH="350px">
                                <pre style={{ whiteSpace: 'pre-wrap', maxWidth: '330px' }}>{qrData.slice(0, 200)}</pre>
                            </Box>
                        )}

                        <Button mt={4} colorScheme="brand" onClick={() => router.push('/dashboard')}>
                            Pronto! Já escaneei o QR Code.
                        </Button>
                    </Box>
                ) : null}

            </VStack>
        </Box>
    )
}
