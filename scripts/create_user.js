const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
    ; (async () => {
        const p = new PrismaClient()
        try {
            const hashed = bcrypt.hashSync('password123', 10)
            const u = await p.user.create({ data: { email: 'smoke-local@example.com', password: hashed } })
            console.log('created', u.id)
        } catch (e) {
            console.error('ERR', e)
        } finally {
            await p.$disconnect()
        }
    })()
