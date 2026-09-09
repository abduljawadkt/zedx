# Medusa COD Operations

## Current Local Setup

- Store name: `zedx`
- Region: `UAE`
- Currency: `AED`
- Backend URL: `http://localhost:9000`
- Storefront URL: `http://localhost:3000`
- Admin URL: `http://localhost:9000/app`
- Admin user: `admin@zedx.local`

The current payment mode is cash on delivery and store pickup. Card checkout is hidden in the frontend until the gateway keys and provider are ready.

## What Medusa Manages

- Products, variants, prices, categories, and collections.
- Inventory levels.
- UAE shipping options.
- Customer checkout orders.
- Customer account records created from the storefront signup flow.
- Admin order management.

## Local Commands

Start Medusa:

```bash
cd "/Users/abduljawadkt/Desktop/tech projects/zedx-medusa"
npm run backend:dev
```

Start the ZedX frontend:

```bash
cd "/Users/abduljawadkt/Desktop/tech projects/zedx"
npm run dev
```

Run Medusa migrations:

```bash
cd "/Users/abduljawadkt/Desktop/tech projects/zedx-medusa"
npm run backend:migrate
```

Create or reset an admin user:

```bash
cd "/Users/abduljawadkt/Desktop/tech projects/zedx-medusa"
npm run backend:user -- -e admin@zedx.local -p 'ZedxAdmin@2026'
```

## Catalog Import

The Medusa seed reads catalog data from the existing frontend files:

- `/Users/abduljawadkt/Desktop/tech projects/zedx/src/data/products.ts`
- `/Users/abduljawadkt/Desktop/tech projects/zedx/src/data/categories.ts`

The seed creates ZedX products in Medusa with one color variant per product and stocks each variant.

## Checkout Flow

The ZedX frontend checkout posts to `/api/checkout`. When Medusa env variables are present, that route:

1. Creates a Medusa cart in the UAE region.
2. Attaches the signed-in Medusa customer when a customer token is available.
3. Adds Medusa line items using variant IDs.
4. Adds UAE standard delivery or store pickup.
5. Creates a system payment session for COD/pickup.
6. Completes the cart into a Medusa order.

Orders appear in Medusa Admin under `Orders`.

## Customer Accounts

The storefront keeps a local HttpOnly session for the account UI. When Medusa is configured, signup and login also use Medusa customer auth and store a separate HttpOnly Medusa customer token. The token lets the account order-history route read the signed-in customer's Medusa orders, and saved delivery details are synced into the Medusa customer address book.

Password reset and account recovery still need a production email provider before launch.

## Payment Gateway Handoff

When the gateway is ready:

1. Install/configure the Medusa payment provider.
2. Add production gateway secrets to Medusa.
3. Add the frontend publishable key if required.
4. Re-enable the card payment option in `src/components/checkout/CheckoutPage.tsx`.
5. Update `/api/checkout` to route card orders through the gateway provider instead of the system provider.
6. Test success, failed, cancelled, and webhook-confirmed payment flows.
