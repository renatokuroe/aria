'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Box, VStack, HStack, Heading, Text, Button, Card, CardBody, Spinner, useToast, useDisclosure, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter } from '@chakra-ui/react'
import Logo from '@/src/components/Logo'
import PaymentModal from '@/src/components/PaymentModal'

interface PlanConfig {
    id: string
    name: string
    messages: number
    price: number
}

const PLANS: PlanConfig[] = [
    { id: '100', name: 'Free', messages: 100, price: 0 },
    { id: '1000', name: 'Pro', messages: 1000, price: 19.9 },
    { id: '10000', name: 'Business', messages: 10000, price: 49.9 },
    { id: '999999', name: 'Enterprise', messages: 999999, price: 99.9 },
]

export default function CreditsPage() {
    const router = useRouter()
    const toast = useToast()
    const { data: session } = useSession()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isOpenCancelAlert, onOpen: onOpenCancelAlert, onClose: onCloseCancelAlert } = useDisclosure()
    const cancelAlertRef = useRef(null)

    const [messageCount, setMessageCount] = useState<number | null>(null)
    const [currentPlan, setCurrentPlan] = useState<number | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedPlan, setSelectedPlan] = useState<PlanConfig | null>(null)

    // Função para determinar o plano baseado na contagem de mensagens
    function getPlanName(count: number | null): string {
        if (count === null) return 'Free'
        if (count <= 100) return 'Free'
        if (count <= 1000) return 'Pro'
        if (count <= 10000) return 'Business'
        return 'Enterprise'
    }

    // Função para abrir modal de pagamento
    function handleOpenPaymentModal(plan: PlanConfig) {
        if (!session?.user?.email) {
            toast({
                title: 'Erro',
                description: 'Você precisa estar logado',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            return
        }

        if (plan.price === 0) {
            // Para o plano free, mostrar alerta de confirmação
            setSelectedPlan(plan)
            onOpenCancelAlert()
        } else {
            // Para planos pagos, abrir modal
            setSelectedPlan(plan)
            onOpen()
        }
    }

    // Fazer upgrade para plano free
    async function handleUpgradeFree(plan: PlanConfig) {
        if (!session?.user?.email) return

        try {
            setError(null)
            const emailWithoutAt = session.user.email.replace('@', ' ')

            const response = await fetch('https://n8n-panel.aria.social.br/webhook/manage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    operation: 'SET_PLAN',
                    apiKey: 'EvoApiKeySecreta2025',
                    instanceName: emailWithoutAt,
                    plan: String(plan.messages),
                }),
            })

            if (!response.ok) {
                throw new Error('Erro ao fazer upgrade do plano')
            }

            setCurrentPlan(plan.messages)

            toast({
                title: 'Plano atualizado com sucesso!',
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'top-right',
            })
        } catch (err: any) {
            console.error('Erro:', err)
            setError(err.message || 'Erro ao fazer upgrade do plano')
        }
    }

    // Callback quando pagamento é confirmado
    async function handlePaymentSuccess() {
        if (!session?.user?.email || !selectedPlan) return

        try {
            const emailWithoutAt = session.user.email.replace('@', ' ')

            // Aguardar um pouco para o n8n processar
            await new Promise(resolve => setTimeout(resolve, 2000))

            const response = await fetch('https://n8n-panel.aria.social.br/webhook/manage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    operation: 'SET_PLAN',
                    apiKey: 'EvoApiKeySecreta2025',
                    instanceName: emailWithoutAt,
                    plan: String(selectedPlan.messages),
                }),
            })

            if (response.ok) {
                // Atualizar plano ativo
                setCurrentPlan(selectedPlan.messages)
                // Resetar contagem de mensagens UTILIZADAS para 0
                setMessageCount(0)
                setSelectedPlan(null)

                toast({
                    title: 'Pagamento confirmado!',
                    description: 'Seu plano foi atualizado com sucesso.',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                    position: 'top-right',
                })
            }
        } catch (err: any) {
            console.error('Erro ao atualizar plano:', err)
        }
    }

    useEffect(() => {
        async function fetchData() {
            if (!session?.user?.email) return

            try {
                setLoading(true)
                setError(null)

                // Remover o @ do email e substituir por espaço em branco
                const emailWithoutAt = session.user.email.replace('@', ' ')

                // Buscar contagem de mensagens
                const countResponse = await fetch('https://n8n-panel.aria.social.br/webhook/manage', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        operation: 'GET_MESSAGE_COUNT',
                        apiKey: 'EvoApiKeySecreta2025',
                        instanceName: emailWithoutAt,
                    }),
                })

                if (!countResponse.ok) {
                    throw new Error('Erro ao buscar contagem de mensagens')
                }

                const countData = await countResponse.json()
                console.log('Resposta GET_MESSAGE_COUNT:', countData)
                console.log('Email utilizado:', emailWithoutAt)

                // A API retorna um número direto
                let count = 0
                if (countData === null || countData === undefined) {
                    count = 0
                } else if (typeof countData === 'number') {
                    count = countData
                } else if (typeof countData === 'string') {
                    const parsed = parseInt(countData, 10)
                    count = isNaN(parsed) ? 0 : parsed
                } else {
                    count = countData?.messageCount || countData?.message_count || countData?.count || 0
                }
                setMessageCount(count)

                // Buscar plano atual
                try {
                    const planResponse = await fetch('https://n8n-panel.aria.social.br/webhook/manage', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            operation: 'GET_PLAN',
                            apiKey: 'EvoApiKeySecreta2025',
                            instanceName: emailWithoutAt,
                        }),
                    })

                    if (planResponse.ok) {
                        const planData = await planResponse.json()
                        console.log('Resposta GET_PLAN (raw):', planData)
                        console.log('Tipo de planData:', typeof planData)
                        console.log('planData stringificado:', JSON.stringify(planData))

                        // O plano é retornado como um número
                        let plan = null
                        if (planData === null || planData === undefined) {
                            console.warn('GET_PLAN retornou null/undefined')
                            plan = null
                        } else if (typeof planData === 'number' && planData > 0) {
                            plan = planData
                            console.log('GET_PLAN retornou número:', plan)
                        } else if (typeof planData === 'string' && planData.trim() !== '') {
                            const parsed = parseInt(planData, 10)
                            if (!isNaN(parsed) && parsed > 0) {
                                plan = parsed
                                console.log('GET_PLAN retornou string convertida:', plan)
                            }
                        } else if (typeof planData === 'object') {
                            plan = planData?.plan || planData?.Plan || planData?.messageLimit || planData?.planLimit
                            if (plan && plan > 0) {
                                console.log('GET_PLAN retornou objeto com plan:', plan)
                            } else {
                                plan = null
                            }
                        }

                        if (plan && plan > 0) {
                            console.log('Plano definido com sucesso como:', plan)
                            setCurrentPlan(plan)
                        } else {
                            console.warn('GET_PLAN retornou valor inválido, usando fallback')
                            throw new Error('GET_PLAN retornou valor inválido')
                        }
                    } else {
                        throw new Error('Falha ao buscar plano - status: ' + planResponse.status)
                    }
                } catch (planErr: any) {
                    console.warn('Erro ao buscar plano via API, usando fallback:', planErr.message)
                    // Fallback: determinar baseado na contagem
                    console.log('Usando fallback com count:', count)
                    if (count <= 100) {
                        setCurrentPlan(100)
                        console.log('Fallback: Free (count <= 100)')
                    } else if (count <= 1000) {
                        setCurrentPlan(1000)
                        console.log('Fallback: Pro (count <= 1000)')
                    } else if (count <= 10000) {
                        setCurrentPlan(10000)
                        console.log('Fallback: Business (count <= 10000)')
                    } else {
                        setCurrentPlan(999999)
                        console.log('Fallback: Enterprise (count > 10000)')
                    }
                }
            } catch (err: any) {
                console.error('Erro ao carregar dados:', err)
                setError(err.message || 'Erro ao buscar dados')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [session])

    return (
        <Box minH="100vh" bg="gradient.light" py={12} px={6}>
            <VStack spacing={8} maxW="6xl" mx="auto">
                {/* Header com logo */}
                <VStack spacing={4} textAlign="center">
                    <Logo size="lg" />
                    <Heading
                        size="lg"
                        color="title.900"
                        fontWeight={700}
                        fontFamily="'Space Grotesk', sans-serif"
                    >
                        Créditos & Upgrade
                    </Heading>
                </VStack>

                {/* Card de Contagem de Mensagens */}
                <Card
                    bg="white"
                    borderRadius="xl"
                    shadow="lg"
                    w="full"
                    maxW="500px"
                >
                    <CardBody>
                        <VStack spacing={6} align="center">
                            <VStack spacing={2} textAlign="center">
                                <Text
                                    fontSize="sm"
                                    color="gray.600"
                                    fontWeight={600}
                                    textTransform="uppercase"
                                    letterSpacing="0.05em"
                                >
                                    Mensagens Utilizadas
                                </Text>
                                <Heading
                                    size="4xl"
                                    color="brand.600"
                                    fontFamily="'Space Grotesk', sans-serif"
                                >
                                    {loading ? (
                                        <Spinner size="lg" color="brand.600" />
                                    ) : error ? (
                                        <Text fontSize="lg" color="red.500">
                                            Erro ao carregar
                                        </Text>
                                    ) : (
                                        messageCount?.toLocaleString('pt-BR')
                                    )}
                                </Heading>
                            </VStack>

                            {!loading && !error && (
                                <Box
                                    w="full"
                                    p={4}
                                    bg="green.50"
                                    borderRadius="lg"
                                    borderLeft="4px solid"
                                    borderColor="brand.500"
                                >
                                    <Text fontSize="sm" color="gray.700" textAlign="center">
                                        Você utilizou <strong>{messageCount?.toLocaleString('pt-BR')}</strong> mensagens até o momento.
                                    </Text>
                                </Box>
                            )}

                            {error && (
                                <Box
                                    w="full"
                                    p={4}
                                    bg="red.50"
                                    borderRadius="lg"
                                    borderLeft="4px solid"
                                    borderColor="red.500"
                                >
                                    <Text fontSize="sm" color="red.700" textAlign="center">
                                        {error}
                                    </Text>
                                </Box>
                            )}

                            {/* Informações de Plano */}
                            <VStack spacing={3} w="full" pt={4} borderTop="1px solid" borderColor="gray.200">
                                <VStack spacing={1} align="start" w="full">
                                    <Text fontSize="sm" fontWeight={600} color="title.900">
                                        Seu Plano Atual
                                    </Text>
                                    <Text fontSize="sm" color="gray.600">
                                        {loading ? 'Carregando...' : `Plano: ${getPlanName(currentPlan)}`}
                                    </Text>
                                </VStack>
                            </VStack>
                        </VStack>
                    </CardBody>
                </Card>

                {/* Cards de Planos */}
                <Box w="full">
                    <Heading
                        size="md"
                        color="title.900"
                        fontFamily="'Space Grotesk', sans-serif"
                        mb={6}
                        textAlign="center"
                    >
                        Escolha seu Plano
                    </Heading>

                    <VStack spacing={4} w="full">
                        {/* Plano Free */}
                        <Card
                            bg="white"
                            borderRadius="xl"
                            shadow="md"
                            w="full"
                            _hover={{
                                shadow: 'lg',
                                transition: 'all 0.3s ease',
                            }}
                            borderTop="4px solid"
                            borderTopColor="gray.300"
                        >
                            <CardBody>
                                <HStack justify="space-between" align="start">
                                    <VStack spacing={2} align="start" flex={1}>
                                        <Heading size="md" color="title.900">Free</Heading>
                                        <Text fontSize="sm" color="gray.600">
                                            Para começar
                                        </Text>
                                        <Heading size="lg" color="brand.600" pt={2}>
                                            Até 100 mensagens/mês
                                        </Heading>
                                    </VStack>
                                    <Button
                                        colorScheme="brand"
                                        size="sm"
                                        onClick={() => handleOpenPaymentModal(PLANS[0])}
                                        isDisabled={currentPlan === 100}
                                        variant={currentPlan === 100 ? 'solid' : 'solid'}
                                    >
                                        {currentPlan === 100 ? 'Ativo' : 'Contratar plano'}
                                    </Button>
                                </HStack>
                            </CardBody>
                        </Card>

                        {/* Plano Pro */}
                        <Card
                            bg="white"
                            borderRadius="xl"
                            shadow="md"
                            w="full"
                            _hover={{
                                shadow: 'lg',
                                transition: 'all 0.3s ease',
                            }}
                            borderTop="4px solid"
                            borderTopColor="brand.400"
                        >
                            <CardBody>
                                <HStack justify="space-between" align="start">
                                    <VStack spacing={2} align="start" flex={1}>
                                        <Heading size="md" color="title.900">Pro</Heading>
                                        <Text fontSize="sm" color="gray.600">
                                            Para profissionais
                                        </Text>
                                        <Heading size="lg" color="brand.600" pt={2}>
                                            1.000 mensagens/mês
                                        </Heading>
                                        <Text fontSize="md" fontWeight={600} color="title.900">
                                            R$ 19,90/mês
                                        </Text>
                                    </VStack>
                                    <Button
                                        colorScheme="brand"
                                        size="sm"
                                        onClick={() => handleOpenPaymentModal(PLANS[1])}
                                        isDisabled={currentPlan === 1000}
                                        variant={currentPlan === 1000 ? 'solid' : 'solid'}
                                    >
                                        {currentPlan === 1000 ? 'Ativo' : 'Contratar plano'}
                                    </Button>
                                </HStack>
                            </CardBody>
                        </Card>

                        {/* Plano Business */}
                        <Card
                            bg="white"
                            borderRadius="xl"
                            shadow="md"
                            w="full"
                            _hover={{
                                shadow: 'lg',
                                transition: 'all 0.3s ease',
                            }}
                            borderTop="4px solid"
                            borderTopColor="brand.500"
                        >
                            <CardBody>
                                <HStack justify="space-between" align="start">
                                    <VStack spacing={2} align="start" flex={1}>
                                        <Heading size="md" color="title.900">Business</Heading>
                                        <Text fontSize="sm" color="gray.600">
                                            Para empresas
                                        </Text>
                                        <Heading size="lg" color="brand.600" pt={2}>
                                            10.000 mensagens/mês
                                        </Heading>
                                        <Text fontSize="md" fontWeight={600} color="title.900">
                                            R$ 49,90/mês
                                        </Text>
                                    </VStack>
                                    <Button
                                        colorScheme="brand"
                                        size="sm"
                                        onClick={() => handleOpenPaymentModal(PLANS[2])}
                                        isDisabled={currentPlan === 10000}
                                        variant={currentPlan === 10000 ? 'solid' : 'solid'}
                                    >
                                        {currentPlan === 10000 ? 'Ativo' : 'Contratar plano'}
                                    </Button>
                                </HStack>
                            </CardBody>
                        </Card>

                        {/* Plano Enterprise */}
                        <Card
                            bg="white"
                            borderRadius="xl"
                            shadow="md"
                            w="full"
                            _hover={{
                                shadow: 'lg',
                                transition: 'all 0.3s ease',
                            }}
                            borderTop="4px solid"
                            borderTopColor="brand.700"
                        >
                            <CardBody>
                                <HStack justify="space-between" align="start">
                                    <VStack spacing={2} align="start" flex={1}>
                                        <Heading size="md" color="title.900">Enterprise</Heading>
                                        <Text fontSize="sm" color="gray.600">
                                            Solução sem limites
                                        </Text>
                                        <Heading size="lg" color="brand.600" pt={2}>
                                            Mensagens Ilimitadas
                                        </Heading>
                                        <Text fontSize="md" fontWeight={600} color="title.900">
                                            R$ 99,90/mês
                                        </Text>
                                    </VStack>
                                    <Button
                                        colorScheme="brand"
                                        size="sm"
                                        onClick={() => handleOpenPaymentModal(PLANS[3])}
                                        isDisabled={currentPlan === 999999}
                                        variant={currentPlan === 999999 ? 'solid' : 'solid'}
                                    >
                                        {currentPlan === 999999 ? 'Ativo' : 'Contratar plano'}
                                    </Button>
                                </HStack>
                            </CardBody>
                        </Card>
                    </VStack>
                </Box>

                {/* Botão de Voltar */}
                <Button
                    variant="ghost"
                    colorScheme="brand"
                    size="md"
                    onClick={() => router.push('/dashboard')}
                >
                    ← Voltar ao Dashboard
                </Button>
            </VStack>

            {/* Modal de Pagamento */}
            {selectedPlan && (
                <PaymentModal
                    isOpen={isOpen}
                    onClose={onClose}
                    planId={selectedPlan.id}
                    planName={selectedPlan.name}
                    planValue={selectedPlan.price}
                    userEmail={session?.user?.email || ''}
                    userName={session?.user?.name || ''}
                    onPaymentSuccess={handlePaymentSuccess}
                    currentPlanValue={
                        currentPlan === 100 ? 0 :
                            currentPlan === 1000 ? 19.9 :
                                currentPlan === 10000 ? 49.9 :
                                    currentPlan === 999999 ? 99.9 : 0
                    }
                />
            )}

            {/* Alerta de confirmação para cancelamento de plano */}
            <AlertDialog
                isOpen={isOpenCancelAlert}
                leastDestructiveRef={cancelAlertRef}
                onClose={onCloseCancelAlert}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Cancelar Assinatura
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            Tem certeza que deseja cancelar sua assinatura? Suas mensagens restantes que foram contratadas serão perdidas.
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelAlertRef} onClick={onCloseCancelAlert}>
                                Manter Plano
                            </Button>
                            <Button colorScheme='red' onClick={() => {
                                if (selectedPlan) {
                                    handleUpgradeFree(selectedPlan)
                                }
                                onCloseCancelAlert()
                            }} ml={3}>
                                Cancelar Assinatura
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    )
}
