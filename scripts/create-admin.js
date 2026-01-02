const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdmin(email, password, name) {
    try {
        // Verificar se usuário já existe
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            console.error(`❌ Usuário ${email} já existe`)
            process.exit(1)
        }

        // Hash da senha
        const hashedPassword = bcrypt.hashSync(password, 10)

        // Criar usuário admin
        const user = await prisma.user.create({
            data: {
                email,
                name: name || email.split('@')[0],
                password: hashedPassword,
                role: 'admin',
                credits: 1000 // Admin começa com créditos
            }
        })

        console.log(`✅ Admin criado com sucesso!`)
        console.log(`   Email: ${user.email}`)
        console.log(`   Nome: ${user.name}`)
        console.log(`   Role: ${user.role}`)
        console.log(`   Créditos: ${user.credits}`)
        process.exit(0)
    } catch (error) {
        console.error('❌ Erro ao criar admin:', error.message)
        process.exit(1)
    }
}

const email = process.argv[2]
const password = process.argv[3]
const name = process.argv[4]

if (!email || !password) {
    console.error('❌ Uso: node scripts/create-admin.js <email> <senha> [nome]')
    console.error('   Exemplo: node scripts/create-admin.js admin@aria.com senha123 "Admin"')
    process.exit(1)
}

createAdmin(email, password, name)
