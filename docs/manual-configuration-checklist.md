# Manual Configuration Checklist

These items need real business accounts, production credentials, or hosting decisions. They should not be hardcoded into the repository.

## Required Before Public Launch

- Production domain and SSL for the storefront.
- Production Medusa backend hosting.
- Managed PostgreSQL for Medusa production data.
- Redis for Medusa event bus, workflows, and production reliability.
- Production environment secrets:
  - `MEDUSA_BACKEND_URL`
  - `MEDUSA_PUBLISHABLE_API_KEY`
  - `NEXT_PUBLIC_MEDUSA_BACKEND_URL`
  - `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_API_KEY`
  - `NEXT_PUBLIC_DEFAULT_REGION=ae`
  - `ADMIN_SESSION_SECRET`
  - Medusa `JWT_SECRET` and `COOKIE_SECRET`
- Payment gateway provider, keys, webhook URL, and webhook secret.
- Shipping/courier account, rate rules, delivery SLA, and return pickup process.
- Business email provider for order confirmations, password reset, and support replies.
- SMS or WhatsApp provider if ZEDX wants delivery and COD confirmation messages.
- Final legal pages: privacy policy, terms, returns/refunds, warranty, shipping policy.
- Production analytics and conversion tracking consent setup.
- Backup schedule and restore test for Medusa PostgreSQL.
- Error monitoring and uptime monitoring for storefront and Medusa.

## Optional But Sales-Critical

- COD verification workflow for high-risk orders.
- Abandoned cart recovery.
- Coupon/promotion rules.
- Product feed export for Meta, Google Merchant Center, and TikTok.
- Customer support inbox integration.
- Reviews/ratings provider.
- Inventory import/export workflow for bulk stock updates.
- Fraud/risk rules once card payments are active.

## Current Local Status

- Store name: `zedx`.
- Region: UAE.
- Currency: AED.
- Checkout mode: cash on delivery and store pickup.
- Catalog source: Medusa products seeded from the current ZEDX frontend catalog.
- Admin portal: Medusa Admin at `http://localhost:9000/app`.
- Storefront: Next.js at `http://localhost:3000`.
- Customer signup/login: wired to Medusa when Medusa environment variables are configured, with a local storefront session mirror.
