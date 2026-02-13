import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value // In real app, this is user ID, but schema might store 'alias' as ID for now? 
    // Wait, prisma schema has User.id (cuid) and User.alias.
    // The previous code stored user.alias in localStorage but probably user.id in cookies? 
    // Let's assume we need to fetch the user to get their ID if 'userId' is the ID.

    // Correction: In `auth/route.ts`, we set 'userId' cookie to `user.id`.
    // In `message-context.tsx`, we were using `user.alias` as senderId.
    // The Schema `Message` uses String for IDs. We should try to stick to consistencies.
    // For now, we will use the Alias if available, or just ID.

    // Let's resolve the User first.
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user || !user.alias) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const body = await request.json()
    const { receiverId, content } = body

    const message = await prisma.message.create({
        data: {
            senderId: user.alias, // Using alias as the ID for messaging as per previous context
            receiverId,
            content
        }
    })

    return NextResponse.json(message)
}

export async function GET(request: Request) {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user || !user.alias) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const { searchParams } = new URL(request.url)
    // Optional: filter by thread?

    const messages = await prisma.message.findMany({
        where: {
            OR: [
                { senderId: user.alias },
                { receiverId: user.alias }
            ]
        },
        orderBy: { timestamp: 'asc' }
    })

    return NextResponse.json(messages)
}
