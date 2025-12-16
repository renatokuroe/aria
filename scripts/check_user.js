const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.findUnique({ where: { email: 'test@example.com' } })
    if (!user) {
        console.log('User not found')
    } else {
        console.log('User found:')
        console.log({ id: user.id, email: user.email, passwordSet: !!user.password, createdAt: user.createdAt })
    }
    await prisma.$disconnect()
}

main().catch((e) => {
    console.error(e)
    process.exit(1)
})