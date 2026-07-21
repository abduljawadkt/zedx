# Deployment Checklist

## Required Environment Variables

Set these in Vercel before production deploy:

- `NEXT_PUBLIC_SITE_URL`  
  The public production URL, for example `https://your-app.vercel.app`
- `ADMIN_API_KEY`  
  Optional API access key for protected admin routes
- `ADMIN_PASSWORD`  
  Password for the seeded admin account
- `ADMIN_SESSION_SECRET`  
  Session signing secret
- `MEDUSA_BACKEND_URL`  
  Base URL for the Medusa backend, for example `https://your-medusa-store.com`
- `MEDUSA_PUBLISHABLE_API_KEY`  
  Publishable key used by storefront requests
- `DATABASE_URL`  
  Use PostgreSQL for production deployments

## Required Validation

Run these locally before deploy:

```bash
npm run lint
npm run build
```

## Smoke Test Routes

After deployment, verify:

- `/`
- `/products`
- `/products/[slug]`
- `/collections`
- `/collections/[slug]`
- `/contact`
- `/checkout`
- `/admin/login`
- `/admin`
- `/robots.txt`
- `/sitemap.xml`

## Expected Behavior

- Public storefront routes return `200`
- `/admin` redirects to `/admin/login` unless authenticated
- `robots.txt` blocks `/admin` and `/api/admin`
- `sitemap.xml` excludes `/admin`

## Intentional Demo Scope

This project intentionally does not include:

- Shopify integration
- payment processing
- customer account system
- order management backend
- shipping or tax calculation
- database-backed commerce logic for real customers

The storefront is designed to be deployable as a premium frontend demo, with backend expansion planned later if needed.

## Database Migration

For the full ecommerce backend, run Prisma migrations against PostgreSQL before deploying:

```bash
npm run prisma:migrate:deploy
```
