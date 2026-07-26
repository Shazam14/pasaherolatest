# Pasahero — deploy plan, week of 2026-07-27

Scope: what ships this week, what doesn't, and the improvements worth making before
the schema hardens. Companion to `LEGACY-STUDY.md` (why 2024 failed) — this is the
forward half.

---

## 0. Blockers — do these before anything goes live

**1. The 2024 repos are still public with live credentials.**

| Repo | Owner | Visibility |
|---|---|---|
| `pasaHERO` | `archimedes7` | **PUBLIC** |
| `pasaheromobile` | `archimedes7` | **PUBLIC** |

`LEGACY-STUDY.md` records that `pasaheromobile` committed `google-services.json`
and `GoogleService-Info.plist` with live API keys for Firebase project
`pasaherotestdrive`, and that the mobile app stored card numbers and CVVs as
plaintext in Firestore. Both repos are still world-readable.

- [ ] Disable Firebase project `pasaherotestdrive` outright (preferred — the 2026
      build must not reuse it) or rotate its keys.
- [ ] Make both legacy repos private. They sit under `archimedes7`, not `Shazam14`,
      so this may need whoever owns that account.
- [ ] If any real card data ever reached that Firestore, deleting it is not
      optional — treat as a PCI-DSS and RA 10173 matter, not housekeeping.

Going private does not un-leak a key that has been public since 2024. Rotate first,
then close the repo.

**2. `.gitignore` is modified and uncommitted** in `pasaheroph/`. Resolve before any
deploy so `.env.local` handling is unambiguous. Never commit `DATABASE_URL` or the
Mapbox token.

---

## 1. Where the 2026 build actually is

`web/` is Next.js 16 + React 19, Neon Postgres via Drizzle, Mapbox/MapLibre,
Tailwind. Real, not scaffolding.

**Routes built:** `/` (landing), `/search`, `/book`, `/trip/[id]`, `/request-corridor`.

**Schema built** (`src/db/schema.ts`): `users`, `operators`, `vehicles`, `routes`,
`schedules`, `bookings`, `payments`, `ads`, `adImpressions`, `routeRequests`,
`feedbackSubmissions`. The ad model and the demand-capture model are both already
there — that is further along than the 2024 attempt ever got.

**The gap:** every booking route depends on operator supply that does not exist yet.
`coming-soon-state.tsx` suggests this is already understood.

---

## 2. This week — ship demand, not supply

The single most important sequencing call: **deploy the half that needs no
operators.** Booking cannot ship without inventory, and a booking flow with no
trips in it damages trust on first contact. Demand capture ships today and produces
the exact asset needed to negotiate with operators.

**In scope**

- [ ] Landing page — hero, how-it-works, corridors, why-us, FAQ, footer
- [ ] `/request-corridor` — the wedge. Every submission is evidence of demand on a
      named route.
- [ ] Feedback widget
- [ ] `/search` behind `coming-soon-state` — show corridors, capture the intent,
      promise nothing
- [ ] Analytics on corridor requests from day one; this is the dataset, not a vanity
      metric
- [ ] Verify `routeRequests` and `feedbackSubmissions` write correctly against
      production Neon

**Out of scope this week**

- `/book`, `/trip/[id]` — no supply
- Payments — see §4
- Operator onboarding, auth, admin

**Definition of done:** a stranger can land, understand what Pasahero is, name a
route they want, and leave a way to be contacted. Nothing on the page implies they
can book today.

---

## 3. Improvements worth making before the schema hardens

**3.1 `vehicleClass` cannot express the roads you care about.**

Currently: `bus_regular`, `bus_premium`, `uv_express`, `van`. That is the formal
inter-region fleet only. The passability thesis — *which vehicles can pass this
road* — needs the informal classes, because they are precisely what a bad road
filters down to:

```
tricycle, habal_habal, jeepney, multicab, van, uv_express,
bus_regular, bus_premium, truck, suv_4x4
```

Cheap to widen now, migration-and-backfill later.

**3.2 There is no passability model at all.** The schema is pure booking. If "which
roads are passable, by what, and when" is the thesis, it needs its own tables —
roughly a road segment, and reports against it carrying: vehicle classes that can
pass, a passability state, photo, GPS, timestamp, reporter.

Passability is **not a boolean.** Minimum viable states:

```
passable / passable_with_care / seasonal / impassable
```

**3.3 Seasonality is the field everyone forgets.** A road that is fine in March and
a river in August is the normal case here, not the edge case. If a report cannot
express "impassable when it rains," the dataset is wrong for half the year. Design
it in now; retrofitting a time dimension onto flat reports is painful.

**3.4 Report conditions, never people.** Structured fields over free text, and no
field that invites naming an official or contractor. This keeps the product clear
of RA 10175 online-libel exposure, and aggregated timestamped reports apply more
pressure than accusations do anyway.

**3.5 Reporter anonymity is a safety feature.** Treat it as protection from
retaliation, not as a privacy checkbox.

**3.6 The passability data feeds the booking business.** Knowing which routes a van
can actually complete, in which month, is operational intelligence the operators
themselves do not have. It is a reason for them to talk to you.

---

## 4. Payments — deferred, and the constraint when it lands

Not this week. When it does: use a tokenizing PSP (PayMongo, Xendit, or Maya) so
card data never touches our servers. The 2024 build stored PANs and CVVs in
plaintext; that must not recur. `paymentMethod` already enumerates
`cash / gcash / maya / card` — cash-on-boarding is the realistic v1 anyway.

---

## 5. Open questions

- [ ] **Domain and trademark.** "Pasahero" is a common noun — check `pasahero.ph`
      availability and run a trademark search before more brand work. `pasahero.ph`
      reads native; `pasaheroph.com` reads like a fallback.
- [ ] **Donated infrastructure.** Report volume ranks segments by how many people
      are blocked and for how long — an impact-priority list nobody else can
      produce, and the loop is provable (fix → new reports confirm passable). Two
      constraints: start with what needs no permits (footbridge, drainage, culvert,
      signage), since permits are the wall that killed v1; and publish where every
      peso went from day one, before anyone asks.
- [ ] Which corridor is the beachhead? Pick one and go deep rather than listing
      many.
