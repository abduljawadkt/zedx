# ZEDX Commerce Brief

## Goal

Build a full real ecommerce backend for the ZEDX premium gadget store.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Motion
- Prisma
- PostgreSQL in production

## Scope

- Real product, category, collection, CMS, SEO, media, order, inventory, and admin APIs
- Admin auth with sessions and roles
- Public storefront stays premium and frontend-first
- No Shopify
- No fake backend
- No payment gateway shortcuts

## Current Contract

- Public APIs must only expose published storefront data
- Admin APIs must be protected
- Seed data is only for local/dev bootstrap
- Keep routes deployable on Vercel

## Priority Order

1. Database and Prisma migration
2. Auth and permissions
3. Product/category/collection CRUD
4. Media uploads
5. CMS and SEO
6. Checkout and orders
7. Inventory tracking
8. Production deployment wiring

## Notes

- Prefer reusable backend helpers
- Keep response contracts stable where possible
- Optimize for clarity and production readiness
