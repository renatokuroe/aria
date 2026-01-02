'use client'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/src/lib/auth'
import { redirect, useRouter } from 'next/navigation'
import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { Box, VStack, HStack, Heading, Text, Button, Grid, GridItem, Card, CardBody, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@chakra-ui/react'
import Logo from '@/src/components/Logo'
import AdminNavLink from '@/src/components/AdminNavLink'

export default function DashboardPage() {
    const router = useRouter()
    const { isOpen, onOpen, onClose } = useDisclosure()

    async function handleLogout() {
        await signOut({ redirect: false })
        router.push('/auth/login')
    }

    const menuItems = [
        {
            title: 'Instruções para IA',
            description: 'Configure os prompts e instruções da sua IA',
            href: '/prompt/new',
            icon: '🤖',
        },
        {
            title: 'Escanear QR Code',
            description: 'Conecte seu WhatsApp ou gere novo QR',
            href: '/qr/read',
            icon: '📱',
        },
        {
            title: 'Créditos & Upgrade',
            description: 'Verifique seus créditos e planos',
            href: '/dashboard/credits',
            icon: '⭐',
        },
    ]

    return (
        <Box minH="100vh" bg="gradient.light" py={12} px={6}>
            <VStack spacing={12} maxW="6xl" mx="auto">
                {/* Header */}
                <VStack spacing={0} textAlign="center">
                    <Logo size="xl" />
                    <Heading
                        size="lg"
                        color="title.900"
                        fontWeight={700}
                        fontFamily="'Space Grotesk', sans-serif"
                        mb={8}
                    >
                        Assistente de Respostas Inteligentes Automatizadas
                    </Heading>
                    <VStack spacing={2}>
                        <Heading size="2xl" color="title.900">Bem-vindo ao Aria</Heading>
                    </VStack>
                </VStack>

                {/* Menu Grid */}
                <Grid
                    templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
                    gap={8}
                    w="full"
                >
                    {menuItems.map((item) => (
                        <GridItem key={item.href}>
                            <Card
                                bg="white"
                                borderRadius="xl"
                                shadow="md"
                                _hover={{
                                    shadow: 'lg',
                                    transform: 'translateY(-4px)',
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                <CardBody>
                                    <VStack spacing={4} align="start" h="full">
                                        <Text fontSize="4xl">{item.icon}</Text>
                                        <VStack spacing={2} align="start" flex={1}>
                                            <Heading size="md" color="title.900">{item.title}</Heading>
                                            <Text fontSize="sm" color="gray.600">
                                                {item.description}
                                            </Text>
                                        </VStack>
                                        <Button
                                            as="a"
                                            href={item.href}
                                            colorScheme="brand"
                                            size="sm"
                                            w="full"
                                        >
                                            Acessar
                                        </Button>
                                    </VStack>
                                </CardBody>
                            </Card>
                        </GridItem>
                    ))}
                </Grid>

                {/* Footer Info */}
                <VStack spacing={3} textAlign="center" pt={8} borderTop="1px solid" borderColor="gray.200">
                    <Text fontSize="sm" color="gray.600">
                        Precisa de ajuda? Entre em contato com nosso suporte
                    </Text>
                    <HStack spacing={4} justify="center">
                        <Button as="a" href="https://wa.me/5543984590248" target="_blank" variant="ghost" size="sm" colorScheme="brand">
                            Suporte
                        </Button>
                        <AdminNavLink />
                        <Button
                            variant="ghost"
                            size="sm"
                            colorScheme="brand"
                            onClick={onOpen}
                        >
                            Sair
                        </Button>
                    </HStack>
                </VStack>
            </VStack>

            {/* Logout Modal */}
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay backdropFilter="blur(4px)" />
                <ModalContent borderRadius="xl" shadow="xl">
                    <ModalHeader color="title.900" fontWeight={700}>
                        Desconectar
                    </ModalHeader>
                    <ModalBody color="gray.600">
                        Tem certeza que deseja sair da sua conta?
                    </ModalBody>
                    <ModalFooter gap={3}>
                        <Button variant="ghost" onClick={onClose} colorScheme="gray">
                            Cancelar
                        </Button>
                        <Button
                            colorScheme="brand"
                            onClick={handleLogout}
                        >
                            Sair
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    )
}
