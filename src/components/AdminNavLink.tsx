'use client'

import { useSession } from 'next-auth/react'
import { Button, Tooltip } from '@chakra-ui/react'

export default function AdminNavLink() {
    const { data: session } = useSession()

    if (!session?.user || (session.user as any)?.role !== 'admin') {
        return null
    }

    return (
        <Tooltip label="Painel de Administrador" placement="bottom">
            <Button
                as="a"
                href="/admin"
                colorScheme="red"
                variant="outline"
                size="sm"
            >
                🔐 Admin
            </Button>
        </Tooltip>
    )
}
