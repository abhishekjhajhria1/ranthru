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
            bookingsAsCompanion: true // simplistic way to check availability
        }
    })

    return NextResponse.json(users)
}
