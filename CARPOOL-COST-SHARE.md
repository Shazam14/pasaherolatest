# Carpool cost-share — design proposal

The legal theory of the carpool product in one line:

> **The driver must never collect more than their own share of the trip's cost.**

Everything below exists to make that a property the system cannot violate, rather
than a claim in the footer. **Nothing here is applied** — no tables created, no
migration pushed. See §7 before building any of it.

---

## 1. Why a disclaimer isn't enough

`trip/[id]/page.tsx` currently tells passengers that drivers "retain private-vehicle
status" and that Pasahero PH "does not operate as a TNVS or commercial carrier."
That sentence describes an intention. It does not constrain anything.

The distinction that matters is **profit, not vocabulary**. A driver recovering part
of a trip they were making anyway is cost-sharing. A driver clearing more than the
trip cost is operating for hire, which needs a franchise, and without one that is
colorum — whatever the platform calls it.

The seed data as originally written failed that test — and failed it more broadly
than a collected-vs-total-cost comparison suggests. Against the per-seat cap in §2:

| Driver (`content/corridor.ts`) | Vehicle | Was | Cap | |
|---|---|---|---|---|
| kenneth-tan | Mirage, 2 seats | ₱400 | ₱467 | ok |
| juan-cruz | Vios, 3 seats | ₱450 | ₱404 | over by ₱46 |
| maria-reyes | Civic, 3 seats | ₱500 | ₱422 | over by ₱78 |
| **anna-garcia** | **Innova, 5 seats** | **₱550** | **₱298** | **over by ₱252** |

Three of four, not one. The weaker test — does the driver clear the whole trip cost —
only catches `anna-garcia`, because the other two still ran at a loss overall. The
per-seat cap is the standard worth holding: it asks whether the driver paid *their
own share*, not merely whether they avoided outright profit.

Seed prices were corrected to sit under the cap. They are demo data, which makes
getting them right more important than it looks — seed listings teach drivers what a
normal listing looks like.

## 2. The invariant

```
fuelEstimate  = distanceKm / kmPerLitre × fuelPricePerLitre
tripCost      = fuelEstimate + tolls
maxSeatPrice  = floor( tripCost / (seatsOffered + 1) )
```

The `+ 1` is the driver counting as an occupant paying their own share. That single
character is the entire legal argument.

It holds under full occupancy, which is the only case worth checking:

```
collected = seats × tripCost/(seats+1)  =  tripCost × seats/(seats+1)  <  tripCost
```

The driver always absorbs at least `tripCost/(seats+1)`. There is no seat count and
no price at which a compliant listing yields a profit.

**Round down, never up.** Rounding up lets a listing clear cost by a few pesos, which
is the whole thing you are trying to prevent.

Worked example — `anna-garcia`, 246 km, Innova at ~12 km/L, diesel ₱58/L, tolls ₱600:

```
fuelEstimate = 246/12 × 58   = ₱1,189
tripCost     = 1,189 + 600   = ₱1,789
maxSeatPrice = 1,789 / 6     = ₱298      ← listed at ₱550, rejected
```

At the cap she collects ₱1,475 against ₱1,789 and still pays ₱314 herself. Correct.

Note what the cap does as seats rise: five passengers split a fixed cost six ways, so
the honest price falls to ₱298 against a ₱760 bus fare. Cheapness is the *output* of
genuine cost-sharing, not a discount being funded by anyone.

## 3. `kmPerLitre` is platform-set, not driver-declared

The obvious way to game the cap is to declare a thirsty vehicle: claim 4 km/L and the
ceiling doubles. So efficiency is **not** a driver input. It is a constant per
`vehicleClass` — which is why widening that enum mattered beyond passability.

Each figure is set at the **efficient end** of its class's real range. That direction
is not arbitrary: `cap = tripCost/(seats+1)`, and better efficiency means lower
`tripCost`, so assuming a vehicle is thrifty produces a *stricter* cap. Every vehicle
in a class therefore lands at or below its true share, and nobody profits from being
in a coarse bucket.

```ts
// Efficient end of range, deliberately. Getting this backwards inflates every cap.
export const KM_PER_LITRE: Record<VehicleClass, number> = {
  tricycle: 35, habal_habal: 45, sedan: 18, jeepney: 8,
  multicab: 12, mpv: 13, van: 10, uv_express: 10,
  bus_regular: 4, bus_premium: 4, truck: 4, suv_4x4: 9,
};

// Diesel is the cheaper fuel, so it is also the conservative assumption for the
// classes that actually run on it.
export const FUEL_BY_CLASS: Partial<Record<VehicleClass, "gasoline" | "diesel">> = {
  mpv: "diesel", van: "diesel", uv_express: "diesel",
  jeepney: "diesel", truck: "diesel", bus_regular: "diesel", bus_premium: "diesel",
};
```

`sedan` and `mpv` exist for carpool but earn their place independently: "hindi kaya ng
sedan, kailangan 4x4" is one of the most common real road reports there is, so both
are passability categories on their own merits. No `hatchback` — a Mirage and a Vios
are the same vehicle for both purposes, and every extra class is another figure to
defend.

