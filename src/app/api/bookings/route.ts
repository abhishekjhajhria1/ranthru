import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

// GET: List bookings for the current user
export async function GET() {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    let bookings
    if (user.role === 'companion') {
        bookings = await prisma.booking.findMany({
            where: { companionId: userId },
            include: { client: true, service: true },
            orderBy: { createdAt: 'desc' }
        })
    } else {
        bookings = await prisma.booking.findMany({
            where: { clientId: userId },
            include: { companion: true, service: true },
            orderBy: { createdAt: 'desc' }
        })
    }

    return NextResponse.json(bookings)
}

// POST: Create a new booking
export async function POST(request: Request) {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const data = await request.json()
    // data: { serviceId, companionId (optional for now, or picked), date, txHash, addons }

    // For MVP, if no companion picked, assign to Mistress K (Seed user)
    // In real app, `companionId` comes from UI
    let companionId = data.companionId
    if (!companionId) {
        const defaultCompanion = await prisma.user.findFirst({ where: { role: 'companion' } })
        companionId = defaultCompanion?.id
    }

    const booking = await prisma.booking.create({
        data: {
            clientId: userId,
            companionId: companionId,
            serviceId: data.serviceId, // Make sure frontend sends ID, not name
            date: new Date(data.date),
            status: 'pending',
            txHash: data.txHash,
            totalPrice: data.totalPrice, // Verify on backend in real app
            addons: JSON.stringify(data.addons)
        }
    })

    return NextResponse.json(booking)
}
