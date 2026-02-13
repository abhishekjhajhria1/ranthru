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

    // If provider, return requests assigned to them (or all for MVP demo context)
    // If client, return their bookings
    const where = user.role === 'client'
        ? { clientId: userId }
        : { providerId: userId } // Simplified: Providers see bookings where they are assigned

    const bookings = await prisma.booking.findMany({
        where,
        include: { service: true, client: true, provider: true },
        orderBy: { date: 'desc' }
    })

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
    // data: { serviceId, date, txHash, totalPrice, addons }

    // Hardcoded provider selection for MVP: "Mistress K" logic
    // In a real app, `providerId` would come from the selected companion in the UI
    // We'll search for a provider or pick the first one for now
    const provider = await prisma.user.findFirst({ where: { role: 'companion' } })

    const booking = await prisma.booking.create({
        data: {
            date: new Date(data.date),
            status: 'pending',
            totalPrice: data.totalPrice,
            txHash: data.txHash,
            service: { connect: { id: Number(data.serviceId) } },
            client: { connect: { id: userId } },
            provider: provider ? { connect: { id: provider.id } } : undefined
        }
    })

    return NextResponse.json(booking)
}
