import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt',
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                // dev logs to help debug auth flow
                console.log('[auth] authorize called for', credentials?.email)
                if (!credentials?.email || !credentials?.password) return null
                const user = await prisma.user.findUnique({ where: { email: credentials.email } })
                console.log('[auth] user found?', !!user)
                if (!user || !user.password) return null
                console.log('[auth] comparing password hash')
                const isValid = bcrypt.compareSync(credentials.password, user.password)
                console.log('[auth] password match?', isValid)
                if (!isValid) return null
                // return a user object (without password)
                // NextAuth will store JWT/session
                const { password, ...rest } = user as any
                return rest
            },

        }),
    ],
    pages: {
        signIn: '/auth/login',
        signOut: '/auth/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = (user as any).id
                token.email = (user as any).email
            }
            return token
        },
        async session({ session, token }) {
            if (token) session.user = { id: token.id as string, email: token.email as string }
            return session
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
}
