<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project context

This is a frontend-only animated ecommerce demo for a premium gadget/accessories brand.

The purpose is to impress a client with design, motion, product presentation, and frontend interactions.

## Important rules

- Do not add backend functionality.
- Do not add Shopify.
- Do not add payment gateway.
- Do not add database.
- Do not copy any existing website code, assets, logo, or exact text.
- Use mock product data from `src/data/products.ts`.
- Keep the demo production-quality and deployable to Vercel.
- Prioritize premium design and smooth animation.
- Use TypeScript, Tailwind CSS, Next.js App Router, and Motion.
- Use reusable components.
- Ensure mobile responsiveness.

## Visual style

- Dark premium tech aesthetic.
- Large typography.
- Big product imagery.
- Soft radial glows.
- Glassmorphism header and overlays.
- Rounded cards.
- Subtle borders.
- Framer-style animations.
- Smooth transitions.

## Design brief

Create a website that feels like a premium consumer electronics launch experience.

The user should feel:

- This is futuristic.
- This is high-end.
- This is smooth.
- This is more advanced than a basic ecommerce theme.
- This can become a serious online store after backend integration.

Visual references:

- Apple product pages for spacing and product focus.
- Framer websites for motion and scroll storytelling.
- Premium gadget brands for dark product visuals.

Avoid:

- Basic Shopify template feel.
- Too many colors.
- Crowded layout.
- Generic ecommerce blocks.
- Fake backend logic.
- Overcomplicated state management.

Prioritize:

- Hero impact.
- Product image presentation.
- Smooth scroll animation.
- Product cards.
- Product detail page.
- Cart/search overlays.
- Mobile polish.

## Animation rules

- Use Motion.
- Use `whileInView` for reveal animations.
- Use `AnimatePresence` for modals, drawers, overlays, and mobile menu.
- Use `useScroll` and `useTransform` for scroll-linked hero/sticky animations.
- Avoid excessive animation that hurts usability.
- Respect accessibility where possible.

## Build requirements

Before finishing a task:

- Run `npm run lint`.
- Run `npm run build`.
- Fix any errors.
- Do not leave broken routes.
- Do not leave broken image paths.

## Review guidelines

Flag as high priority:

- Broken routes
- Broken build
- Broken mobile layout
- Backend/payment integration added by mistake
- Hardcoded copied brand references
- Missing alt text on key images
- Unused large dependencies
- Console errors
