'use client'

import { SessionProvider } from 'next-auth/react'
import { ChakraProvider } from '@chakra-ui/react'
import theme from '@/src/styles/theme'

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <ChakraProvider theme={theme}>{children}</ChakraProvider>
        </SessionProvider>
    )
}
