# ZEDX Ecommerce

Custom Next.js ecommerce storefront for ZEDX, backed by a self-hosted Medusa commerce backend.

## Local Development

```bash
npm install
npm run db:generate
npm run db:push
npm run dev
```

Open `http://localhost:3000`.

## Medusa Backend

The local Medusa backend lives at:

```bash
/Users/abduljawadkt/Desktop/tech projects/zedx-medusa
```

Start Medusa Admin and Store API:

```bash
cd "/Users/abduljawadkt/Desktop/tech projects/zedx-medusa"
npm run backend:dev
```

Admin portal:

```txt
http://localhost:9000/app
admin@zedx.local
ZedxAdmin@2026
```

Current checkout mode is cash on delivery / store pickup. Card payments are hidden until the payment gateway is ready.

## Deployment Checklist

Before deploying to Vercel:

1. Set production environment variables.
   - `NEXT_PUBLIC_SITE_URL`
   - `ADMIN_API_KEY`
   - `ADMIN_PASSWORD`
   - `ADMIN_SESSION_SECRET`
   - `MEDUSA_BACKEND_URL`
   - `MEDUSA_PUBLISHABLE_API_KEY`
   - `NEXT_PUBLIC_MEDUSA_BACKEND_URL`
   - `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_API_KEY`
2. Keep `DATABASE_URL` pointed at SQLite for local development. For production, provision Postgres and follow `docs/phase-one-backend.md`.
3. Run the validation checks.
   - `npm run lint`
   - `npm run build`
4. Smoke test the key routes after deployment.
   - `/`
   - `/products`
   - `/products/[slug]`
   - `/collections`
   - `/collections/[slug]`
   - Medusa Admin `/app`
   - `/checkout`
5. Verify `robots.txt` and `sitemap.xml` resolve with the production site URL.

## Notes

- Products, categories, collections, stock, shipping, and orders are managed in Medusa Admin.
- Checkout creates real Medusa pending orders using COD or store pickup.
- Customer signup/login is synced with Medusa when Medusa environment variables are configured.
- Card payments are intentionally disabled until the payment gateway phase is configured.
- Manual launch-only setup is tracked in `docs/manual-configuration-checklist.md`.
