import { Box, Container, VStack, HStack, Heading, Text, Button, Grid, GridItem, Card, CardBody, Image } from '@chakra-ui/react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/src/lib/auth'
import { redirect } from 'next/navigation'

export default async function Home() {
    const session = await getServerSession(authOptions)

    if (session) {
        redirect('/dashboard')
    }

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
                            Começar agora
                        </Button>
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

            {/* Features */}
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
                                <Button variant="link" size="md" color="white">Preços</Button>
                                <Button variant="link" size="md" color="white">Sobre nós</Button>
                                <Button variant="link" size="md" color="white">Como funciona?</Button>
                                <Button variant="link" size="md" color="white">Contato</Button>
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
                                <Button variant="link" size="md" color="white">Preços</Button>
                                <Button variant="link" size="md" color="white">Sobre nós</Button>
                                <Button variant="link" size="md" color="white">Como funciona?</Button>
                                <Button variant="link" size="md" color="white">Contato</Button>
                            </VStack>
                        </VStack>
                    </VStack>
                </Container>
            </Box>
        </Box>
    )
}