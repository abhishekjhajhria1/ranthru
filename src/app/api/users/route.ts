import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')

    const where = role ? { role } : {}

    const users = await prisma.user.findMany({
        where,
        select: {
            id: true,
            alias: true,
            role: true,
            // Simple logic for availability: if they have a confirmed booking today, they are busy
            // For MVP, just returning users
        }
    })

    // Map to UI format if needed, or frontend handles it
    // Adding mock 'status', 'rating', 'img', 'type' for the frontend UI logic
    const enhancedUsers = users.map(u => ({
        ...u,
        name: u.alias,
        rating: "5.0", // Mock
        status: "Available", // Mock
        img: "bg-zinc-800", // Mock placeholder class
        type: "GEN" // General
    }))

    return NextResponse.json(enhancedUsers)
}

// PUT: Update User Profile
import { cookies } from 'next/headers'

export async function PUT(request: Request) {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { alias, bio, hourlyRate, email, blurPhotos, isIncognito } = body

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                alias,
                // email, // Email updates might require verification in a real app
                // bio, hourlyRate (need to add these to schema first!)
                // blurPhotos, isIncognito (need to add these to schema first!)
            }
        })

        return NextResponse.json(updatedUser)
    } catch (error) {
        console.error("Update failed", error)
        return NextResponse.json({ error: "Update failed" }, { status: 500 })
    }
}
