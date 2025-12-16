import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url)
    const confirm = searchParams.get('confirm')
    const adminKey = searchParams.get('key')

    // Check admin key (use environment variable for security)
    const validKey = process.env.ADMIN_KEY || 'dev-admin-key-123'
    if (adminKey !== validKey) {
        return NextResponse.json({
            error: 'Invalid admin key',
            message: 'Add ?key=YOUR_ADMIN_KEY to authenticate'
        }, { status: 401 })
    }

    // Security check: require confirmation parameter
    if (confirm !== 'yes-delete-all-users') {
        return NextResponse.json({
            error: 'Confirmation required',
            message: 'Add ?confirm=yes-delete-all-users to the URL to confirm deletion'
        }, { status: 400 })
    }

    try {
        // Delete all users
        const result = await prisma.user.deleteMany({})

        return NextResponse.json({
            ok: true,
            message: `${result.count} users deleted successfully`,
            count: result.count
        })
    } catch (err: any) {
        return NextResponse.json({
            error: err?.message || 'Failed to delete users'
        }, { status: 500 })
    }
}
