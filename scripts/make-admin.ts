import { prisma } from '@/src/lib/prisma'

async function makeAdmin(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            console.error(`Usuário com email ${email} não encontrado`)
            process.exit(1)
        }

        const updated = await prisma.user.update({
            where: { email },
            data: { role: 'admin' }
        })

        console.log(`✅ Usuário ${updated.email} agora é admin!`)
        process.exit(0)
    } catch (error) {
        console.error('Erro:', error)
        process.exit(1)
    }
}

const email = process.argv[2]

if (!email) {
    console.error('Uso: node scripts/make-admin.js <email>')
    process.exit(1)
}

makeAdmin(email)
