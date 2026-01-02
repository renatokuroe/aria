import { withAuth } from 'next-auth/middleware'
import { NextRequest } from 'next/server'

export default withAuth(
    function middleware(req: NextRequest) {
        // Middleware logic is handled by withAuth
        return
    },
    {
        callbacks: {
            authorized: async ({ req, token }) => {
                // Proteger rotas /admin
                if (req.nextUrl.pathname.startsWith('/admin')) {
                    return !!token
                }
                return true
            },
        },
        pages: {
            signIn: '/auth/login',
        },
    }
)

export const config = {
    matcher: ['/admin/:path*', '/dashboard/:path*']
}
