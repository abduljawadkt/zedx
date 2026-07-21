# Client Premium Demo

Frontend-only animated ecommerce demo for a premium gadget and accessories brand.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deployment Checklist

Before deploying to Vercel:

1. Set production environment variables.
   - `NEXT_PUBLIC_SITE_URL`
   - `ADMIN_API_KEY`
   - `ADMIN_PASSWORD`
   - `ADMIN_SESSION_SECRET`
   - `MEDUSA_BACKEND_URL`
   - `MEDUSA_PUBLISHABLE_API_KEY`
2. Keep `DATABASE_URL` pointed at the local SQLite file for the demo, or swap it to PostgreSQL if backend work starts.
3. Run the validation checks.
   - `npm run lint`
   - `npm run build`
4. Smoke test the key routes after deployment.
   - `/`
   - `/products`
   - `/products/[slug]`
   - `/collections`
   - `/collections/[slug]`
   - `/admin`
   - `/admin/login`
   - `/checkout`
5. Verify `robots.txt` and `sitemap.xml` resolve with the production site URL.

## Notes

- This repo intentionally avoids Shopify, payments, databases for customer data, and backend commerce logic.
- The backend layer is mock-backed and read-only for the public storefront.
- Product data comes from `src/data/products.ts`.
