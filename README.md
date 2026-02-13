# RANTHRU

**Intimacy. Sport. Connection.**

RanThru is a premier destination for elite companionship, built with Next.js 14, Tailwind CSS, and Prisma.

## Features

- **Full-Stack Booking System**: Clients can book companions for various services.
- **Crypto Payments**: Integrated Ethereum payments via RainbowKit + Wagmi.
- **Real-Time Messaging**: Secure, persistent chat between clients and providers.
- **Reviews & Ratings**: Trust system for verify service quality.
- **Safety Center**: Dedicated resources and tools for user safety.
- **Role-Based Dashboards**: Distinct experiences for Clients and Companions.

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install --legacy-peer-deps
    ```

2.  **Database Setup**:
    ```bash
    npx prisma generate
    npx prisma db push
    node prisma/seed.js
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

4.  **Open**: [http://localhost:3000](http://localhost:3000)

## Deployment

Refer to **[GUIDE_PRODUCTION_LAUNCH.md](./GUIDE_PRODUCTION_LAUNCH.md)** for detailed deployment instructions.

## Next Steps

Refer to **[NEXT_STEPS.md](./NEXT_STEPS.md)** for the post-handoff mission checklist.