Bus classes are listed for completeness only — licensed operators price under a CPC
and never touch this path.

## 4. Schema

```ts
// Fuel price moves weekly. Snapshot it onto the listing so every cap ever
// computed can be reconstructed and defended.
export const fuelPrices = pgTable("fuel_prices", {
  id: uuid("id").defaultRandom().primaryKey(),
  pricePerLitre: numeric("price_per_litre", { precision: 6, scale: 2 }).notNull(),
  effectiveDate: date("effective_date").notNull(),
  source: varchar("source", { length: 200 }),
});

export const carpoolListings = pgTable(
  "carpool_listings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    driverUserId: uuid("driver_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    routeId: uuid("route_id")
      .notNull()
      .references(() => routes.id, { onDelete: "restrict" }),
    class: vehicleClass("class").notNull(),
    departureDate: date("departure_date").notNull(),
    departureTime: time("departure_time").notNull(),
    seatsOffered: integer("seats_offered").notNull(),
    seatsAvailable: integer("seats_available").notNull(),
    seatPrice: numeric("seat_price", { precision: 10, scale: 2 }).notNull(),

    // --- cost basis snapshot: the audit trail ---
    basisDistanceKm: integer("basis_distance_km").notNull(),
    basisKmPerLitre: numeric("basis_km_per_litre", { precision: 5, scale: 2 }).notNull(),
    basisFuelPrice: numeric("basis_fuel_price", { precision: 6, scale: 2 }).notNull(),
    basisTolls: numeric("basis_tolls", { precision: 10, scale: 2 }).notNull(),
    basisMaxSeatPrice: numeric("basis_max_seat_price", { precision: 10, scale: 2 }).notNull(),
    basisComputedAt: timestamp("basis_computed_at", { withTimezone: true }).notNull(),

    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    // The invariant, enforced by Postgres. No application path can bypass it.
    check("seat_price_within_cost_share", sql`${t.seatPrice} <= ${t.basisMaxSeatPrice}`),
    check("seats_offered_sane", sql`${t.seatsOffered} between 1 and 7`),
  ],
);
```

`routes` needs one additive column:

```ts
tollsEstimate: numeric("tolls_estimate", { precision: 10, scale: 2 }).notNull().default("0"),
```

**The CHECK constraint is the point.** An application-level guard is a promise; a
constraint is a fact. It survives a careless server action, a seed script, and a
console session.

## 5. `bookings` needs to accept both kinds

`bookings.scheduleId` is currently `NOT NULL` referencing `schedules`, and `schedules`
requires an `operatorId`. So today a carpool ride **cannot be booked at all** — the
model has no path for it. That is why this is cheap to get right now.

```ts
scheduleId: uuid("schedule_id").references(() => schedules.id, { onDelete: "restrict" }),        // now nullable
carpoolListingId: uuid("carpool_listing_id").references(() => carpoolListings.id, { onDelete: "restrict" }),

check("exactly_one_subject", sql`num_nonnulls(${t.scheduleId}, ${t.carpoolListingId}) = 1`)
```

Making `scheduleId` nullable is a real migration against an existing table. Trivial
now at zero rows; not trivial later.

## 6. No booking fee on carpool

`bookings.bookingFee` must be `0` for carpool rows, and I'd enforce that too:

```ts
check("no_fee_on_carpool", sql`${t.carpoolListingId} is null or ${t.bookingFee} = 0`)
```

Taking a per-ride cut is what makes a platform look like a transport broker rather
than a noticeboard. Ads fund this — that was already the model. Charging the fee
would trade the strongest fact in your defence for a small amount of revenue.

## 7. Do not build this yet

Ordering matters more than the schema does:

1. **Ship the bus side first.** Licensed operators under a CPC carry no colorum
   exposure. `operators.cpcNumber` already exists — make it required before `status`
   can reach `approved` and that half is defensible on its own.
2. **Get Philippine transport counsel before carpool goes live.** This document makes
   the model *internally consistent* with a cost-sharing claim. Whether that claim
   survives LTFRB scrutiny is not something I can answer, and it is worth the fee to
   find out before launch rather than after an impoundment.
3. **Then build the tables**, with whatever counsel changes.

Meanwhile, one thing worth doing regardless: **fix the seed data.** `anna-garcia` at
₱550 × 5 is a worked example of the violation, sitting in the repo, teaching the
wrong norm. Bring the seeds under the cap even while carpool is unbuilt.

## 8. Open decisions

- [ ] Toll figures per corridor — hand-entered, or scraped from the operators?
- [ ] Does the driver declare `vehicleClass`, and is it verified against OR/CR?
- [ ] Round trips: is the return leg a separate listing, or does `tripCost` double?
- [ ] Empty-seat cancellation — if 1 of 5 seats sells, the driver is far out of
      pocket. Acceptable, or does that pressure them toward off-platform pricing?
- [ ] Does carpool launch on the beachhead corridor at all, or only after buses prove
      the model?
