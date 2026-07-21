# Backend Implementation Blueprint

This repo now includes a mock-backed backend foundation using Next.js App Router Route Handlers. The current implementation is intentionally read-only and deployable on Vercel. Replace the mock repository layer with PostgreSQL/Prisma and object storage when production backend work starts.

## Implemented Now

- `GET /api/health`
- `GET /api/products`
- `GET /api/products/[slug]`
- `GET /api/categories`
- `GET /api/categories/[slug]`
- `GET /api/collections`
- `GET /api/collections/[slug]`
- `GET /api/site-settings`
- `GET /api/homepage`
- `GET /api/admin/dashboard/summary`
- `/admin` dashboard preview
- Dynamic `sitemap.xml`
- Dynamic `robots.txt`

## Backend Modules To Build Next

1. Auth and permissions
   - Admin users, roles, permissions, password hashing, sessions, reset flow.
   - Protect all `/api/admin/*` write routes.

2. Database
   - PostgreSQL with Prisma.
   - Migration scripts, seed scripts, backup strategy.

3. Product catalog
   - Product CRUD, variants, specs, tags, badges, SKU, publish states, related products.
   - Keep public APIs read-only and published-only.

4. Media manager
   - Cloudflare R2 or AWS S3 uploads.
   - Store metadata, alt text, dimensions, mime type, sort order, and ownership.
   - Generate thumbnails/WebP/AVIF variants.

5. Categories and collections
   - CRUD, product assignment, manual ordering, featured flags, SEO metadata.

6. Site CMS
   - Homepage sections, announcement bar, navigation, footer links, social links, theme settings.

7. SEO
   - Entity metadata, canonicals, OG images, robots settings, redirects, sitemap.

8. Dashboard
   - Catalog counts, draft count, SEO warnings, missing image/alt text warnings, recent activity.

9. Search
   - PostgreSQL full-text search first.
   - Upgrade to Meilisearch or Algolia only if catalog size or UX requires it.

## Suggested Prisma Tables

```txt
User
Role
Permission
UserRole
Product
ProductVariant
ProductImage
ProductSpec
ProductTag
ProductRelation
Category
Collection
ProductCategory
ProductCollection
MediaAsset
SiteSettings
HomepageSection
NavigationItem
FooterLink
Page
SeoMetadata
Redirect
InventoryLog
AuditLog
```

## Production API Shape

```txt
GET    /api/products
GET    /api/products/:slug
POST   /api/admin/products
PATCH  /api/admin/products/:id
DELETE /api/admin/products/:id

GET    /api/categories
POST   /api/admin/categories
PATCH  /api/admin/categories/:id

GET    /api/collections
POST   /api/admin/collections
PATCH  /api/admin/collections/:id

GET    /api/homepage
PATCH  /api/admin/homepage-sections/:id

POST   /api/admin/media/upload
PATCH  /api/admin/media/:id
DELETE /api/admin/media/:id

PATCH  /api/admin/seo/:entityType/:entityId
POST   /api/admin/redirects
```

## Migration Strategy

1. Keep the response contracts in `src/lib/backend/types.ts`.
2. Replace `src/lib/backend/catalog.ts` with repository functions backed by Prisma.
3. Add protected admin mutations under `/api/admin/*`.
4. Add cloud media uploads after auth is live.
5. Connect admin forms to write APIs.
6. Replace direct frontend imports from `src/data/*` with API/repository calls where needed.

## Do Not Build Yet

- Payment gateway
- Shopify integration
- Customer accounts
- Orders
- Shipping/tax logic
- Reviews/wishlist/discounts

Those modules should come only after the product, media, CMS, and SEO backend is stable.
