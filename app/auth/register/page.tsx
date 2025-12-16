'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import {
    Box,
    Button,
    Input,
    VStack,
    Heading,
    Text,
    FormControl,
    FormLabel,
    FormErrorMessage,
    useToast,
} from '@chakra-ui/react'

export default function RegisterPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const toast = useToast()

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
                toast({ title: 'Erro', description: data.error || 'Erro ao criar conta', status: 'error', duration: 5000 })
                return
            }

            // Try auto-login
            const signInRes = await signIn('credentials', { redirect: false, email, password })
            if (signInRes && (signInRes as any).ok) {
                toast({ title: 'Bem-vindo!', description: 'Cadastro e login realizados', status: 'success', duration: 3000 })
                router.push('/setup/instance')
            } else {
                toast({ title: 'Conta criada', description: 'Faça login para continuar', status: 'success', duration: 3000 })
                router.push('/auth/login')
            }
        } catch (err: any) {
            setError('Erro ao criar conta')
            toast({ title: 'Erro', description: err?.message || 'Erro ao criar conta', status: 'error', duration: 5000 })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box p={8} maxW="md" mx="auto">
            <VStack spacing={4} as="form" onSubmit={handleSubmit}>
                <Heading size="md">Criar Conta</Heading>
                {error && <Text color="red.500">{error}</Text>}

                <FormControl isInvalid={!!(error && error.includes('Email'))}>
                    <FormLabel>Email</FormLabel>
                    <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <FormErrorMessage>Email inválido</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!(error && error.includes('Senha'))}>
                    <FormLabel>Senha</FormLabel>
                    <Input placeholder="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <FormErrorMessage>Senha precisa ter ao menos 8 caracteres</FormErrorMessage>
                </FormControl>

                <Button type="submit" colorScheme="green" isLoading={loading}>Criar</Button>
                <Button variant="link" onClick={() => router.push('/auth/login')}>Já tenho conta</Button>
            </VStack>
        </Box>
    )
}
