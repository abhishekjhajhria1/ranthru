const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    // 1. Create Services
    const services = [
        { name: 'Tennis & Chill (1h)', price: 0.15, description: 'A competitive match followed by relaxation.' },
        { name: 'Hiking Adventure (2h)', price: 0.25, description: 'Explore the trails with a fit companion.' },
        { name: 'The Overnight Retreat (8h)', price: 1.0, description: 'Sunset to sunrise. The ultimate connection.' },
    ]

    for (const service of services) {
        await prisma.service.create({
            data: service,
        })
    }

    // 2. Create a Sample Provider (Companion)
    await prisma.user.upsert({
        where: { email: 'mistress.k@ranthru.com' },
        update: {},
        create: {
            email: 'mistress.k@ranthru.com',
            alias: 'Mistress K',
            role: 'companion',
            walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
        },
    })

    // 3. Create a Sample Member (Client)
    await prisma.user.upsert({
        where: { email: 'vip.member@proton.me' },
        update: {},
        create: {
            email: 'vip.member@proton.me',
            alias: 'VIP Member',
            role: 'member',
            walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
        },
    })

    console.log('Seeding completed.')
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
