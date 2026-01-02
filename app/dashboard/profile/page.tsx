'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import InputMask from 'react-input-mask'
import {
    Box,
    Container,
    VStack,
    HStack,
    Heading,
    Text,
    Button,
    Card,
    CardBody,
    FormControl,
    FormLabel,
    Input,
    useToast,
    Spinner,
} from '@chakra-ui/react'

export default function ProfilePage() {
    const router = useRouter()
    const { data: session, status } = useSession()
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const toast = useToast()

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login')
        }
    }, [status, router])

    useEffect(() => {
        if (status === 'authenticated' && session?.user?.email) {
            // Buscar dados do usuário
            const fetchUserData = async () => {
                try {
                    const res = await fetch('/api/user/profile')
                    if (res.ok) {
                        const data = await res.json()
                        console.log('Dados do usuário:', data)
                        setName(data.name || '')
                        setPhone(data.phone || '')
                    } else {
                        console.error('Erro ao buscar dados:', res.status)
                    }
                } catch (error) {
                    console.error('Erro ao buscar dados:', error)
                }
            }
            fetchUserData()
        }
    }, [status, session?.user?.email])

    const handleSave = async () => {
        // Validações
        if (!name.trim()) {
            toast({
                title: 'Campo obrigatório',
                description: 'Por favor, digite um nome.',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            })
            return
        }

        if (password && password !== confirmPassword) {
            toast({
                title: 'Senhas não correspondem',
                description: 'As senhas digitadas não são iguais.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            return
        }

        setLoading(true)
        try {
            const res = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name.trim(),
                    phone: phone.trim() || null,
                    ...(password && { password }),
                }),
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.error || 'Erro ao atualizar perfil')
            }

            toast({
                title: 'Sucesso',
                description: 'Perfil atualizado com sucesso.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            })

            // Limpar campo de senha após sucesso
            setPassword('')
            setConfirmPassword('')
        } catch (error: any) {
            toast({
                title: 'Erro',
                description: error.message || 'Erro ao atualizar perfil.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        } finally {
            setLoading(false)
        }
    }

    if (status === 'loading') {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
                <Spinner size="lg" color="brand.500" />
            </Box>
        )
    }

    return (
        <Box bg="gray.50" minH="100vh" py={8}>
            <Container maxW="md">
                <VStack spacing={6}>
                    {/* Header */}
                    <VStack spacing={2} align="start" w="full">
                        <Button
                            as="a"
                            href="/dashboard"
                            variant="ghost"
                            size="sm"
                            colorScheme="gray"
                        >
                            ← Voltar
                        </Button>
                        <Heading size="lg" color="title.900">
                            Editar Perfil
                        </Heading>
                        <Text color="gray.600">
                            Atualize seus dados pessoais e senha
                        </Text>
                    </VStack>

                    {/* Form Card */}
                    <Card bg="white" borderRadius="xl" shadow="md" w="full">
                        <CardBody>
                            <VStack spacing={4}>
                                <FormControl>
                                    <FormLabel color="title.900" fontWeight={600}>
                                        Email
                                    </FormLabel>
                                    <Input
                                        type="email"
                                        value={session?.user?.email || ''}
                                        isDisabled
                                        bg="gray.100"
                                        cursor="not-allowed"
                                    />
                                    <Text fontSize="xs" color="gray.500" mt={1}>
                                        Email não pode ser alterado
                                    </Text>
                                </FormControl>

                                <FormControl>
                                    <FormLabel color="title.900" fontWeight={600}>
                                        Nome de Usuário
                                    </FormLabel>
                                    <Input
                                        placeholder="Seu nome"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        disabled={loading}
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel color="title.900" fontWeight={600}>
                                        Telefone
                                    </FormLabel>
                                    <Input
                                        as={InputMask}
                                        mask="(99) 99999-9999"
                                        type="tel"
                                        placeholder="(11) 99999-9999"
                                        value={phone}
                                        onChange={(e: any) => setPhone(e.target.value)}
                                        disabled={loading}
                                    />
                                </FormControl>

                                <Box
                                    pt={4}
                                    borderTop="1px solid"
                                    borderColor="gray.200"
                                    w="full"
                                >
                                    <Heading size="sm" color="title.900" mb={4}>
                                        Alterar Senha
                                    </Heading>

                                    <VStack spacing={4}>
                                        <FormControl>
                                            <FormLabel color="title.900" fontWeight={600}>
                                                Nova Senha
                                            </FormLabel>
                                            <Input
                                                type="password"
                                                placeholder="Deixe em branco para não alterar"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                disabled={loading}
                                            />
                                        </FormControl>

                                        <FormControl>
                                            <FormLabel color="title.900" fontWeight={600}>
                                                Confirmar Senha
                                            </FormLabel>
                                            <Input
                                                type="password"
                                                placeholder="Confirme a nova senha"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                disabled={loading}
                                            />
                                        </FormControl>
                                    </VStack>
                                </Box>

                                <HStack spacing={3} w="full" pt={4}>
                                    <Button
                                        as="a"
                                        href="/dashboard"
                                        variant="ghost"
                                        flex={1}
                                        colorScheme="gray"
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        colorScheme="brand"
                                        flex={1}
                                        onClick={handleSave}
                                        isLoading={loading}
                                        loadingText="Salvando..."
                                    >
                                        Salvar Alterações
                                    </Button>
                                </HStack>
                            </VStack>
                        </CardBody>
                    </Card>
                </VStack>
            </Container>
        </Box>
    )
}
