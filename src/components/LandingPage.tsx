'use client'

import { useState } from 'react'
import { Box, Container, VStack, HStack, Heading, Text, Button, Grid, Card, CardBody, Image, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useDisclosure, Badge } from '@chakra-ui/react'

export default function LandingPage() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isOpenPrices, onOpen: onOpenPrices, onClose: onClosePrices } = useDisclosure()

    return (
        <Box bg="white">
            {/* Header com Gradiente e Transparência */}
            <Box
                background="linear-gradient(90deg, rgba(255, 255, 255, 0.7) 0%, rgba(27, 94, 32, 0.7) 50%, rgba(76, 175, 80, 0.7) 100%)"
                backdropFilter="blur(10px)"
                py={0}
                px={6}
                boxShadow="md"
                position="fixed"
                top={0}
                left={0}
                right={0}
                zIndex={20}
                h="60px"
            >
                <Container maxW="7xl" h="100%">
                    <HStack justify="space-between" align="center" h="100%">
                        <Image
                            src="/logo-full-green-no-bg.webp"
                            alt="Aria Logo"
                            h="96px"
                            w="auto"
                        />
                        <Button as="a" href="/auth/login" colorScheme="brand" size="md">
                            Entrar
                        </Button>
                    </HStack>
                </Container>
            </Box>
            {/* Hero com Banner ao Fundo */}
            <Box
                position="relative"
                display="flex"
                alignItems="flex-start"
                w="100vw"
                marginLeft="calc(-50vw + 50%)"
                h={{ base: "600px", md: "1200px" }}
                pt={8}
                mt={{ base: "60px", md: "60px" }}
            >
                {/* Banner Background */}
                <Box
                    position="absolute"
                    top={0}
                    right={0}
                    bottom={0}
                    backgroundImage="url('/bg-main-green.webp')"
                    backgroundPosition="right"
                    backgroundRepeat="no-repeat"
                    backgroundSize="contain"
                    zIndex={0}
                    w="80%"
                    h={{ base: "600px", md: "1200px" }}
                    display={{ base: "none", lg: "block" }}
                />

                {/* Logo Blue - Topo Esquerdo */}
                <Box position="absolute" top={0} left={6} zIndex={1} display={{ base: "none", lg: "block" }}>
                    <Image
                        src="/logo-green-no-bg.webp"
                        alt="Logo Blue"
                        w="750px"
                        h="auto"
                    />
                </Box>

                {/* Logo Blue - Embaixo Centralizado */}
                <Box position="absolute" bottom="20px" left="50%" transform="translateX(calc(-50% + 300px))" zIndex={1} display={{ base: "none", lg: "block" }}>
                    <Image
                        src="/logo-green-no-bg.webp"
                        alt="Logo Blue"
                        w="700px"
                        h="auto"
                    />
                </Box>

                {/* Conteúdo */}
                <Container maxW="7xl" position="relative" zIndex={10} h="100%">
                    <VStack align="start" spacing={6} maxW={{ base: "100%", lg: "50%" }} justify="center" h="100%">
                        <Heading size={{ base: "2xl", lg: "4xl" }} color="title.900">
                            Rápido como seu negócio precisa
                        </Heading>
                        <Text fontSize={{ base: "lg", lg: "2xl" }} color="gray.600" maxW="90%">
                            Em poucos instantes, você conecta a Inteligência Artificial ao WhatsApp da sua empresa e coloca um assistente virtual em funcionamento. Nada de configurações extensas ou processos demorados — aqui, tudo acontece com agilidade e precisão.
                        </Text>
                        <Button as="a" href="/auth/register" colorScheme="brand" size="lg">
                            Assine nosso plano gratuito
                        </Button>
                    </VStack>
                </Container>
            </Box>

            {/* Sem Necessidade de Cartão de Crédito */}
            <Box
                py={36}
                bg="#2e7d32"
                w="100vw"
                marginLeft="calc(-50vw + 50%)"
            >
                <Container maxW="7xl">
                    <VStack spacing={6} textAlign="center">
                        <Heading size="2xl" color="white" fontWeight="bold">
                            Não precisa do cartão de crédito!
                        </Heading>
                        <Text fontSize="2xl" color="white" maxW="800px" mx="auto">
                            Quer usar nosso plano <strong>gratuito</strong> e tem medo de cobranças inesperadas na sua fatura? Não se preocupe, você pode assinar o plano gratuito da Aria sem a <strong>necessidade de cadastrar o seu cartão</strong> de crédito!
                        </Text>
                    </VStack>
                </Container>
            </Box>

            {/* O que é */}
            <Box
                py={20}
                position="relative"
                minH="600px"
                display="flex"
                alignItems="center"
                bg="#e8f5e9"
                w="100vw"
                marginLeft="calc(-50vw + 50%)"
            >
                {/* Smartphone Background - Lado Direito */}
                <Box
                    position="absolute"
                    top={0}
                    right="-100px"
                    bottom={0}
                    backgroundImage="url('/smartphones.webp')"
                    backgroundPosition="right"
                    backgroundRepeat="no-repeat"
                    backgroundSize="contain"
                    zIndex={0}
                    w="50%"
                    display={{ base: "none", lg: "block" }}
                />

                {/* Logo Blue - Topo Esquerdo */}
                <Box position="absolute" top="20px" left={6} zIndex={1} display={{ base: "none", lg: "block" }}>
                    <Image
                        src="/logo-green-no-bg.webp"
                        alt="Logo Blue"
                        w="750px"
                        h="auto"
                    />
                </Box>

                {/* Conteúdo */}
                <Container maxW="7xl" position="relative" zIndex={2}>
                    <VStack spacing={12}>
                        <VStack spacing={4} textAlign="center" maxW={{ base: "100%", lg: "50%" }} mx="auto">
                            <Heading size="2xl" color="title.900">
                                O que é um Agente de IA para WhatsApp?
                            </Heading>
                            <Text fontSize="2xl" color="gray.600">
                                Um agente de IA para WhatsApp é uma ferramenta capaz de responder automaticamente aos seus clientes utilizando inteligência artificial baseada em documentos e instruções que você fornece. Ao contrário dos chatbots comuns, ele compreende a linguagem natural, aprende a partir dos seus próprios materiais e oferece respostas contextualizadas — como faria um atendente humano.
                            </Text>
                        </VStack>

                        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6} w="100%">
                            {[
                                {
                                    title: "Prático do início ao fim",
                                    description: "Cada etapa foi planejada para ser direta, intuitiva e acessível. Você configura, personaliza e acompanha seu assistente sem precisar de conhecimentos técnicos. A tecnologia trabalha nos bastidores enquanto você foco nas demandas reais do seu dia a dia."
                                },
                                {
                                    title: "Fácil de usar",
                                    description: "Tudo é simples e direto. Você não precisa entender de tecnologia: os passos são claros, e qualquer pessoa consegue configurar o assistente sem dificuldade."
                                },
                                {
                                    title: "Feito para pequenas empresas",
                                    description: "Enquanto muitas ferramentas de IA são pensadas para grandes estruturas, esta plataforma nasceu com um propósito diferente: atender negócios menores que precisam de respostas rápidas, automações eficientes e um sistema que não complique sua rotina."
                                },
                                {
                                    title: "Automatize",
                                    description: "O assistente responde clientes, organiza conversas e agiliza seu dia a dia. É uma ferramenta que economiza tempo e torna o atendimento muito mais eficiente."
                                }
                            ].map((item, index) => (
                                <Card
                                    key={index}
                                    bg="linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(230, 242, 255, 0.7) 100%)"
                                    borderRadius="2xl"
                                    shadow="lg"
                                    backdropFilter="blur(10px)"
                                    border="1px solid rgba(29, 143, 242, 0.2)"
                                    _hover={{
                                        shadow: "xl",
                                        transform: "translateY(-4px)",
                                        transition: "all 0.3s ease",
                                    }}
                                >
                                    <CardBody>
                                        <VStack spacing={4} align="center" textAlign="center" h="100%">
                                            <Heading size="md" color="title.900">
                                                {item.title}
                                            </Heading>
                                            <Text fontSize="sm" color="gray.600">
                                                {item.description}
                                            </Text>
                                        </VStack>
                                    </CardBody>
                                </Card>
                            ))}
                        </Grid>
                    </VStack>
                </Container>
            </Box>

            {/* Problemas x Soluções */}
            <Box py={20} bg="white">
                <Container maxW="7xl">
                    <VStack spacing={10}>
                        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={10} w="100%">
                            <VStack spacing={6} align="stretch">
                                <Box
                                    bg="linear-gradient(90deg, #1b5e20 0%, #00c853 100%)"
                                    color="white"
                                    py={4}
                                    px={6}
                                    borderRadius="lg"
                                    textAlign="center"
                                >
                                    <Heading size="md" color="white">Sua empresa sofre com isso?</Heading>
                                </Box>

                                {[
                                    "Perda de oportunidades por demora em responder ou atendimento limitado ao horário comercial?",
                                    "Baixa taxa de comparecimento ou esquecimento de reuniões e serviços?",
                                    "Dificuldade em gerenciar a comunicação com parceiros, clientes e fornecedores?",
                                ].map((item, index) => (
                                    <Box
                                        key={index}
                                        bg="#fff1f1"
                                        border="1px solid"
                                        borderColor="#f87171"
                                        borderRadius="md"
                                        px={6}
                                        py={5}
                                        textAlign="center"
                                    >
                                        <Text fontSize="lg" color="gray.800">{item}</Text>
                                    </Box>
                                ))}
                            </VStack>

                            <VStack spacing={6} align="stretch">
                                <Box
                                    bg="linear-gradient(90deg, #1b5e20 0%, #00c853 100%)"
                                    color="white"
                                    py={4}
                                    px={6}
                                    borderRadius="lg"
                                    textAlign="center"
                                >
                                    <Heading size="md" color="white">A ARIA soluciona com inteligência:</Heading>
                                </Box>

                                {[
                                    "Automação total de conversas e agendamentos via IA com tecnologia ChatGPT.",
                                    "Notificações inteligentes e lembretes automáticos enviados por WhatsApp.",
                                    "Coleta de feedback automatizada com incentivo direto para avaliações no Google.",
                                ].map((item, index) => (
                                    <Box
                                        key={index}
                                        bg="#e9f7ef"
                                        border="1px solid"
                                        borderColor="#2e7d32"
                                        borderRadius="md"
                                        px={6}
                                        py={5}
                                        textAlign="center"
                                    >
                                        <Text fontSize="lg" color="gray.800">{item}</Text>
                                    </Box>
                                ))}
                            </VStack>
                        </Grid>

                        <Button as="a" href="/auth/login" colorScheme="brand" size="md">
                            Teste agora
                        </Button>
                    </VStack>
                </Container>
            </Box>

            {/* Features */}
            {/* Conecte seu WhatsApp em segundos */}
            <Box position="relative" py={{ base: 12, md: 0 }} mt={2}>
                <Container maxW="7xl">
                    <Box
                        bg="white"
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="2xl"
                        boxShadow="md"
                        px={{ base: 6, md: 10 }}
                        py={{ base: 10, md: 12 }}
                    >
                        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} alignItems="center" gap={12}>
                            <VStack align="start" spacing={6} maxW="lg">
                                <Heading size="2xl" color="title.900">
                                    Conecte seu WhatsApp em alguns segundos!
                                </Heading>
                                <Text fontSize="lg" color="gray.700">
                                    Conecte o seu número do WhatsApp, envie os arquivos necessários e defina instruções personalizadas para o seu Assistente de I.A. Aumente a eficiência do seu atendimento e automatize processos com uma solução que trabalha 24 horas por dia, 7 dias por semana, para o seu negócio.
                                </Text>
                                <Button as="a" href="/auth/login" variant="outline" colorScheme="brand" size="lg">
                                    Testar agora
                                </Button>
                            </VStack>
                            <Box position="relative" w="100%" h={{ base: '320px', md: '420px' }}>
                                <Image
                                    src="/img-connect.webp"
                                    alt="Conexão WhatsApp"
                                    borderRadius="xl"
                                    boxShadow="lg"
                                    w="100%"
                                    h="100%"
                                    objectFit="cover"
                                />
                                <Box
                                    position="absolute"
                                    bottom={0}
                                    left={0}
                                    w="100%"
                                    bg="rgba(0, 128, 0, 0.85)"
                                    borderBottomRadius="xl"
                                    py={4}
                                    px={6}
                                    display="flex"
                                    flexDirection="column"
                                    gap={2}
                                >
                                    <Text fontWeight="bold" color="white" fontSize="md">
                                        A assistente de <span style={{ fontWeight: 'bold' }}>Inteligência Artificial</span> que torna sua vida mais <span style={{ fontWeight: 'bold' }}>fácil</span>
                                    </Text>
                                    <Box bg="white" borderRadius="md" p={3} mt={2} boxShadow="md">
                                        <Text color="green.900" fontWeight="bold" fontSize="lg">
                                            Tenha um atendente que <span style={{ color: '#388e3c' }}>trabalha 24 horas</span> por dia. Tenha a ARIA!
                                        </Text>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                    </Box>
                </Container>
            </Box>
            {/* Planos */}
            <Box
                position="relative"
                bgImage="url('/bg-connect.webp')"
                bgRepeat="no-repeat"
                bgSize="cover"
                bgPosition="center"
                py={{ base: 16, md: 20 }}
            >
                <Box position="absolute" inset={0} bg="rgba(18, 70, 28, 0.75)" />
                <Container maxW="7xl" position="relative" zIndex={1}>
                    <VStack spacing={3} textAlign="center" color="white" mb={{ base: 8, md: 10 }}>
                        <Heading size="2xl" color="white">Cabe dentro do seu bolso!</Heading>
                        <Text fontSize="xl">Confira os planos</Text>
                    </VStack>

                    <Box
                        bg="rgba(255, 255, 255, 0.85)"
                        borderRadius="xl"
                        px={{ base: 4, md: 8 }}
                        py={{ base: 6, md: 10 }}
                        boxShadow="xl"
                    >
                        <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={6} alignItems="stretch">
                            {[
                                {
                                    tag: 'Básico',
                                    price: 'Grátis',
                                    subtitle: 'Até 100 mensagens por mês',
                                },
                                {
                                    tag: 'Pro',
                                    price: 'R$19,90',
                                    subtitle: 'Até 1.000 mensagens/mês',
                                    badge: 'Mais popular',
                                },
                                {
                                    tag: 'Business',
                                    price: '49,90',
                                    subtitle: 'Até 10.000 mensagens/mês',
                                },
                                {
                                    tag: 'Enterprise',
                                    price: '99,90',
                                    subtitle: 'Mensagens ilimitadas',
                                },
                            ].map((plan, i) => (
                                <Box
                                    key={i}
                                    role="group"
                                    bg="white"
                                    color="green.900"
                                    borderRadius="xl"
                                    boxShadow="md"
                                    border="1px solid"
                                    borderColor="green.200"
                                    px={6}
                                    py={6}
                                    display="flex"
                                    flexDirection="column"
                                    gap={4}
                                    transition="all 0.2s ease"
                                    _hover={{
                                        bg: 'green.500',
                                        color: 'white',
                                        borderColor: 'green.500',
                                        transform: 'translateY(-4px)'
                                    }}
                                >
                                    <Box
                                        alignSelf="center"
                                        px={4}
                                        py={1}
                                        borderRadius="full"
                                        border="1px solid"
                                        borderColor="green.300"
                                        fontSize="xs"
                                        fontWeight="bold"
                                        textTransform="uppercase"
                                        bg="transparent"
                                        color="green.600"
                                        _groupHover={{
                                            bg: 'white',
                                            borderColor: 'white',
                                            color: 'green.600'
                                        }}
                                    >
                                        {plan.tag}
                                    </Box>

                                    <VStack spacing={1} align="start">
                                        <Heading size="lg" color="green.700" _groupHover={{ color: 'white' }}>
                                            {plan.price}
                                            <Text as="span" fontSize="sm" fontWeight="normal">
                                                /mês
                                            </Text>
                                        </Heading>
                                        <Text fontSize="sm" color="green.700" _groupHover={{ color: 'green.50' }}>
                                            {plan.subtitle}
                                        </Text>
                                        {plan.badge && (
                                            <Text fontSize="xs" color="green.700" _groupHover={{ color: 'green.50' }}>
                                                {plan.badge}
                                            </Text>
                                        )}
                                    </VStack>

                                    <VStack spacing={3} align="start" fontSize="sm" color="green.700" _groupHover={{ color: 'green.50' }}>
                                        <HStack>
                                            <Box w="18px" h="18px" borderRadius="full" bg="gray.300" flexShrink={0} />
                                            <Text>Funciona 24 horas por dia, 7 dias por semana.</Text>
                                        </HStack>
                                        <HStack>
                                            <Box w="18px" h="18px" borderRadius="full" bg="gray.300" flexShrink={0} />
                                            <Text>Responde de forma natural.</Text>
                                        </HStack>
                                        <HStack>
                                            <Box w="18px" h="18px" borderRadius="full" bg="gray.300" flexShrink={0} />
                                            <Text>Raciocina e entende diferentes contextos.</Text>
                                        </HStack>
                                        <HStack>
                                            <Box w="18px" h="18px" borderRadius="full" bg="gray.300" flexShrink={0} />
                                            <Text>Responde com base nas informações fornecidas sobre a sua empresa, sendo capaz de tirar dúvidas e dar informações.</Text>
                                        </HStack>
                                    </VStack>

                                    <Button
                                        as="a"
                                        href="/auth/login"
                                        bg="green.700"
                                        color="white"
                                        border="1px solid"
                                        borderColor="green.700"
                                        borderRadius="full"
                                        mt="auto"
                                        _groupHover={{
                                            bg: 'white',
                                            color: 'green.700',
                                            borderColor: 'white'
                                        }}
                                    >
                                        Teste agora!
                                    </Button>
                                </Box>
                            ))}
                        </Grid>
                    </Box>
                </Container>
            </Box>

            <Box bg="gradient.light" py={20}>
                <Container maxW="7xl">
                    <VStack spacing={12}>
                        <VStack spacing={4} textAlign="center">
                            <Heading size="2xl" color="title.900">
                                Por que escolher Aria?
                            </Heading>
                        </VStack>

                        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={8}>
                            {[
                                {
                                    title: "E-commerce",
                                    desc: "Tem uma loja online e não consegue responder a todas as dúvidas dos clientes? Deixe o assistente cuidar disso por você!"
                                },
                                {
                                    title: "Negócios locais",
                                    desc: "Tem um pequeno negócio e precisa de uma ajudinha para responder seus clientes com mais agilidade e eficiência? Deixe que o assistente de IA cuide disso por você."
                                },
                                {
                                    title: "Clínicas",
                                    desc: "Esclarece dúvidas sobre horários de atendimento, prazos e preços de forma humanizada, rápida e eficiente."
                                },
                            ].map((item, i) => (
                                <Card key={i} bg="white" borderRadius="xl" shadow="md">
                                    <CardBody>
                                        <VStack spacing={4}>
                                            <Heading size="md" color="title.900">{item.title}</Heading>
                                            <Text color="gray.600">{item.desc}</Text>
                                        </VStack>
                                    </CardBody>
                                </Card>
                            ))}
                        </Grid>
                    </VStack>
                </Container>
            </Box>

            {/* CTA */}
            <Box py={20} textAlign="center">
                <Container maxW="3xl">
                    <VStack spacing={6}>
                        <Heading size="2xl" color="title.900">
                            Praticidade acima de tudo
                        </Heading>
                        <Text fontSize="xl" color="gray.600">
                            Sem termos difíceis, sem telas confusas, sem burocracia. Apenas o que você realmente precisa para colocar sua inteligência artificial para funcionar no WhatsApp.
                        </Text>
                        <Button as="a" href="/auth/register" colorScheme="brand" size="lg">
                            Começar grátis
                        </Button>
                    </VStack>
                </Container>
            </Box>

            {/* Footer */}
            <Box bg="title.900" color="white" py={12}>
                <Container maxW="7xl">
                    <VStack spacing={8} align={{ base: "center", md: "flex-start" }}>
                        <HStack spacing={16} justify="space-between" align="flex-start" w="100%" display={{ base: "none", md: "flex" }}>
                            <VStack align="start" spacing={4}>
                                <Image
                                    src="/logo-white-no-bg.png"
                                    alt="Aria Logo"
                                    h="50px"
                                    w="auto"
                                />
                                <Text fontSize="md">Assistente de Respostas Inteligentes Automatizadas</Text>
                            </VStack>
                            <HStack spacing={8}>
                                <Button onClick={onOpenPrices} variant="link" size="md" color="white">Preços</Button>
                                <Button onClick={onOpen} variant="link" size="md" color="white">Como funciona?</Button>
                                <Button as="a" href="https://wa.me/5543999790374" target="_blank" variant="link" size="md" color="white">Contato</Button>
                            </HStack>
                        </HStack>

                        <VStack spacing={6} w="100%" display={{ base: "flex", md: "none" }} align="center" textAlign="center">
                            <Image
                                src="/logo-white-no-bg.png"
                                alt="Aria Logo"
                                h="50px"
                                w="auto"
                            />
                            <Text fontSize="md">Assistente de Respostas Inteligentes Automatizadas</Text>
                            <VStack spacing={2}>
                                <Button onClick={onOpenPrices} variant="link" size="md" color="white">Preços</Button>
                                <Button onClick={onOpen} variant="link" size="md" color="white">Como funciona?</Button>
                                <Button as="a" href="https://wa.me/5543999790374" target="_blank" variant="link" size="md" color="white">Contato</Button>
                            </VStack>
                        </VStack>
                    </VStack>
                </Container>
            </Box>

            {/* Modal - Como Funciona */}
            <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
                <ModalOverlay backdropFilter="blur(4px)" />
                <ModalContent>
                    <ModalHeader>Como Funciona? 🚀</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <VStack spacing={6} align="start" fontSize="md">
                            <Box>
                                <Heading size="sm" mb={2} color="title.900">
                                    1️⃣ Cadastro Gratuito
                                </Heading>
                                <Text>
                                    Comece fazendo um cadastro rápido e gratuito. <strong>Recomendamos fazer pelo computador</strong>, pois você precisará ler um código QR com o celular que tem o WhatsApp instalado.
                                </Text>
                            </Box>

                            <Box>
                                <Heading size="sm" mb={2} color="title.900">
                                    2️⃣ Conecte seu WhatsApp
                                </Heading>
                                <Text>
                                    Use seu celular (aquele que você vai usar para atender clientes) e escaneie o código QR. Pronto! Seu WhatsApp está conectado.
                                </Text>
                            </Box>

                            <Box>
                                <Heading size="sm" mb={2} color="title.900">
                                    3️⃣ Configure seu Assistente
                                </Heading>
                                <Text>
                                    Escolha um dos nossos <strong>exemplos prontos</strong>, como "Atendimento de Clientes", "Dúvidas Frequentes" ou "Agendamento". Eles já vêm com tudo configurado!
                                </Text>
                            </Box>

                            <Box>
                                <Heading size="sm" mb={2} color="title.900">
                                    4️⃣ Personalize a seu jeito
                                </Heading>
                                <Text>
                                    Edite as respostas, adicione suas informações e ajuste o tom para ser bem com a sua marca. É tudo bem simples e intuitivo.
                                </Text>
                            </Box>

                            <Box>
                                <Heading size="sm" mb={2} color="title.900">
                                    5️⃣ Comece a Usar!
                                </Heading>
                                <Text>
                                    Pronto! 🎉 Seu assistente de IA já está funcionando no WhatsApp, respondendo seus clientes 24/7, enquanto você cuida do que importa.
                                </Text>
                            </Box>

                            <Box p={4} bg="blue.50" borderRadius="md" borderLeft="4px" borderColor="blue.500" w="100%">
                                <Text fontSize="sm" color="blue.900">
                                    <strong>Dica:</strong> Tudo é feito sem complicações técnicas. Se pode usar WhatsApp, consegue usar a Aria!
                                </Text>
                            </Box>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* Modal - Preços */}
            <Modal isOpen={isOpenPrices} onClose={onClosePrices} size="2xl" isCentered>
                <ModalOverlay backdropFilter="blur(4px)" />
                <ModalContent>
                    <ModalHeader>Planos de Preços 💰</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={8}>
                        <VStack spacing={6}>
                            {/* Info geral */}
                            <Box textAlign="center" w="100%">
                                <Text fontSize="md" color="gray.700" mb={2}>
                                    Comece <strong>100% grátis</strong>, sem necessidade de cartão de crédito, sem burocracia.
                                </Text>
                                <Text fontSize="sm" color="gray.600">
                                    Se precisar de mais depois, é só fazer o upgrade!
                                </Text>
                            </Box>

                            {/* Cards de preços */}
                            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4} w="100%">
                                {/* Free */}
                                <Card bg="gradient.light" borderRadius="lg" border="2px solid" borderColor="green.400">
                                    <CardBody>
                                        <VStack spacing={4} align="start">
                                            <VStack align="start" spacing={1}>
                                                <Heading size="md" color="title.900">Free</Heading>
                                                <Text fontSize="sm" color="gray.600">Para começar</Text>
                                                <Badge colorScheme="green" mt={2}>Gratuito</Badge>
                                            </VStack>
                                            <Box borderTop="1px solid" borderColor="gray.200" w="100%" pt={4}>
                                                <Text fontWeight="bold" color="title.900" mb={2}>
                                                    Até 100 mensagens/mês
                                                </Text>
                                            </Box>
                                        </VStack>
                                    </CardBody>
                                </Card>

                                {/* Pro */}
                                <Card bg="white" borderRadius="lg" border="2px solid" borderColor="blue.400" shadow="md">
                                    <CardBody>
                                        <VStack spacing={4} align="start">
                                            <VStack align="start" spacing={1}>
                                                <Heading size="md" color="title.900">Pro</Heading>
                                                <Text fontSize="sm" color="gray.600">Para profissionais</Text>
                                            </VStack>
                                            <Box borderTop="1px solid" borderColor="gray.200" w="100%" pt={4}>
                                                <Text fontSize="2xl" fontWeight="bold" color="blue.600">R$ 19,90</Text>
                                                <Text fontSize="sm" color="gray.600">/mês</Text>
                                                <Text fontWeight="bold" color="title.900" mt={3} mb={2}>
                                                    1.000 mensagens/mês
                                                </Text>
                                            </Box>
                                        </VStack>
                                    </CardBody>
                                </Card>

                                {/* Business */}
                                <Card bg="white" borderRadius="lg" border="2px solid" borderColor="purple.400" shadow="md">
                                    <CardBody>
                                        <VStack spacing={4} align="start">
                                            <VStack align="start" spacing={1}>
                                                <Heading size="md" color="title.900">Business</Heading>
                                                <Text fontSize="sm" color="gray.600">Para empresas</Text>
                                            </VStack>
                                            <Box borderTop="1px solid" borderColor="gray.200" w="100%" pt={4}>
                                                <Text fontSize="2xl" fontWeight="bold" color="purple.600">R$ 49,90</Text>
                                                <Text fontSize="sm" color="gray.600">/mês</Text>
                                                <Text fontWeight="bold" color="title.900" mt={3} mb={2}>
                                                    10.000 mensagens/mês
                                                </Text>
                                            </Box>
                                        </VStack>
                                    </CardBody>
                                </Card>

                                {/* Enterprise */}
                                <Card bg="white" borderRadius="lg" border="2px solid" borderColor="orange.400" shadow="md">
                                    <CardBody>
                                        <VStack spacing={4} align="start">
                                            <VStack align="start" spacing={1}>
                                                <Heading size="md" color="title.900">Enterprise</Heading>
                                                <Text fontSize="sm" color="gray.600">Solução sem limites</Text>
                                            </VStack>
                                            <Box borderTop="1px solid" borderColor="gray.200" w="100%" pt={4}>
                                                <Text fontSize="2xl" fontWeight="bold" color="orange.600">R$ 99,90</Text>
                                                <Text fontSize="sm" color="gray.600">/mês</Text>
                                                <Text fontWeight="bold" color="title.900" mt={3} mb={2}>
                                                    Mensagens Ilimitadas
                                                </Text>
                                            </Box>
                                        </VStack>
                                    </CardBody>
                                </Card>
                            </Grid>

                            {/* Info sobre mensagens */}
                            <Box p={4} bg="gray.50" borderRadius="md" w="100%">
                                <VStack spacing={2} align="start">
                                    <Heading size="sm" color="title.900">ℹ️ Como funciona as mensagens?</Heading>
                                    <Text fontSize="sm" color="gray.700">
                                        <strong>Cada mensagem enviada pela IA conta como uma.</strong> O assistente responde após 3 minutos em que o usuário manda uma ou mais mensagens.
                                    </Text>
                                </VStack>
                            </Box>

                            {/* CTA */}
                            <Button as="a" href="/auth/register" colorScheme="brand" size="lg" w="100%">
                                Começar Grátis Agora
                            </Button>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    )
}
