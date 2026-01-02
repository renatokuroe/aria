const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function makeAdmin(email) {
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            console.error(`❌ Usuário com email ${email} não encontrado`)
            console.log('\n💡 Para criar um novo usuário admin, use:')
            console.log(`   node scripts/create-admin.js ${email} <senha> [nome]\n`)
            process.exit(1)
        }

        const updated = await prisma.user.update({
            where: { email },
            data: { role: 'admin' }
        })

        console.log(`✅ Usuário ${updated.email} agora é admin!`)
        process.exit(0)
    } catch (error) {
        console.error('❌ Erro:', error.message)
        process.exit(1)
    }
}

const email = process.argv[2]

if (!email) {
    console.error('❌ Uso: node scripts/make-admin.js <email>')
    console.error('   Exemplo: node scripts/make-admin.js usuario@aria.com')
    console.error('\n💡 Para criar um novo usuário admin, use:')
    console.error('   node scripts/create-admin.js <email> <senha> [nome]\n')
    process.exit(1)
}

makeAdmin(email)

