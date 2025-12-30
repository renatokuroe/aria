'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Button, Textarea, VStack, HStack, Heading, Text, Spinner, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure, Card, CardBody } from '@chakra-ui/react'
import { PROMPT_TEMPLATES } from '@/src/data/promptTemplates'

export default function NewPrompt() {
    const defaultPrompt = "Converse de forma educada, clara e natural.\nAjude o cliente a encontrar produtos e tirar dúvidas.\nApresente opções quando fizer sentido.\nSeja objetiva e evite mensagens longas."
    const [content, setContent] = useState(defaultPrompt)
    const [sending, setSending] = useState(false)
    const [loading, setLoading] = useState(true)
    const [showSuccess, setShowSuccess] = useState(false)
    const [isFirstPrompt, setIsFirstPrompt] = useState(true)
    const router = useRouter()
    const cancelRef = useRef(null)
    const { isOpen: isOpenTemplates, onOpen: onOpenTemplates, onClose: onCloseTemplates } = useDisclosure()

    useEffect(() => {
        let mounted = true
            ; (async () => {
                try {
                    const res = await fetch('/api/prompts/latest')
                    if (!res.ok) return
                    const data = await res.json()
                    if (!mounted) return
                    if (data?.prompt?.content) {
                        setContent(data.prompt.content)
                        setIsFirstPrompt(false)
                    }
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
            if (isFirstPrompt) {
                setShowSuccess(true)
            } else {
                router.push('/dashboard')
            }
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

    function handleSelectTemplate(templatePrompt: string) {
        setContent(templatePrompt)
        onCloseTemplates()
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
                    <Text fontSize="sm" color="blue.600" cursor="pointer" textDecoration="underline" onClick={onOpenTemplates}>
                        Não sabe por onde começar? Clique aqui e veja alguns exemplos prontos
                    </Text>
                </VStack>

                {loading ? (
                    <Spinner />
                ) : (
                    <Textarea placeholder="Escreva seu prompt aqui" value={content} onChange={(e) => setContent(e.target.value)} minH="320px" />
                )}

                {/* Observação sobre produtos e preços */}
                <VStack spacing={2} bg="blue.50" p={4} borderRadius="md" w="full" borderLeft="4px" borderColor="blue.500">
                    <Heading size="sm" color="blue.900">💡 Dica: Adicione seus Produtos e Preços</Heading>
                    <Text fontSize="sm" color="blue.800">
                        Se você tem uma <strong>loja com produtos</strong>, um <strong>catálogo de serviços</strong>, ou uma <strong>tabela de preços</strong>, 
                        adicione esses detalhes no prompt! A IA usará essas informações para responder aos clientes automaticamente.
                    </Text>
                    <Text fontSize="sm" color="blue.800">
                        Exemplos:
                    </Text>
                    <Box bg="white" p={3} borderRadius="md" fontSize="xs" w="full" fontFamily="mono" color="blue.700">
                        <Text>Produtos: Camiseta R$ 49,90 | Calça R$ 99,90 | Jaqueta R$ 149,90</Text>
                        <Text>Serviços: Corte R$ 50 | Coloração R$ 150 | Progressiva R$ 200</Text>
                        <Text>Cardápio: Pizza Grande R$ 45 | Refrigerante R$ 8 | Sobremesa R$ 15</Text>
                    </Box>
                </VStack>
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

            {/* Modal de Prompts Pré-definidos */}
            <Modal isOpen={isOpenTemplates} onClose={onCloseTemplates} size="2xl" isCentered scrollBehavior="inside">
                <ModalOverlay />
                <ModalContent maxH="90vh">
                    <ModalHeader>
                        <Heading size="md">Exemplos de Prompts por Segmento</Heading>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <VStack spacing={4} align="stretch">
                            {PROMPT_TEMPLATES.map((template, index) => (
                                <Card key={index} borderLeft="4px" borderColor="green.500">
                                    <CardBody>
                                        <VStack align="start" spacing={2}>
                                            <Heading size="sm" color="green.600">{template.segment}</Heading>
                                            <Text fontSize="sm" color="gray.600">{template.description}</Text>
                                            <Box bg="gray.50" p={3} borderRadius="md" w="full" fontSize="xs" color="gray.700" fontFamily="mono" maxH="120px" overflowY="auto">
                                                {template.prompt.split('\n').map((line, i) => (
                                                    <Text key={i}>{line}</Text>
                                                ))}
                                            </Box>
                                            <Button size="sm" colorScheme="green" w="full" onClick={() => handleSelectTemplate(template.prompt)}>
                                                Quero usar esse
                                            </Button>
                                        </VStack>
                                    </CardBody>
                                </Card>
                            ))}
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>

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
