'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Button, Textarea, VStack, Heading, Text, useToast, Spinner } from '@chakra-ui/react'

export default function NewPrompt() {
    const [content, setContent] = useState('')
    const [sending, setSending] = useState(false)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const toast = useToast()

    useEffect(() => {
        let mounted = true
            ; (async () => {
                try {
                    const res = await fetch('/api/prompts/latest')
                    if (!res.ok) return
                    const data = await res.json()
                    if (!mounted) return
                    if (data?.prompt?.content) setContent(data.prompt.content)
                } catch (e) {
                    // ignore
                } finally {
                    if (mounted) setLoading(false)
                }
            })()
        return () => { mounted = false }
    }, [])



    async function handleSendToEvolution(e: React.FormEvent) {
        e.preventDefault()
        setSending(true)
        try {
            const res = await fetch('/api/prompts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, sendToEvolution: true, upsert: true }),
            })
            const data = await res.json()
            if (!res.ok) {
                toast({ title: 'Erro ao enviar prompt', description: data?.error || 'Falha ao enviar prompt', status: 'error' })
                setSending(false)
                return
            }
            toast({ title: 'Prompt alterado com sucesso', status: 'success' })
            router.push('/dashboard')
        } catch (err: any) {
            toast({ title: 'Erro ao enviar prompt', description: err?.message || 'Erro desconhecido', status: 'error' })
        } finally {
            setSending(false)
        }
    }

    return (
        <Box p={8} maxW="lg" mx="auto">
            <VStack spacing={4} as="form" onSubmit={handleSendToEvolution}>
                <Heading size="md">Instruções para IA</Heading>
                {loading ? (
                    <Spinner />
                ) : (
                    <Textarea placeholder="Escreva seu prompt aqui" value={content} onChange={(e) => setContent(e.target.value)} minH="320px" />
                )}
                <Button type="submit" isLoading={sending} colorScheme="blue">Confirmar e enviar</Button>
                <Button variant="ghost" onClick={() => router.push('/dashboard')}>Cancelar</Button>
            </VStack>
        </Box>
    )
}
