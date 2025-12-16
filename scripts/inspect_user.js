const { PrismaClient } = require('@prisma/client')
    ; (async () => {
        const p = new PrismaClient()
        try {
            const u = await p.user.findUnique({ where: { email: 'smoke-local@example.com' } })
            console.log(u)
        } catch (e) { console.error(e) }
        finally { await p.$disconnect() }
    })()
