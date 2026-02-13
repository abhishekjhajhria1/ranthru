const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('Seeding database...')

    // 1. Create Services
    const tennis = await prisma.service.upsert({
        where: { id: 1 },
        update: {},
        create: {
            name: "Tennis & Chill (1h)",
            price: 0.15,
            description: "A competitive match followed by relaxation."
        }
    })

    const hiking = await prisma.service.upsert({
        where: { id: 2 },
        update: {},
        create: {
            name: "Hiking Adventure (2h)",
            price: 0.25,
            description: "Explore the trails with a fit companion."
        }
    })

    const retreat = await prisma.service.upsert({
        where: { id: 3 },
        update: {},
        create: {
            name: "The Overnight Retreat (8h)",
            price: 1.0,
            description: "Sunset to sunrise. The ultimate connection."
        }
    })

    // 2. Create Users
    // Client
    const client = await prisma.user.upsert({
        where: { email: 'client@example.com' },
        update: {},
        create: {
            email: 'client@example.com',
            alias: 'Neo',
            role: 'client'
        }
    })

    // Provider (Companion)
    const companion = await prisma.user.upsert({
        where: { email: 'companion@example.com' },
        update: {},
        create: {
            email: 'companion@example.com',
            alias: 'Mistress K',
            role: 'companion'
        }
    })

    // More Companions for UI
    await prisma.user.create({
        data: { email: 'ruby@example.com', alias: 'Ruby', role: 'companion' }
    })
    await prisma.user.create({
        data: { email: 'jade@example.com', alias: 'Jade', role: 'companion' }
    })

    console.log({ tennis, hiking, retreat, client, companion })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
