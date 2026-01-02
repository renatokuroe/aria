'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import InputMask from 'react-input-mask'
import { Box, Button, Input, VStack, Heading, Text, Image, Spinner, useToast, FormControl, FormLabel } from '@chakra-ui/react'
import QRCode from 'react-qr-code'

export default function SetupInstanceClient({ email }: { email: string }) {
    const router = useRouter()
    const [name, setName] = useState('')
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

        if (!name.trim()) {
            toast({ title: 'Nome obrigatório', status: 'error' })
            setLoading(false)
            return
        }

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
                body: JSON.stringify({ phone: phone, name: name.trim() }),
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
        <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="white" py={12} px={6}>
            {!qrData ? (
                <VStack spacing={4} as="form" onSubmit={handleSubmit} maxW="md" w="full">
                    <Heading size="md">Configure sua conta</Heading>
                    <Text>Usuário: {email}</Text>

                    <FormControl>
                        <FormLabel color="title.900" fontWeight={600}>
                            Nome de Usuário
                        </FormLabel>
                        <Input placeholder="Seu nome" value={name} onChange={(e: any) => setName(e.target.value)} />
                    </FormControl>

                    <FormControl>
                        <FormLabel color="title.900" fontWeight={600}>
                            Número de WhatsApp
                        </FormLabel>
                        <Input as={InputMask} mask="(99) 99999-9999" value={phone} onChange={(e: any) => setPhone(e.target.value)} placeholder="(XX) XXXXX-XXXX" />
                    </FormControl>

                    <Button type="submit" colorScheme="green" isLoading={loading}>Próximo</Button>

                    {loading && <Spinner />}
                </VStack>
            ) : (
                <VStack spacing={6} maxW="md" w="full" textAlign="center">
                    <VStack spacing={3}>
                        <Heading size="md">Escaneie o QR Code</Heading>
                        <Text fontSize="sm" color="gray.600">
                            Abra o WhatsApp no seu celular e escaneie o código abaixo usando a câmera ou o leitor de QR Code integrado no app.
                        </Text>
                    </VStack>

                    {imageSrc ? (
                        <Image src={imageSrc} alt="qr" mx="auto" />
                    ) : (
                        <div style={{ background: 'white', display: 'inline-block', padding: 8 }}>
                            <QRCode value={qrData} />
                        </div>
                    )}

                    <VStack spacing={3} bg="green.50" p={4} borderRadius="md" w="full">
                        <Heading size="sm" color="green.900">Para que serve?</Heading>
                        <Text fontSize="sm" color="green.800">
                            Ao escanear este QR Code, você conectará seu WhatsApp com o Aria. Isso permite que o assistente de IA receba e responda mensagens automaticamente em sua conta.
                        </Text>
                    </VStack>

                    <Button colorScheme="green" w="full" onClick={() => router.push('/prompt/new')}>
                        Pronto! Já escaneei o QR Code.
                    </Button>
                </VStack>
            )}
        </Box>
    )
}
