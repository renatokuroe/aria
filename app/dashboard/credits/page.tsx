'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Box, VStack, HStack, Heading, Text, Button, Card, CardBody, Spinner, useToast } from '@chakra-ui/react'
import Logo from '@/src/components/Logo'

export default function CreditsPage() {
    const router = useRouter()
    const toast = useToast()
    const { data: session } = useSession()
    const [messageCount, setMessageCount] = useState<number | null>(null)
    const [currentPlan, setCurrentPlan] = useState<number | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [upgradingPlan, setUpgradingPlan] = useState<string | null>(null)

    // Função para determinar o plano baseado na contagem de mensagens
    function getPlanName(count: number | null): string {
        if (count === null) return 'Free'
        if (count <= 100) return 'Free'
        if (count <= 1000) return 'Pro'
        if (count <= 10000) return 'Business'
        return 'Enterprise'
    }

    // Função para fazer upgrade de plano
    async function handleUpgradePlan(planMessages: number) {
        if (!session?.user?.email) return

        try {
            setUpgradingPlan(String(planMessages))
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
                    plan: String(planMessages),
                }),
            })

            if (!response.ok) {
                throw new Error('Erro ao fazer upgrade do plano')
            }

            // Atualizar o plano atual após o upgrade
            setCurrentPlan(planMessages)

            // Exibir toast de sucesso
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
        } finally {
            setUpgradingPlan(null)
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
                const count = typeof countData === 'number' ? countData : (countData.messageCount || countData.message_count || countData.count || 0)
                setMessageCount(count)

                // Buscar plano atual
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
                    console.log('Resposta GET_PLAN:', planData)

                    // O plano é retornado como um número
                    const plan = typeof planData === 'number' ? planData : (planData.plan || planData.Plan || planData.messageLimit || 100)
                    setCurrentPlan(plan)
                } else {
                    // Se falhar em buscar o plano, determinar baseado na contagem
                    if (count <= 100) setCurrentPlan(100)
                    else if (count <= 1000) setCurrentPlan(1000)
                    else if (count <= 10000) setCurrentPlan(10000)
                    else setCurrentPlan(999999)
                }
            } catch (err: any) {
                console.error('Erro:', err)
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
                                        onClick={() => handleUpgradePlan(100)}
                                        isLoading={upgradingPlan === '100'}
                                        isDisabled={upgradingPlan !== null || currentPlan === 100}
                                        variant={currentPlan === 100 ? 'solid' : 'solid'}
                                    >
                                        {currentPlan === 100 ? 'Ativo' : 'Fazer Upgrade'}
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
                                        onClick={() => handleUpgradePlan(1000)}
                                        isLoading={upgradingPlan === '1000'}
                                        isDisabled={upgradingPlan !== null || currentPlan === 1000}
                                        variant={currentPlan === 1000 ? 'solid' : 'solid'}
                                    >
                                        {currentPlan === 1000 ? 'Ativo' : 'Fazer Upgrade'}
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
                                        onClick={() => handleUpgradePlan(10000)}
                                        isLoading={upgradingPlan === '10000'}
                                        isDisabled={upgradingPlan !== null || currentPlan === 10000}
                                        variant={currentPlan === 10000 ? 'solid' : 'solid'}
                                    >
                                        {currentPlan === 10000 ? 'Ativo' : 'Fazer Upgrade'}
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
                                        onClick={() => handleUpgradePlan(999999)}
                                        isLoading={upgradingPlan === '999999'}
                                        isDisabled={upgradingPlan !== null || currentPlan === 999999}
                                        variant={currentPlan === 999999 ? 'solid' : 'solid'}
                                    >
                                        {currentPlan === 999999 ? 'Ativo' : 'Fazer Upgrade'}
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
        </Box>
    )
}
