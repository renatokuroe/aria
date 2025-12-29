'use client'

import { useState, useEffect } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
    VStack,
    HStack,
    Text,
    useToast,
    Box,
    Heading,
    Divider,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputLeftElement,
    Grid,
    Checkbox,
} from '@chakra-ui/react'

interface PaymentModalProps {
    isOpen: boolean
    onClose: () => void
    planId: string
    planName: string
    planValue: number
    userEmail: string
    userName: string
    onPaymentSuccess: () => void
    currentPlanValue?: number
}

export default function PaymentModal({
    isOpen,
    onClose,
    planId,
    planName,
    planValue,
    userEmail,
    userName,
    onPaymentSuccess,
    currentPlanValue = 0,
}: PaymentModalProps) {
    const toast = useToast()
    const [paymentProcessing, setPaymentProcessing] = useState(false)

    // Form state
    const [cardHolderName, setCardHolderName] = useState('')
    const [cardNumber, setCardNumber] = useState('')
    const [cardExpiryMonth, setCardExpiryMonth] = useState('')
    const [cardExpiryYear, setCardExpiryYear] = useState('')
    const [cardCvv, setCardCvv] = useState('')
    const [cardCpf, setCardCpf] = useState('')
    const [cardEmail, setCardEmail] = useState(userEmail)
    const [cardPhone, setCardPhone] = useState('')
    const [cardCep, setCardCep] = useState('')
    const [addressNumber, setAddressNumber] = useState('')

    const handleClose = () => {
        if (!paymentProcessing) {
            onClose()
        }
    }

    // Formatar número do cartão (adicionar espaços)
    const formatCardNumber = (value: string) => {
        const cleaned = value.replace(/\D/g, '')
        const formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim()
        return formatted.substring(0, 19) // 4444 4444 4444 4444
    }

    // Formatar CPF (adicionar máscara)
    const formatCpf = (value: string) => {
        const cleaned = value.replace(/\D/g, '')
        const formatted = cleaned
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
        return formatted.substring(0, 14) // 000.000.000-00
    }

    // Formatar telefone (adicionar máscara)
    const formatPhone = (value: string) => {
        const cleaned = value.replace(/\D/g, '')
        const formatted = cleaned
            .replace(/^(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{4})(\d)/, '$1-$2')
        return formatted.substring(0, 15) // (11) 99999-9999
    }

    // Formatar CEP
    const formatCep = (value: string) => {
        const cleaned = value.replace(/\D/g, '')
        const formatted = cleaned.replace(/(\d{5})(\d)/, '$1-$2')
        return formatted.substring(0, 9) // 12345-678
    }

    // Validar CPF
    const isValidCPF = (cpf: string): boolean => {
        const cleaned = cpf.replace(/\D/g, '')

        // Rejeitar se não tiver 11 dígitos
        if (cleaned.length !== 11) return false

        // Rejeitar se todos os dígitos forem iguais
        if (/^(\d)\1{10}$/.test(cleaned)) return false

        // Validar primeiro dígito verificador
        let sum = 0
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cleaned[i]) * (10 - i)
        }
        let remainder = (sum * 10) % 11
        if (remainder === 10) remainder = 0
        if (remainder !== parseInt(cleaned[9])) return false

        // Validar segundo dígito verificador
        sum = 0
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cleaned[i]) * (11 - i)
        }
        remainder = (sum * 10) % 11
        if (remainder === 10) remainder = 0
        if (remainder !== parseInt(cleaned[10])) return false

        return true
    }

    // Validar cartão
    const validateCard = (): boolean => {
        if (!cardHolderName.trim()) {
            toast({
                title: 'Erro',
                description: 'Nome do titular é obrigatório',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            return false
        }

        const cleanedCardNumber = cardNumber.replace(/\D/g, '')
        if (cleanedCardNumber.length !== 16) {
            toast({
                title: 'Erro',
                description: 'Número do cartão inválido (deve ter 16 dígitos)',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            return false
        }

        if (!cardExpiryMonth || !cardExpiryYear) {
            toast({
                title: 'Erro',
                description: 'Data de validade inválida',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            return false
        }

        const month = parseInt(cardExpiryMonth)
        if (month < 1 || month > 12) {
            toast({
                title: 'Erro',
                description: 'Mês de validade deve ser entre 01 e 12',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            return false
        }

        if (!cardCvv || cardCvv.length !== 3) {
            toast({
                title: 'Erro',
                description: 'CVV inválido (deve ter 3 dígitos)',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            return false
        }

        if (!isValidCPF(cardCpf)) {
            toast({
                title: 'Erro',
                description: 'CPF inválido',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            return false
        }

        if (!addressNumber || addressNumber.trim() === '') {
            toast({
                title: 'Erro',
                description: 'Número do endereço é obrigatório',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            return false
        }

        if (!cardEmail || !cardEmail.includes('@')) {
            toast({
                title: 'Erro',
                description: 'Email do titular inválido',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            return false
        }

        const phoneClean = cardPhone.replace(/\D/g, '')
        if (!phoneClean || phoneClean.length < 10) {
            toast({
                title: 'Erro',
                description: 'Telefone deve ter pelo menos 10 dígitos',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            return false
        }

        const cepClean = cardCep.replace(/\D/g, '')
        if (!cepClean || cepClean.length !== 8) {
            toast({
                title: 'Erro',
                description: 'CEP deve ter 8 dígitos',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            return false
        }

        return true
    }

    // Processar pagamento
    const processPayment = async () => {
        if (!validateCard()) return

        setPaymentProcessing(true)
        try {
            const cleanedCardNumber = cardNumber.replace(/\D/g, '')
            const finalCardHolderName = cardHolderName.trim() || userName || userEmail.split('@')[0]

            console.log('💳 Processando pagamento com cartão...', {
                cardHolderName,
                finalCardHolderName,
                cardNumber: cleanedCardNumber.substring(0, 4) + '****',
                cardCpf: cardCpf.replace(/\D/g, ''),
            })

            // Se há plano anterior (seja downgrade para Free ou mudança entre planos pagos), cancelar subscription
            if (currentPlanValue && currentPlanValue > 0) {
                console.log('📋 Cancelando subscription anterior...')
                try {
                    const cancelResponse = await fetch('/api/payment/cancel-subscription', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            userEmail,
                            currentPlanValue,
                        }),
                    })

                    if (!cancelResponse.ok) {
                        const cancelError = await cancelResponse.json()
                        console.warn('⚠️ Aviso ao cancelar:', cancelError)
                    } else {
                        console.log('✓ Subscription cancelada com sucesso')
                    }
                } catch (error) {
                    console.error('⚠️ Erro ao cancelar subscription:', error)
                    // Continua mesmo assim
                }
            }

            // Se é downgrade para Free, não fazer pagamento
            if (planValue === 0) {
                console.log('📋 Fazendo downgrade para Free...')
                onPaymentSuccess()
                onClose()
                return
            }

            const response = await fetch('/api/payment/asaas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    planId,
                    planValue,
                    userEmail,
                    userName,
                    cardNumber: cleanedCardNumber,
                    cardExpiryMonth: cardExpiryMonth.padStart(2, '0'),
                    cardExpiryYear: cardExpiryYear.slice(-2),
                    cardCvv,
                    cardHolderName: finalCardHolderName,
                    cardCpf: cardCpf.replace(/\D/g, ''),
                    cardEmail,
                    cardPhone: cardPhone.replace(/\D/g, ''),
                    cardCep: cardCep.replace(/\D/g, ''),
                    addressNumber,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                const errorMsg = data?.asaasError || data?.error || 'Erro desconhecido'
                throw new Error(errorMsg)
            }

            console.log('✓ Pagamento processado:', data)

            toast({
                title: 'Sucesso!',
                description: 'Pagamento confirmado. Seu plano foi atualizado!',
                status: 'success',
                duration: 3000,
                isClosable: true,
            })

            // Chamar callback de sucesso
            onPaymentSuccess()
            onClose()
        } catch (error) {
            console.error('Erro ao processar pagamento:', error)
            toast({
                title: 'Erro ao processar pagamento',
                description: error instanceof Error ? error.message : 'Erro desconhecido',
                status: 'error',
                duration: 4000,
                isClosable: true,
            })
        } finally {
            setPaymentProcessing(false)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="md" isCentered>
            <ModalOverlay backdropFilter="blur(4px)" />
            <ModalContent bg="white" borderRadius="xl">
                <ModalHeader>
                    <VStack align="start" spacing={1}>
                        <Heading size="md">Contratação de Plano</Heading>
                        <Text fontSize="sm" color="gray.600" fontWeight={400}>
                            {planName} - R$ {planValue.toFixed(2).replace('.', ',')}
                        </Text>
                    </VStack>
                </ModalHeader>
                <ModalCloseButton isDisabled={paymentProcessing} />

                <ModalBody pb={6}>
                    <VStack spacing={6}>
                        {/* Info Box */}
                        <Box
                            w="full"
                            p={4}
                            bg="blue.50"
                            borderRadius="lg"
                            borderLeft="4px solid"
                            borderColor="brand.500"
                        >
                            <VStack align="start" spacing={2}>
                                <Text fontSize="sm" color="blue.800" fontWeight={600}>
                                    Pagamento Seguro
                                </Text>
                                <Text fontSize="xs" color="blue.700">
                                    Recorrência mensal • Cancele a qualquer momento
                                </Text>
                            </VStack>
                        </Box>

                        {/* Resumo */}
                        <Box w="full" p={4} bg="gray.50" borderRadius="lg">
                            <VStack align="start" spacing={2} w="full">
                                <HStack justify="space-between" w="full">
                                    <Text fontSize="sm" color="gray.600">
                                        Plano:
                                    </Text>
                                    <Text fontSize="sm" fontWeight={600}>
                                        {planName}
                                    </Text>
                                </HStack>
                                <HStack justify="space-between" w="full">
                                    <Text fontSize="sm" color="gray.600">
                                        Valor mensal:
                                    </Text>
                                    <Text fontSize="lg" fontWeight={700} color="brand.600">
                                        R$ {planValue.toFixed(2).replace('.', ',')}
                                    </Text>
                                </HStack>
                                <HStack justify="space-between" w="full" pt={2} borderTop="1px solid" borderColor="gray.200">
                                    <Text fontSize="xs" color="gray.500">
                                        Renovação automática todo mês
                                    </Text>
                                </HStack>
                            </VStack>
                        </Box>

                        <Divider />

                        {/* Formulário de Cartão */}
                        <VStack spacing={4} w="full">
                            <FormControl>
                                <FormLabel fontSize="sm" fontWeight={600}>
                                    Nome do Titular
                                </FormLabel>
                                <Input
                                    placeholder="João Silva"
                                    value={cardHolderName}
                                    onChange={(e) => setCardHolderName(e.target.value)}
                                    disabled={paymentProcessing}
                                    size="lg"
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel fontSize="sm" fontWeight={600}>
                                    CPF
                                </FormLabel>
                                <Input
                                    placeholder="000.000.000-00"
                                    value={cardCpf}
                                    onChange={(e) => setCardCpf(formatCpf(e.target.value))}
                                    maxLength={14}
                                    disabled={paymentProcessing}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel fontSize="sm" fontWeight={600}>
                                    Email do Titular
                                </FormLabel>
                                <Input
                                    placeholder="email@example.com"
                                    type="email"
                                    value={cardEmail}
                                    onChange={(e) => setCardEmail(e.target.value)}
                                    disabled={paymentProcessing}
                                    readOnly
                                    cursor="not-allowed"
                                    opacity={0.7}
                                />
                            </FormControl>

                            <Grid templateColumns="1fr 1fr" gap={4} w="full">
                                <FormControl>
                                    <FormLabel fontSize="sm" fontWeight={600}>
                                        Telefone
                                    </FormLabel>
                                    <Input
                                        placeholder="(11) 99999-9999"
                                        value={cardPhone}
                                        onChange={(e) => setCardPhone(formatPhone(e.target.value))}
                                        disabled={paymentProcessing}
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel fontSize="sm" fontWeight={600}>
                                        CEP
                                    </FormLabel>
                                    <Input
                                        placeholder="12345-678"
                                        value={cardCep}
                                        onChange={(e) => setCardCep(formatCep(e.target.value))}
                                        maxLength={9}
                                        disabled={paymentProcessing}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid templateColumns="1fr 1fr" gap={4} w="full">
                                <FormControl>
                                    <FormLabel fontSize="sm" fontWeight={600}>
                                        Número do Endereço
                                    </FormLabel>
                                    <Input
                                        placeholder="123"
                                        value={addressNumber}
                                        onChange={(e) => setAddressNumber(e.target.value)}
                                        disabled={paymentProcessing}
                                    />
                                </FormControl>

                                <FormControl>
                                    {/* Placeholder for alignment */}
                                </FormControl>
                            </Grid>

                            <FormControl>
                                <FormLabel fontSize="sm" fontWeight={600}>
                                    Número do Cartão
                                </FormLabel>
                                <Input
                                    placeholder="4444 4444 4444 4444"
                                    value={cardNumber}
                                    onChange={(e) => {
                                        setCardNumber(formatCardNumber(e.target.value))
                                    }}
                                    maxLength={19}
                                    disabled={paymentProcessing}
                                />
                            </FormControl>

                            <Grid templateColumns="1fr 1fr" gap={4} w="full">
                                <FormControl>
                                    <FormLabel fontSize="sm" fontWeight={600}>
                                        Vencimento
                                    </FormLabel>
                                    <HStack spacing={2}>
                                        <Input
                                            placeholder="MM"
                                            maxLength={2}
                                            value={cardExpiryMonth}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '')
                                                if (value.length <= 2) {
                                                    setCardExpiryMonth(value)
                                                }
                                            }}
                                            disabled={paymentProcessing}
                                        />
                                        <Text>/</Text>
                                        <Input
                                            placeholder="YY"
                                            maxLength={2}
                                            value={cardExpiryYear}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '')
                                                if (value.length <= 2) {
                                                    setCardExpiryYear(value)
                                                }
                                            }}
                                            disabled={paymentProcessing}
                                        />
                                    </HStack>
                                </FormControl>

                                <FormControl>
                                    <FormLabel fontSize="sm" fontWeight={600}>
                                        CVV
                                    </FormLabel>
                                    <Input
                                        placeholder="123"
                                        type="password"
                                        maxLength={3}
                                        value={cardCvv}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '')
                                            if (value.length <= 3) {
                                                setCardCvv(value)
                                            }
                                        }}
                                        disabled={paymentProcessing}
                                    />
                                </FormControl>
                            </Grid>

                            <Text fontSize="xs" color="gray.500" textAlign="center">
                                Seus dados de cartão são processados de forma segura
                            </Text>

                            <Box w="full" pt={2} borderTop="1px solid" borderColor="gray.200">
                            </Box>
                        </VStack>

                        <Divider />

                        {/* Botões */}
                        <VStack spacing={3} w="full">
                            <Button
                                w="full"
                                colorScheme={planValue < (currentPlanValue || 0) ? 'orange' : 'brand'}
                                size="lg"
                                onClick={processPayment}
                                isLoading={paymentProcessing}
                                loadingText="Processando..."
                                disabled={!cardHolderName || !cardNumber || !cardExpiryMonth || !cardExpiryYear || !cardCvv || !cardCpf || !cardEmail || !cardPhone || !cardCep || !addressNumber}
                            >
                                {planValue < (currentPlanValue || 0) ? 'Fazer Downgrade' : 'Confirmar Pagamento'}
                            </Button>
                            <Button
                                w="full"
                                variant="ghost"
                                colorScheme="gray"
                                onClick={handleClose}
                                isDisabled={paymentProcessing}
                            >
                                Cancelar
                            </Button>
                            <Text fontSize="xs" color="gray.500" textAlign="center">
                                Débito em conta automático no primeiro dia de cada mês
                            </Text>
                        </VStack>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
