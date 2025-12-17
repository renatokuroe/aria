'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Box, Button, Input, VStack, Heading, Text } from '@chakra-ui/react'
import Logo from '@/src/components/Logo'

export default function RegisterPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    function validate() {
        if (!email || !email.includes('@')) return 'Email inválido'
        if (!password || password.length < 8) return 'Senha precisa ter ao menos 8 caracteres'
        return null
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        const v = validate()
        if (v) return setError(v)
        setLoading(true)

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
            })

            const data = await res.json()
            if (!res.ok) {
                setError(data.error || 'Erro ao criar conta')
                return
            }

            const signInRes = await signIn('credentials', { redirect: false, email, password })
            if (signInRes && (signInRes as any).ok) {
                router.push('/setup/instance')
            } else {
                router.push('/auth/login')
            }
        } catch (err: any) {
            setError('Erro ao criar conta')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="white" py={12}>
            <VStack spacing={4} maxW="sm" w="full" px={6}>
                <Logo size="xl" />
                <VStack spacing={1} textAlign="center">
                    <Heading size="lg">Criar Conta</Heading>
                    <Text color="gray.600">Comece a usar o Aria agora</Text>
                </VStack>

                <VStack spacing={4} as="form" onSubmit={handleSubmit} w="full">
                    {error && <Text color="red.500" fontSize="sm">{error}</Text>}
                    <Input
                        placeholder="Email"
                        type="email"
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
                    <Button type="submit" colorScheme="brand" w="full" size="lg" isLoading={loading}>Criar</Button>
                </VStack>

                <Button variant="link" onClick={() => router.push('/auth/login')} colorScheme="brand">
                    Já tem conta? Faça login
                </Button>
            </VStack>
        </Box>
    )
}
