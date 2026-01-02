const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function listUsers() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                credits: true,
                createdAt: true,
                _count: {
                    select: {
                        prompts: true,
                        qrReads: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        if (users.length === 0) {
            console.log('❌ Nenhum usuário encontrado')
            process.exit(0)
        }

        console.log(`\n📊 Total de ${users.length} usuário(s)\n`)
        console.log('┌──────────────────────────────────────────────────────────────────────────────┐')

        users.forEach((user, index) => {
            const roleEmoji = user.role === 'admin' ? '👑' : '👤'
            const createdDate = new Date(user.createdAt).toLocaleDateString('pt-BR')

            console.log(`│ ${index + 1}. ${roleEmoji} ${user.email}`)
            console.log(`│    Nome: ${user.name || '(sem nome)'}`)
            console.log(`│    Créditos: ${user.credits} | Prompts: ${user._count.prompts} | QR Reads: ${user._count.qrReads}`)
            console.log(`│    Criado em: ${createdDate}`)
            console.log('├──────────────────────────────────────────────────────────────────────────────┤')
        })
        console.log('└──────────────────────────────────────────────────────────────────────────────┘\n')

        process.exit(0)
    } catch (error) {
        console.error('❌ Erro ao listar usuários:', error.message)
        process.exit(1)
    }
}

listUsers()
