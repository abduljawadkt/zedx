# ZEDX Client Decisions Needed

These items are business decisions and should be signed off before claim-based UI, SEO schema, or conversion modules are published.

| ID | Decision | Current implementation until confirmed |
| --- | --- | --- |
| 0.1 | Are ratings and review counts real? | Ratings/review counts removed from visible UI and JSON-LD. |
| 0.2 | Keep premium dark palette or approve blue rebrand? | Existing premium dark palette retained. |
| 0.3 | Warranty term and coverage. | Neutral warranty-support copy only. No fixed duration claim. |
| 0.4 | Delivery SLA. | Neutral UAE delivery-support copy only. No day-count promise. |
| 0.5 | Official contact email/domain. | Central config uses `hello@zedx.store` until replaced. |
| 0.6 | Real payment methods. | Payment badges are not shown. |
| 0.7 | Domain strategy. | SEO base URL defaults to `https://zedx.vercel.app`; set `NEXT_PUBLIC_SITE_URL` before launch. |
| 0.8 | Launch offer end date. | No countdown or end-date urgency. |
| 0.9 | AI product advisor: build or remove? | Advisor remains as an interactive product helper, not a verified trust promise. |
| 0.10 | SKU-level specs: mAh, BT version, driver size, IP rating, playback hours. | Generic specs/highlights only; detailed tables should be populated after data is supplied. |

