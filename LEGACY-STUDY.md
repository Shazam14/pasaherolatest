# pasaheroph — Legacy Study (2024 → 2026 Revamp)

Study of the abandoned 2024 attempts, with recommendations for the 2026 revamp.

**Repos studied:**
- `_legacy/web/` — github.com/archimedes7/pasaHERO (Next.js)
- `_legacy/mobile/` — github.com/archimedes7/pasaheromobile (Expo / React Native)

**2024 outcome:** abandoned because the team could not obtain a TNVS permit (corruption blocker).

**2026 strategy (this revamp):** inter-region passenger booking first (Lane D — vans, UV Express, provincial buses) → ad/marketing-funded → zero driver commission → co-op SaaS as Phase 2. Sidesteps TNVS entirely.

---

## TL;DR

| | Web (pasaHERO) | Mobile (pasaheromobile) |
|---|---|---|
| Stack | Next.js 14 + Firebase + MongoDB + NextAuth | Expo SDK 51 + RN 0.74 + Firebase |
| Maturity | ~15–25% built | ~30% built |
| Highest-value asset | PH-filtered Nominatim geocoding in `SearchForm` | Multi-role data model + 825 LOC heatmaps screen |
| Critical issue | Dual-backend architecture (Firebase + MongoDB) | **Leaked Firebase API key in committed `google-services.json`** |
| Verdict | Mostly landing page; backend not started | Foundational scaffolding; dispatch/payments unbuilt |

---

## 🚨 Security — must address before any revamp

1. **Rotate Firebase keys.** Mobile repo committed `google-services.json` and `GoogleService-Info.plist` with live API keys for project `pasaherotestdrive`. These are public on GitHub. **Action: disable that Firebase project or rotate keys.** Do NOT reuse the same project for the 2026 build.
2. **Firestore rules.** Mobile rules are wildcard-permissive (`if request.auth != null`) — any signed-in user can read/write all docs. Not reusable.
3. **Card data.** Mobile stored card numbers and CVVs as plaintext in Firestore — PCI-DSS violation. Any payment work in 2026 must use a tokenizing PSP (PayMongo, Xendit, Maya) so card data never touches our servers.

---

## What's actually built

### Web (`_legacy/web/`)
**Shipped:**
- Landing page (hero, popular destinations carousel, exclusive deals)
- Marketing pages: How It Works, About, HeroTODA, HeroPARK, Relief Support, Help, Legal
- Search form with **debounced Nominatim geocoding, country-filtered to PH**
- Auth signup/login wired to Firebase + NextAuth
- Responsive header/footer/sidebar shell
- 18 brand assets in `public/`, hero videos

**Hollow stubs:** `/dashboard`, `/driver/dashboard`, `/book-ride`, `/ride-history`, `/wallet`, `/profile`, `/notifications` — all bare `<h1>`s.

**Never started:** Trip / Booking / Payment models. Driver KYC. Real-time matching. Admin panel.

### Mobile (`_legacy/mobile/`)
**Shipped (~44 route files):**
- Multi-role auth (Passenger / Driver / Pet Owner / Admin)
- Booking UI: pickup/dropoff, region selection (7 PH regions hardcoded), looking-for-driver screen
- **`map-heatmaps.tsx` (825 LOC)** — most mature feature; price estimation + map visualization
- Wallet: add-card screen + Vision Camera + Tesseract OCR card scanning
- Profile edit (role-specific forms)
- Admin dashboard with applicant list and approve/reject

**Stubs:** Driver matching is a 5s `setTimeout`. Analytics/rides/settings are empty components. Social auth (Google/FB/Apple) imported but not implemented.

**Never started:** Real dispatch. Payments. Real-time listeners. Notifications. Trip/Booking persistence.

---

## Hidden gold (the strategic surprise)

The 2024 code **already whispered the 2026 pivot** even though the team was chasing TNVS:

1. **Web `HowItWorks.tsx`** explicitly mentions: "Register Your TODA," "TODA associations can register members for free." → The co-op / Lane C strategy was latent in the copy.
2. **Mobile region constants** are hardcoded for 7 PH regions including **Tagaytay, Batangas, Pampanga, Bulacan, La Union** — already inter-region thinking, not just Metro Manila.
3. **Pet Owner persona** in the schema → ancillary segment with real demand (pet-friendly transport is a gap in PH).
4. **Accessibility fields** (`wheelchairAccess`, `visualAid`, `hearingAid`) in passenger profile → inclusive design DNA worth keeping.
5. **`HeroPARK` and `Relief Support HERO`** branding pages → ancillary revenue hints (parking marketplace, disaster logistics / gov contracts).
6. **Currency defaulted to PHP**, **PH-only Nominatim filter** → no localization debt to pay down.

