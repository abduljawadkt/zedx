# Vercel Setup

## Environment Variables

Set these in the Vercel project settings:

```bash
NEXT_PUBLIC_SITE_URL=https://your-production-domain.vercel.app
ADMIN_API_KEY=<strong-random-string>
ADMIN_PASSWORD=<strong-admin-password>
ADMIN_SESSION_SECRET=<strong-random-string>
DATABASE_URL=postgresql://user:password@host:5432/zedx
STRIPE_SECRET_KEY=<stripe-secret-key>
STRIPE_WEBHOOK_SECRET=<stripe-webhook-secret>
```

Use PostgreSQL for production. The local SQLite demo path is only for isolated development.

## Deployment Steps

1. Connect the repository to Vercel.
2. Add the environment variables above.
3. Run Prisma migrations against the production database.
   - `npm run prisma:migrate:deploy`
4. Configure the Stripe webhook endpoint in Stripe Dashboard to point to `/api/webhooks/stripe`.
5. Deploy the main branch.
6. Verify these routes after the first deployment:
   - `/`
   - `/products`
   - `/collections`
   - `/contact`
   - `/checkout`
   - `/admin/login`
   - `/admin`
   - `/robots.txt`
   - `/sitemap.xml`
7. Confirm `/admin` redirects to `/admin/login` when logged out.
8. Confirm `robots.txt` blocks `/admin` and `/api/admin`.
9. Confirm `sitemap.xml` does not list `/admin`.

## Recommended Post-Deploy Checks

- Open the site on mobile and desktop widths.
- Test product quick view and cart drawer.
- Confirm images load correctly on the main pages.
- Confirm the admin login flow works with the configured credentials.
