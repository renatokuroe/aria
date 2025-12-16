import { NextResponse } from 'next/server'

// optional: endpoint for the front-end to call quickly
export async function GET() {
    const url = process.env.NEXT_PUBLIC_QR_API
    if (!url) return NextResponse.json({ error: 'QR API not configured' }, { status: 500 })
    try {
        const res = await fetch(`${url}/latest`)
        const data = await res.json()
        return NextResponse.json(data)
    } catch (err) {
        return NextResponse.json({ error: 'Failed to fetch from QR API' }, { status: 502 })
    }
}