**Implication:** the 2026 inter-region + co-op story isn't a pivot away from 2024 — it's a refocusing of what was already half-articulated.

---

## What to LIFT into 2026

| Asset | Source | Why |
|---|---|---|
| `SearchForm.tsx` (geocoding) | web | PH-filtered Nominatim + debounced autocomplete, production-ready |
| `AuthContext.tsx` pattern | mobile | Role-based state, session validation, profile streaming |
| `useProtectedRoute` hook | mobile | Elegant role-based navigation guards |
| Profile schema (CommonFields + role variants) | mobile `types.ts` | Comprehensive PH-context fields incl. accessibility |
| Sidebar + dashboard shell | web | Responsive, role-aware, animated |
| Brand assets, color system, "Become a HERO" copy | both | Save weeks of design |
| `HowItWorks` sticky-scroll narrative | web | Smart UX pattern + already TODA-aware copy |
| Vision Camera OCR pattern | mobile | Reusable for driver license / OR-CR scanning |

---

## What to REWRITE (don't lift)

- **Dual-backend architecture** (Firebase + MongoDB) → pick one. Recommend Postgres (Neon via Vercel Marketplace) + Drizzle ORM for the structured trip/booking/payment data model. Keep Firebase only if we want push/realtime cheap.
- **NextAuth v4 setup** → broken credentials provider; migrate to NextAuth v5 (Auth.js) or Clerk (faster, native Vercel integration).
- **Dual mapping libs** (Mapbox + Leaflet) → pick one. Mapbox if we're paying for routing/directions; Leaflet+OSM if we're staying free.
- **Firestore wildcard rules** → fine-grained per-collection rules, or move to Postgres + RLS.
- **Card storage** → tokenize via PayMongo/Xendit; never store PAN/CVV.
- **Mixed Pages + App Router** in web → App Router only.
- **Driver matching stub** → real dispatch (Phase 2 problem; v1 inter-region is operator-managed schedules, not on-demand matching).
- **Outdated runtimes** → Next.js 15+, Expo SDK 52+, RN 0.75+, Node 24 LTS.

---

## 2026 stack recommendation (proposed)

> Decisions to confirm with the user before scaffolding.

- **Web/passenger app:** Next.js 15 (App Router) on Vercel, TypeScript strict, Tailwind, shadcn/ui
- **Mobile (Phase 2):** Expo SDK 52+ with Expo Router; share schema via a `packages/types` if we go monorepo
- **Auth:** Clerk (Vercel Marketplace, fast) or Auth.js v5 (free, more control)
- **DB:** Neon Postgres (Vercel Marketplace) + Drizzle ORM. Schema: `users`, `operators`, `vehicles`, `routes`, `schedules`, `bookings`, `payments`, `ads`, `ad_impressions`
- **Payments:** PayMongo (PH-native, supports GCash/Maya/cards)
- **Maps:** Mapbox GL (web) + react-native-maps (mobile); Mapbox Directions for ETA on inter-region routes
- **Ads:** Custom-served from our DB initially (sponsored placements, partner ads). Reach AdMob/Google Ad Manager only when we have audience scale.
- **Realtime (Phase 2):** Pusher or Supabase Realtime
- **Deploy:** Vercel for web; EAS for mobile
- **Monitoring:** Vercel Analytics + Sentry

---

## Maturity scoring

| Area | Web | Mobile |
|---|---|---|
| Landing / marketing | 90% | 60% |
| Auth | 40% | 80% (email only) |
| Profile | 5% | 70% |
| Booking UI | 0% | 60% |
| Booking persistence | 0% | 0% |
| Driver matching | 0% | 5% (stub) |
| Wallet | 0% | 40% |
| Payments | 0% | 0% |
| Admin | 0% | 20% |

**Composite:** Web ~20%, Mobile ~30%. Both projects reached "presentable scaffold" before TNVS shutdown.

---

## Recommended next moves

1. **Rotate compromised Firebase keys** (action item for user).
2. **Decide v1 scope** for pasaheroph 2026:
   - Lane D (inter-region booking aggregator) — recommended starting wedge
   - Single corridor pilot (e.g., Manila ⇆ Baguio, or Cebu ⇆ Bohol)
   - One operator partner to start
3. **Confirm 2026 stack** (Next.js 15 + Postgres + Clerk + PayMongo + Mapbox).
4. **Scaffold v1**: auth + operator dashboard + route/schedule CRUD + passenger booking flow + ads slot infra.
5. Lift `SearchForm`, `AuthContext`, profile schema, brand assets from legacy as foundation.

---

*Study generated 2026-05-10 by Claude. Source: parallel Explore-agent passes on `_legacy/web/` and `_legacy/mobile/`.*
