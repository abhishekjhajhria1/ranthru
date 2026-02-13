import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

// POST: Login (Simulated via finding existing user by email)
export async function POST(request: Request) {
    try {
        const { email } = await request.json()

        // Find user
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Set "Session" Cookie
        const cookieStore = await cookies()
        cookieStore.set('userId', user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/'
        })

        return NextResponse.json(user)

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// GET: Logout
export async function GET() {
    // Delete session cookie
    const cookieStore = await cookies()
    cookieStore.delete('userId')
    return NextResponse.json({ success: true })
}
