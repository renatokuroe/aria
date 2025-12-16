const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

    ; (async () => {
        try {
            console.log('Starting cleanup: deleting Prompt rows...')
            await prisma.$executeRawUnsafe('DELETE FROM "Prompt";')
            console.log('Prompt rows deleted.')

            console.log('Deleting QRReading rows...')
            await prisma.$executeRawUnsafe('DELETE FROM "QRReading";')
            console.log('QRReading rows deleted.')

            console.log('Deleting User rows...')
            await prisma.$executeRawUnsafe('DELETE FROM "User";')
            console.log('User rows deleted.')

            console.log('\nCleanup completed successfully.')
        } catch (err) {
            console.error('Cleanup failed:', err)
            process.exit(1)
        } finally {
            await prisma.$disconnect()
        }
    })()
