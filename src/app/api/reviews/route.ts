import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const { bookingId, rating, comment, providerId } = body

    // Validate booking ownership
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } })
    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    if (booking.clientId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const review = await prisma.review.create({
        data: {
            bookingId,
            rating,
            comment,
            clientId: userId,
            providerId: providerId // We store this for easy searching later
        }
    })

    return NextResponse.json(review)
}
