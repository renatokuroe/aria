'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
    Box,
    Container,
    VStack,
    HStack,
    Heading,
    Text,
    Button,
    Grid,
    GridItem,
    Card,
    CardBody,
    Spinner,
    useToast,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
} from '@chakra-ui/react'

interface Stats {
    totalUsers: number
    totalPrompts: number
    totalQRReads: number
    totalCredits: number
    newUsersThisWeek: number
    usersByRole: { role: string; _count: number }[]
}

export default function AdminDashboard() {
    const router = useRouter()
    const { data: session, status } = useSession()
    const [stats, setStats] = useState<Stats | null>(null)
    const [loading, setLoading] = useState(true)
    const toast = useToast()

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login')
        }
    }, [status, router])

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/admin/stats')
                if (res.status === 401) {
                    toast({
                        title: 'Acesso negado',
                        description: 'Você não tem permissão para acessar esta página.',
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    })
                    router.push('/dashboard')
                    return
                }
                if (!res.ok) throw new Error('Erro ao buscar estatísticas')
                const data = await res.json()
                setStats(data)
            } catch (error) {
                toast({
                    title: 'Erro',
                    description: 'Erro ao carregar estatísticas.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                })
            } finally {
                setLoading(false)
            }
        }

        if (status === 'authenticated') {
            fetchStats()
        }
    }, [status, toast, router])

    if (status === 'loading' || loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
                <Spinner size="lg" color="brand.500" />
            </Box>
        )
    }

    return (
        <Box bg="gray.50" minH="100vh" py={8}>
            <Container maxW="7xl">
                <VStack spacing={8} align="stretch">
                    {/* Header */}
                    <HStack justify="space-between" align="center">
                        <VStack align="start" spacing={2}>
                            <Heading size="2xl" color="title.900">
                                Painel Administrativo
                            </Heading>
                            <Text color="gray.600">
                                Visão geral e gerenciamento do sistema
                            </Text>
                        </VStack>
                        <Button
                            as="a"
                            href="/admin/users"
                            colorScheme="brand"
                            size="lg"
                        >
                            Gerenciar Usuários
                        </Button>
                    </HStack>

                    {/* Stats Grid */}
                    {stats && (
                        <Grid
                            templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
                            gap={6}
                        >
                            <Card bg="white" borderRadius="xl" shadow="md">
                                <CardBody>
                                    <Stat>
                                        <StatLabel color="gray.600">Total de Usuários</StatLabel>
                                        <StatNumber color="title.900" fontSize="3xl">
                                            {stats.totalUsers}
                                        </StatNumber>
                                        <StatHelpText color="gray.500">
                                            {stats.newUsersThisWeek} esta semana
                                        </StatHelpText>
                                    </Stat>
                                </CardBody>
                            </Card>
                        </Grid>
                    )}

                    {/* Users by Role */}
                    {stats && (
                        <Card bg="white" borderRadius="xl" shadow="md">
                            <CardBody>
                                <Heading size="md" mb={4} color="title.900">
                                    Usuários por Tipo
                                </Heading>
                                <Grid templateColumns="repeat(auto-fit, minmax(150px, 1fr))" gap={4}>
                                    {stats.usersByRole.map((role) => (
                                        <Box key={role.role} p={4} bg="gray.50" borderRadius="lg">
                                            <Text fontSize="sm" color="gray.600" textTransform="capitalize">
                                                {role.role}
                                            </Text>
                                            <Text fontSize="2xl" fontWeight="bold" color="title.900">
                                                {role._count}
                                            </Text>
                                        </Box>
                                    ))}
                                </Grid>
                            </CardBody>
                        </Card>
                    )}
                </VStack>
            </Container>
        </Box>
    )
}
