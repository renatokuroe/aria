'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Button, Input, VStack, Heading, Text, FormControl, FormLabel, useToast, Card, CardBody } from '@chakra-ui/react'
import Logo from '@/src/components/Logo'

export default function AttachmentsPage() {
    const [keyword, setKeyword] = useState('')
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const toast = useToast()
    const router = useRouter()

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            if (selectedFile.type !== 'application/pdf') {
                toast({
                    title: 'Arquivo inválido',
                    description: 'Por favor, selecione um arquivo PDF',
                    status: 'error',
                    duration: 3000,
                })
                return
            }
            setFile(selectedFile)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        
        if (!keyword.trim()) {
            toast({
                title: 'Palavra-chave obrigatória',
                description: 'Informe a palavra-chave que ativará este anexo',
                status: 'warning',
                duration: 3000,
            })
            return
        }

        if (!file) {
            toast({
                title: 'Arquivo obrigatório',
                description: 'Selecione um arquivo PDF para enviar',
                status: 'warning',
                duration: 3000,
            })
            return
        }

        setLoading(true)

        try {
            // Converter PDF para base64
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = async () => {
                const base64 = reader.result?.toString().split(',')[1]
                if (!base64) {
                    throw new Error('Erro ao processar arquivo')
                }

                // Enviar para API
                const res = await fetch('/api/attachments/upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        keyword: keyword.trim().toLowerCase(),
                        base64_content: base64,
                    }),
                })

                const data = await res.json()

                if (!res.ok) {
                    console.error('Erro da API:', data)
                    throw new Error(data.error || 'Erro ao enviar anexo')
                }

                toast({
                    title: 'Anexo enviado com sucesso! 🎉',
                    description: `Quando alguém disser "${keyword}", a IA enviará este PDF`,
                    status: 'success',
                    duration: 5000,
                })

                // Limpar formulário
                setKeyword('')
                setFile(null)
                if (fileInputRef.current) {
                    fileInputRef.current.value = ''
                }
            }
            reader.onerror = () => {
                throw new Error('Erro ao ler arquivo')
            }
        } catch (err: any) {
            console.error('Erro completo:', err)
            toast({
                title: 'Erro ao enviar anexo',
                description: err.message || 'Tente novamente',
                status: 'error',
                duration: 5000,
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box minH="100vh" bg="gradient.light" py={12} px={6}>
            <VStack spacing={8} maxW="2xl" mx="auto">
                <Logo size="lg" />
                <VStack spacing={2} textAlign="center">
                    <Heading size="lg" color="green.600">Gerenciar Anexos</Heading>
                    <Text color="gray.600">
                        Envie um PDF que será automaticamente compartilhado quando um cliente mencionar a palavra-chave
                    </Text>
                </VStack>

                <Card w="full">
                    <CardBody>
                        <VStack spacing={6} as="form" onSubmit={handleSubmit}>
                            <FormControl isRequired>
                                <FormLabel color="title.900" fontWeight={600}>
                                    Palavra-chave
                                </FormLabel>
                                <Input
                                    placeholder="Ex: catalogo, tabela, preços"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    size="lg"
                                />
                                <Text fontSize="sm" color="gray.500" mt={2}>
                                    Quando alguém disser essa palavra, a IA enviará o PDF
                                </Text>
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel color="title.900" fontWeight={600}>
                                    Arquivo PDF
                                </FormLabel>
                                <Input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    size="lg"
                                    p={1}
                                />
                                {file && (
                                    <Text fontSize="sm" color="green.600" mt={2}>
                                        ✓ {file.name} ({(file.size / 1024).toFixed(2)} KB)
                                    </Text>
                                )}
                            </FormControl>

                            <VStack spacing={3} w="full">
                                <Button
                                    type="submit"
                                    colorScheme="green"
                                    size="lg"
                                    w="full"
                                    isLoading={loading}
                                >
                                    Enviar Anexo
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => router.push('/dashboard')}
                                    w="full"
                                >
                                    Voltar
                                </Button>
                            </VStack>
                        </VStack>
                    </CardBody>
                </Card>

                <Card w="full" bg="blue.50" borderColor="blue.200" borderWidth={1}>
                    <CardBody>
                        <VStack align="start" spacing={3}>
                            <Text fontSize="sm" fontWeight="bold" color="blue.900">
                                💡 Como funciona:
                            </Text>
                            <Text fontSize="sm" color="blue.800">
                                1. Escolha uma palavra-chave simples (ex: "catalogo", "tabela")
                            </Text>
                            <Text fontSize="sm" color="blue.800">
                                2. Faça upload do PDF que deseja enviar
                            </Text>
                            <Text fontSize="sm" color="blue.800">
                                3. Quando um cliente mencionar a palavra-chave na conversa, a IA automaticamente enviará o PDF
                            </Text>
                        </VStack>
                    </CardBody>
                </Card>
            </VStack>
        </Box>
    )
}
