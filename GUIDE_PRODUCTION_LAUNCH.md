# Production Launch Guide: Hosting & Payments

This guide covers how to connect a custom domain and how to approach the requested payment features.

## 1. Hosting on a Custom Domain
You have two main parts: **Buying** the domain and **Connecting** it to Vercel.

### Step A: Buy a Domain
You can buy a domain from:
- **Namecheap / GoDaddy / Porkbun** (Cheaper, more management options)
- **Vercel** (Easiest integration, slightly more expensive)

### Step B: Connect to Vercel
1.  Go to your Project Settings on Vercel.
2.  Click **Domains** in the sidebar.
3.  Enter your domain (e.g., `ranthru.com`).
4.  **If you validated via Vercel**: It works automatically.
5.  **If you bought elsewhere (Namecheap/etc)**: Vercel will give you "Nameservers" or "A Records".
    -   Log in to your Domain Registrar (e.g., Namecheap).
    -   Find "DNS Settings" or "Nameservers".
    -   Change them to point to Vercel (e.g., `ns1.vercel-dns.com`...) OR add the A Record as shown.

---

## 2. Crypto Payments & Verification
To enable "Pay with Crypto", we need to upgrade the app with **Web3** libraries.

### The Stack
-   **Frontend**: `RainbowKit` + `Wagmi` (Best user experience for connecting wallets like MetaMask).
-   **Backend Verification**: `Etherscan API` or `Alchemy` to check if a transaction really happened.

### How it works
1.  **Connect**: User clicks "Connect Wallet".
2.  **Send**: User clicks "Pay 0.15 ETH". The app prompts their wallet to send ETH to *your* wallet address.
3.  **Record**: App gets the `Transaction Hash` (e.g., `0x123...abc`) from the wallet.
4.  **Verify**: App sends this Hash to your `/api/bookings`. The Backend checks the blockchain to confirm the money moved.

*I can implement the "Connect & Send" part for you next.*

---

## 3. Google Pay (via Stripe)
For robust credit card and Google Pay support, **Stripe** is the industry standard.

### Setup
1.  Create a **Stripe Account**.
2.  Get your **API Keys** (Publishable & Secret).
3.  Install `@stripe/stripe-js`.

### How it works
1.  **Checkout**: User clicks "Book".
2.  **Session**: Backend calls Stripe to create a "Checkout Session".
3.  **Redirect**: User is taken to a secure Stripe page (supports Google Pay / Apple Pay automatically).
4.  **Webhook**: When they pay, Stripe notifies your backend via a "Webhook" to mark the booking as confirmed.

---

## 4. Other "Improvements"
To make the site truly professional:
1.  **Real Auth**: Move from simple simple email check to **Auth.js** or **Clerk** (Passwordless login, Google Login).
2.  **Email**: Use **Resend.com** to email users their booking confirmation.
3.  **Storage**: Use **UploadThing** or **AWS S3** so users can upload real profile photos.
