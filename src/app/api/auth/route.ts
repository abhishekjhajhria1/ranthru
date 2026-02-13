import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

export async function POST(request: Request) {
    try {
        const { email } = await request.json()

        // 1. Find user (In a real app, verify password too)
        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // 2. Set "Session" Cookie (Very simple implementation)
        // In production, sign a JWT or use a session ID
        const cookieStore = await cookies()
        cookieStore.set('userId', user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/'
        })

        return NextResponse.json(user)
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function GET() {
    // Delete session cookie (Logout)
    const cookieStore = await cookies()
    cookieStore.delete('userId')
    return NextResponse.json({ success: true })
}
