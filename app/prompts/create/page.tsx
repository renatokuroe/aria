'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Button, VStack, Heading, Textarea, Input, useToast, Text } from '@chakra-ui/react'

export default function CreatePromptPage() {
    const router = useRouter()
    const toast = useToast()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSend(e: React.FormEvent) {
        e.preventDefault()
        if (!content.trim()) {
            toast({ title: 'Prompt vazio', status: 'error' })
            return
        }
        setLoading(true)
        try {
            const res = await fetch('/api/prompts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content, sendToEvolution: true }),
            })
            const data = await res.json()
            if (!res.ok) {
                toast({ title: 'Erro', description: data?.error || 'Falha ao enviar prompt', status: 'error' })
                if (res.status === 401) router.push('/auth/login')
                setLoading(false)
                return
            }

            toast({ title: 'Pronto', description: 'Prompt salvo e enviado para Evolution', status: 'success' })
            // optional: navigate to prompts list
            router.push('/prompts')
        } catch (err: any) {
            toast({ title: 'Erro', description: err?.message || 'Erro desconhecido', status: 'error' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box p={8} maxW="3xl" mx="auto">
            <form onSubmit={handleSend}>
                <VStack spacing={4} align="stretch">
                    <Heading size="md">Instruções para IA</Heading>
                    <Text>Escreva o prompt que será enviado como <code>systemPrompt</code> para o Evolution.</Text>
                    <Input placeholder="Título (opcional)" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Escreva seu prompt aqui..." minH="320px" />

                    <VStack spacing={2} align="stretch">
                        <Button colorScheme="blue" type="submit" isLoading={loading}>Confirmar e enviar</Button>
                        <Button variant="ghost" onClick={() => router.push('/dashboard')}>Cancelar</Button>
                    </VStack>
                </VStack>
            </form>
        </Box>
    )
}
