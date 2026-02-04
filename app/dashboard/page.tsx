'use client'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/src/lib/auth'
import { redirect, useRouter } from 'next/navigation'
import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { Box, VStack, HStack, Heading, Text, Button, Grid, GridItem, Card, CardBody, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from '@chakra-ui/react'
import Logo from '@/src/components/Logo'
import AdminNavLink from '@/src/components/AdminNavLink'

export default function DashboardPage() {
    const router = useRouter()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isOpenFAQ, onOpen: onOpenFAQ, onClose: onCloseFAQ } = useDisclosure()

    async function handleLogout() {
        await signOut({ redirect: false })
        router.push('/auth/login')
    }

    const faqItems = [
        {
            question: "É realmente grátis?",
            answer: "Sim! Você começa 100% grátis no plano Free com até 100 mensagens/mês. Não precisa de cartão de crédito, sem burocracia. Você só paga quando quiser mais mensagens, fazendo um upgrade."
        },
        {
            question: "Preciso de conhecimento técnico?",
            answer: "Não! Aria foi feita para ser simples e intuitiva. Se você consegue usar WhatsApp, consegue usar a Aria. Todos os passos são claros e diretos, com exemplos prontos para você personalizar."
        },
        {
            question: "Quanto tempo leva para configurar?",
            answer: "De poucos minutos! É bem rápido: cadastro, leitura do QR code, escolha de um modelo pronto, personalização rápida e pronto para usar. Você coloca em funcionamento no mesmo dia."
        },
        {
            question: "Posso escolher um exemplo pronto?",
            answer: "Sim! Você tem exemplos como 'Atendimento de Clientes', 'Dúvidas Frequentes' e 'Agendamento' que já vêm com tudo configurado. É só editar com suas informações e está pronto para usar."
        },
        {
            question: "Como a IA sabe como responder?",
            answer: "A IA aprende com os documentos e instruções que você fornece. Você controla completamente como ela deve se comportar e responder. É como ter um atendente bem treinado disponível 24/7."
        },
        {
            question: "Qual plano devo escolher?",
            answer: "Comece com o Free! Testando você descobrirá se precisa de mais. Quando atingir o limite de 100 mensagens/mês, é fácil fazer upgrade para Pro (R$ 19,90), Business (R$ 49,90) ou Enterprise (R$ 99,90)."
        },
        {
            question: "Como as mensagens são contadas?",
            answer: "Cada mensagem enviada pela IA conta como uma. O assistente responde após 3 minutos em que o usuário manda uma ou mais mensagens. Então se alguém manda 5 mensagens, o assistente aguarda 3 minutos e responde uma vez (conta como 1 mensagem da IA)."
        },
        {
            question: "Qual é a diferença para outros chatbots?",
            answer: "Ótima pergunta! Enquanto chatbots comuns são robóticos e limitados, a Aria compreende linguagem natural, aprende a partir de seus próprios materiais e oferece respostas contextualizadas como faria um atendente humano. É automação com toque humanizado."
        }
    ]

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
        {
            title: 'Editar Perfil',
            description: 'Altere seu nome de usuário e senha',
            href: '/dashboard/profile',
            icon: '👤',
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
                        <Button
                            variant="ghost"
                            size="sm"
                            colorScheme="brand"
                            onClick={onOpenFAQ}
                        >
                            Dúvidas Frequentes
                        </Button>
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


                        {/* FAQ Modal */}
                        <Modal isOpen={isOpenFAQ} onClose={onCloseFAQ} size="lg" isCentered>
                            <ModalOverlay backdropFilter="blur(4px)" />
                            <ModalContent borderRadius="xl" shadow="xl" maxH="80vh" overflowY="auto">
                                <ModalHeader color="title.900" fontWeight={700}>
                                    ❓ Dúvidas Frequentes
                                </ModalHeader>
                                <ModalCloseButton />
                                <ModalBody pb={6}>
                                    <Accordion allowToggle>
                                        {faqItems.map((item, index) => (
                                            <AccordionItem key={index}>
                                                <AccordionButton>
                                                    <Box flex="1" textAlign="left" fontWeight={600} color="title.900">
                                                        {item.question}
                                                    </Box>
                                                    <AccordionIcon />
                                                </AccordionButton>
                                                <AccordionPanel pb={4} color="gray.700">
                                                    {item.answer}
                                                </AccordionPanel>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </ModalBody>
                            </ModalContent>
                        </Modal>    <Button
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
