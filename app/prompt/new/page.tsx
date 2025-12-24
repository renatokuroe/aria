'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Button, Textarea, VStack, Heading, Text, Spinner, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter } from '@chakra-ui/react'

export default function NewPrompt() {
    const defaultPrompt = "Converse de forma educada, clara e natural.\nAjude o cliente a encontrar produtos e tirar dúvidas.\nApresente opções quando fizer sentido.\nSeja objetiva e evite mensagens longas."
    const [content, setContent] = useState(defaultPrompt)
    const [sending, setSending] = useState(false)
    const [loading, setLoading] = useState(true)
    const [showSuccess, setShowSuccess] = useState(false)
    const router = useRouter()
    const cancelRef = useRef(null)

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
                // toast({ title: 'Erro ao enviar prompt', description: data?.error || 'Falha ao enviar prompt', status: 'error' })
                setSending(false)
                return
            }
            setShowSuccess(true)
        } catch (err: any) {
            // toast({ title: 'Erro ao enviar prompt', description: err?.message || 'Erro desconhecido', status: 'error' })
        } finally {
            setSending(false)
        }
    }

    function handleAlertClose() {
        setShowSuccess(false)
        router.push('/dashboard')
    }

    return (
        <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="white" py={12} px={6}>
            <VStack spacing={6} as="form" onSubmit={handleSendToEvolution} maxW="lg" w="full">
                <VStack spacing={3} textAlign="center" w="full">
                    <Heading size="lg" color="green.600">Crie o comportamento do seu assistente</Heading>
                    <Text fontSize="md" color="gray.600">
                        Descreva o que o assistente deve fazer, como deve falar e o que deve evitar.
                    </Text>
                    <Text fontSize="md" color="gray.600">
                        Pense nele como alguém atendendo clientes pelo WhatsApp.
                    </Text>
                    <Text fontSize="md" color="gray.600">
                        Seja simples e direto.
                    </Text>
                </VStack>
                {loading ? (
                    <Spinner />
                ) : (
                    <Textarea placeholder="Escreva seu prompt aqui" value={content} onChange={(e) => setContent(e.target.value)} minH="320px" />
                )}
                <VStack spacing={3} bg="green.50" p={4} borderRadius="md" w="full">
                    <Heading size="sm" color="green.900">O que é um Prompt?</Heading>
                    <Text fontSize="sm" color="green.800">
                        É um conjunto de instruções que definem como o seu assistente deve se comportar. Ele orienta a IA sobre que tipo de respostas dar, o tom de voz a usar e quando pedir ajuda de um humano.
                    </Text>
                </VStack>
                <VStack spacing={2} w="full">
                    <Button type="submit" isLoading={sending} colorScheme="green" w="full">Confirmar</Button>
                </VStack>
            </VStack>

            <AlertDialog
                isOpen={showSuccess}
                leastDestructiveRef={cancelRef}
                onClose={() => { }}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            🎉 Tudo pronto!
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            Seu assistente de IA está ativo e já está recebendo mensagens no WhatsApp. Ele vai responder seus clientes automaticamente agora!
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button colorScheme="green" onClick={handleAlertClose} w="full">
                                OK
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    )
}
