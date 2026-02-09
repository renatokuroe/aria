'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Box, VStack, Heading, Text, Button, Code, useToast } from '@chakra-ui/react'

export default function DebugProfile() {
    const { data: session } = useSession()
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const toast = useToast()

    const fetchDebugData = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/debug/profile')
            const json = await res.json()
            setData(json)
            console.log('Debug data:', json)
        } catch (error) {
            toast({ title: 'Erro', description: String(error), status: 'error' })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (session) {
            fetchDebugData()
        }
    }, [session])

    return (
        <Box p={6}>
            <VStack align="start" spacing={4}>
                <Heading>Debug - Dados do Perfil</Heading>
                <Text>Email da sessão: <strong>{session?.user?.email}</strong></Text>
                <Button onClick={fetchDebugData} isLoading={loading}>Recarregar Dados</Button>

                {data && (
                    <>
                        <Box w="full" bg="gray.100" p={4} borderRadius="md">
                            <Code whiteSpace="pre-wrap">
                                {JSON.stringify(data, null, 2)}
                            </Code>
                        </Box>

                        {data.userFromDb && (
                            <Box w="full">
                                <Heading size="sm" mb={2}>Dados do Usuário:</Heading>
                                <Text>ID: {data.userFromDb.id}</Text>
                                <Text>Email: {data.userFromDb.email}</Text>
                                <Text>Nome: {data.userFromDb.name || '(vazio)'}</Text>
                                <Text>Telefone: {data.userFromDb.phone || '(vazio)'}</Text>
                            </Box>
                        )}
                    </>
                )}
            </VStack>
        </Box>
    )
}
