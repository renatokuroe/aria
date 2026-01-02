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
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Spinner,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    useDisclosure,
    FormControl,
    FormLabel,
    Input,
    Select,
    Badge,
} from '@chakra-ui/react'

interface User {
    id: string
    email: string
    name: string | null
    role: string
    credits: number
    createdAt: string
    _count: {
        prompts: number
        qrReads: number
    }
}

export default function AdminUsers() {
    const router = useRouter()
    const { data: session, status } = useSession()
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [selectedUserDetails, setSelectedUserDetails] = useState<any>(null)
    const [editFormData, setEditFormData] = useState({ name: '', role: '', credits: 0, password: '', phone: '' })
    const [loadingDetails, setLoadingDetails] = useState(false)
    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login')
        }
    }, [status, router])

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('/api/admin/users')
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
                if (!res.ok) throw new Error('Erro ao buscar usuários')
                const data = await res.json()
                setUsers(data)
            } catch (error) {
                toast({
                    title: 'Erro',
                    description: 'Erro ao carregar usuários.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                })
            } finally {
                setLoading(false)
            }
        }

        if (status === 'authenticated') {
            fetchUsers()
        }
    }, [status, toast, router])

    const handleEdit = async (user: User) => {
        setSelectedUser(user)
        setEditFormData({
            name: user.name || '',
            role: user.role,
            credits: user.credits,
            password: '',
            phone: '',
        })

        // Buscar detalhes do usuário incluindo mensagens e telefone
        setLoadingDetails(true)
        try {
            const res = await fetch(`/api/admin/users/${user.id}`)
            if (res.ok) {
                const details = await res.json()
                console.log('Detalhes do usuário:', details)
                setSelectedUserDetails(details)
                // Atualizar o formulário com os dados completos
                setEditFormData({
                    name: details.name || '',
                    role: details.role,
                    credits: details.credits,
                    password: '',
                    phone: details.phone || '',
                })
            }
        } catch (error) {
            console.error('Erro ao buscar detalhes:', error)
        } finally {
            setLoadingDetails(false)
        }

        onOpen()
    }

    const handleSaveEdit = async () => {
        if (!selectedUser) return

        try {
            const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editFormData),
            })

            if (!res.ok) throw new Error('Erro ao atualizar usuário')

            const updated = await res.json()
            setUsers(users.map(u => u.id === updated.id ? { ...u, ...updated } : u))
            toast({
                title: 'Sucesso',
                description: 'Usuário atualizado com sucesso.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            })
            onClose()
        } catch (error) {
            toast({
                title: 'Erro',
                description: 'Erro ao atualizar usuário.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja deletar este usuário? Esta ação não pode ser desfeita.')) {
            return
        }

        try {
            const res = await fetch(`/api/admin/users/${id}`, {
                method: 'DELETE',
            })

            if (!res.ok) throw new Error('Erro ao deletar usuário')

            setUsers(users.filter(u => u.id !== id))
            toast({
                title: 'Sucesso',
                description: 'Usuário deletado com sucesso.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            })
        } catch (error) {
            toast({
                title: 'Erro',
                description: 'Erro ao deletar usuário.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        }
    }

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
                <VStack spacing={6} align="stretch">
                    {/* Header */}
                    <HStack justify="space-between" align="center">
                        <VStack align="start" spacing={2}>
                            <Heading size="2xl" color="title.900">
                                Gerenciar Usuários
                            </Heading>
                            <Text color="gray.600">
                                Total de {users.length} usuário(s)
                            </Text>
                        </VStack>
                        <Button
                            as="a"
                            href="/admin"
                            colorScheme="gray"
                            size="lg"
                        >
                            ← Voltar
                        </Button>
                    </HStack>

                    {/* Users Table */}
                    <Card bg="white" borderRadius="xl" shadow="md" overflow="hidden">
                        <CardBody p={0}>
                            <TableContainer>
                                <Table variant="simple" size="sm">
                                    <Thead bg="gray.100">
                                        <Tr>
                                            <Th>Email</Th>
                                            <Th>Nome</Th>
                                            <Th>Role</Th>
                                            <Th>Criado em</Th>
                                            <Th>Ações</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {users.map((user) => (
                                            <Tr key={user.id} _hover={{ bg: 'gray.50' }}>
                                                <Td fontWeight="medium" color="title.900">{user.email}</Td>
                                                <Td>{user.name || '-'}</Td>
                                                <Td>
                                                    <Badge
                                                        colorScheme={user.role === 'admin' ? 'red' : 'green'}
                                                        textTransform="capitalize"
                                                    >
                                                        {user.role}
                                                    </Badge>
                                                </Td>
                                                <Td fontSize="sm" color="gray.500">
                                                    {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                                                </Td>
                                                <Td>
                                                    <HStack spacing={2}>
                                                        <Button
                                                            size="sm"
                                                            colorScheme="blue"
                                                            onClick={() => handleEdit(user)}
                                                            variant="ghost"
                                                        >
                                                            ✏️ Editar
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            colorScheme="red"
                                                            onClick={() => handleDelete(user.id)}
                                                            variant="ghost"
                                                        >
                                                            🗑️ Deletar
                                                        </Button>
                                                    </HStack>
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </CardBody>
                    </Card>
                </VStack>
            </Container>

            {/* Edit Modal */}
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Editar Usuário</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4}>
                            <FormControl>
                                <FormLabel>Email</FormLabel>
                                <Input
                                    type="email"
                                    value={selectedUser?.email || ''}
                                    isDisabled
                                    bg="gray.100"
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Nome</FormLabel>
                                <Input
                                    placeholder="Nome do usuário"
                                    value={editFormData.name}
                                    onChange={(e) =>
                                        setEditFormData({ ...editFormData, name: e.target.value })
                                    }
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Telefone</FormLabel>
                                <Input
                                    as={InputMask}
                                    mask="(99) 99999-9999"
                                    type="tel"
                                    placeholder="(11) 99999-9999"
                                    value={editFormData.phone}
                                    onChange={(e: any) =>
                                        setEditFormData({ ...editFormData, phone: e.target.value })
                                    }
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Role</FormLabel>
                                <Select
                                    value={editFormData.role}
                                    onChange={(e) =>
                                        setEditFormData({ ...editFormData, role: e.target.value })
                                    }
                                >
                                    <option value="user">Usuário</option>
                                    <option value="admin">Admin</option>
                                </Select>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Senha (deixe em branco para não alterar)</FormLabel>
                                <Input
                                    type="password"
                                    placeholder="Nova senha"
                                    value={editFormData.password}
                                    onChange={(e) =>
                                        setEditFormData({ ...editFormData, password: e.target.value })
                                    }
                                />
                            </FormControl>

                            {loadingDetails ? (
                                <Box w="full" py={4} textAlign="center">
                                    <Spinner size="sm" color="brand.500" />
                                </Box>
                            ) : selectedUserDetails ? (
                                <Box w="full" p={4} bg="gray.50" borderRadius="lg" borderLeft="4px solid" borderLeftColor="brand.500">
                                    <VStack align="start" spacing={3}>
                                        <Heading size="sm" color="title.900">
                                            📊 Consumo de Recursos
                                        </Heading>
                                        <HStack justify="space-between" w="full">
                                            <Text fontSize="sm" color="gray.600">Mensagens utilizadas:</Text>
                                            <Text fontSize="lg" fontWeight="bold" color="brand.600">
                                                {selectedUserDetails.messageCount?.toLocaleString('pt-BR') || '0'}
                                            </Text>
                                        </HStack>
                                        <HStack justify="space-between" w="full">
                                            <Text fontSize="sm" color="gray.600">Plano atual:</Text>
                                            <Text fontSize="lg" fontWeight="bold" color="brand.600">
                                                {selectedUserDetails.currentPlan?.toLocaleString('pt-BR') || '0'}
                                            </Text>
                                        </HStack>
                                    </VStack>
                                </Box>
                            ) : null}
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <HStack spacing={3}>
                            <Button variant="ghost" onClick={onClose}>
                                Cancelar
                            </Button>
                            <Button colorScheme="blue" onClick={handleSaveEdit}>
                                Salvar
                            </Button>
                        </HStack>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    )
}
