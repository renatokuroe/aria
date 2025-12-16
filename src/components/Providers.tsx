'use client'

import { SessionProvider } from 'next-auth/react'
import { ChakraProvider } from '@chakra-ui/react'

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <ChakraProvider>{children}</ChakraProvider>
        </SessionProvider>
    )
}
