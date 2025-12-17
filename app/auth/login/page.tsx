'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Box, Button, Input, VStack, Heading, Text } from '@chakra-ui/react'
import Logo from '@/src/components/Logo'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        const res = await signIn('credentials', { redirect: false, email, password })
        if (res?.error) {
            setError('Email ou senha incorretos')
        } else {
            router.push('/dashboard')
        }
    }

    return (
        <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="white" py={12}>
            <VStack spacing={4} maxW="sm" w="full" px={6}>
                <Logo size="xl" />
                <VStack spacing={1} textAlign="center">
                    <Heading size="lg">Bem-vindo ao Aria</Heading>
                    <Text color="gray.600">Faça login para continuar</Text>
                </VStack>

                <VStack spacing={4} as="form" onSubmit={handleSubmit} w="full">
                    {error && <Text color="red.500" fontSize="sm">{error}</Text>}
                    <Input
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        size="lg"
                    />
                    <Input
                        placeholder="Senha"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        size="lg"
                    />
                    <Button type="submit" colorScheme="brand" w="full" size="lg">Entrar</Button>
                </VStack>

                <Button variant="link" onClick={() => router.push('/auth/register')} colorScheme="brand">
                    Não tem conta? Crie uma
                </Button>
            </VStack>
        </Box>
    )
}
