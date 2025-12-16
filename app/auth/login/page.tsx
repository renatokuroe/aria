'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Box, Button, Input, VStack, Heading, Text } from '@chakra-ui/react'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        const res = await signIn('credentials', { redirect: false, email, password })
        if (res?.error) setError(res.error)
        else router.push('/dashboard')
    }

    return (
        <Box p={8} maxW="md" mx="auto">
            <VStack spacing={4} as="form" onSubmit={handleSubmit}>
                <Heading size="md">Entrar</Heading>
                {error && <Text color="red.500">{error}</Text>}
                <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input placeholder="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button type="submit" colorScheme="blue">Entrar</Button>
                <Button variant="link" onClick={() => router.push('/auth/register')}>Criar conta</Button>
            </VStack>
        </Box>
    )
}
