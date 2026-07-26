# Passability model — design proposal

Answers §3.2–3.6 of `PLAN.md`. **Nothing here is applied.** The tables below are a
proposal for review; §3.1 (widening `vehicleClass`) is the only part already shipped.

---

## 1. One disagreement with the plan

`PLAN.md` §3.2 lists the passability states as:

```
passable / passable_with_care / seasonal / impassable
```

`seasonal` does not belong in that enum. The other three describe a **condition**;
`seasonal` describes **when a condition applies**. Putting them on one axis means a
road that is fine in March and a river in August has to be recorded as `seasonal` —
which throws away the actual condition. You can no longer answer "is it passable
right now," which is the question a commuter is asking.

Split the axes:

- **condition** — `passable` / `passable_with_care` / `impassable`
- **weather context** — the circumstance the observation was made under

"Impassable when it rains" then falls out as a *pattern across reports*
(`condition = impassable` where `weather = heavy_rain`), not a state anyone has to
choose at report time. That is also the form §3.3 actually wants, because it
survives aggregation: you can ask "what does this segment do in August" only if
each report carries its own time and weather.

This is the whole reason to design it now rather than retrofit — §3.3 is right that
bolting a time dimension onto flat reports later is painful.

## 2. Passability is not monotonic in vehicle size

Tempting, now that `vehicleClass` is ordered smallest → largest, to store a
threshold: "passable by X and up." That would be wrong. A habal-habal passes a
narrow footbridge a truck cannot; a 4x4 passes mud a tricycle cannot. Size is not a
single ordering for passability — narrowness and traction filter in opposite
directions.

So a report stores an **explicit set** of classes observed to pass, not a cutoff.
The enum ordering stays useful for display, not for inference.

## 3. Proposed tables

Matching existing conventions in `src/db/schema.ts` (explicit snake_case column
names, `uuid` PKs, timestamptz).

```ts
export const passabilityCondition = pgEnum("passability_condition", [
  "passable",
  "passable_with_care",
  "impassable",
]);

export const weatherContext = pgEnum("weather_context", [
  "dry",
  "light_rain",
  "heavy_rain",
  "after_heavy_rain",
  "typhoon",
]);

export const blockageCause = pgEnum("blockage_cause", [
  "flooding",
  "landslide",
  "erosion",
  "washout",
  "collapsed_structure",
  "under_construction",
  "debris",
  "other",
]);

export const roadSegments = pgTable("road_segments", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  name: varchar("name", { length: 200 }).notNull(),
  province: varchar("province", { length: 100 }).notNull(),
  municipality: varchar("municipality", { length: 100 }),
  startLat: numeric("start_lat", { precision: 9, scale: 6 }).notNull(),
  startLng: numeric("start_lng", { precision: 9, scale: 6 }).notNull(),
  endLat: numeric("end_lat", { precision: 9, scale: 6 }).notNull(),
  endLng: numeric("end_lng", { precision: 9, scale: 6 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const passabilityReports = pgTable("passability_reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  segmentId: uuid("segment_id")
    .notNull()
    .references(() => roadSegments.id, { onDelete: "cascade" }),
  condition: passabilityCondition("condition").notNull(),
  passableBy: vehicleClass("passable_by").array().notNull().default([]),
  cause: blockageCause("cause"),
  weather: weatherContext("weather").notNull(),
  // when the observation was true — not when it was typed in
  observedAt: timestamp("observed_at", { withTimezone: true }).notNull(),
  observedLat: numeric("observed_lat", { precision: 9, scale: 6 }),
  observedLng: numeric("observed_lng", { precision: 9, scale: 6 }),
  photoUrl: varchar("photo_url", { length: 500 }),
  // salted hash for dedup/abuse only — never a users FK. See §4.
  reporterToken: varchar("reporter_token", { length: 64 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// A route traverses many segments; a segment serves many routes. This is the
// §3.6 join — it is what turns reports into operator-facing intelligence.
export const routeSegments = pgTable("route_segments", {
  routeId: uuid("route_id")
    .notNull()
    .references(() => routes.id, { onDelete: "cascade" }),
  segmentId: uuid("segment_id")
    .notNull()
    .references(() => roadSegments.id, { onDelete: "cascade" }),
  sequence: integer("sequence").notNull(),
});
```

`observedAt` separate from `createdAt` matters more than it looks: people report
from home hours later, once they have signal. Collapsing them silently backdates or
postdates every observation made outside coverage — which is most of them, on
exactly the roads this is for.

## 4. Anonymity, as a safety property rather than a setting

§3.5 is right that this is retaliation protection, so it has to hold structurally,
not by policy:

- **No `users` FK on a report.** A reporter column pointing at an account builds a
  retaliation map — precisely the artifact that gets someone hurt. `reporterToken`
  is a salted hash, adequate for rate-limiting and dedup, useless for identifying.
- **Strip EXIF on photo upload.** A photo carries GPS and often a device id. Storing
  the file as uploaded silently defeats the anonymity of every other decision here.
- **`observedLat/Lng` is the road, not the reporter.** Name it that way so nobody
  later populates it from the browser's geolocation.

## 5. Report conditions, never people (§3.4)

Every field above is a structured enum or a coordinate. **There is deliberately no
free-text field.** That is the only way to actually guarantee the property §3.4
asks for — a `notes` column is where "the barangay captain's contractor did this"
gets typed, and that is the RA 10175 exposure the plan is trying to avoid.

The cost is real: some conditions won't fit the `cause` enum, which is why `other`
exists and why the enum should be revisited once there are real reports. My
recommendation is to ship without free text and widen the enum from what people
actually pick, rather than open a text box and moderate it.

**This is a product call, not a technical one — flagging it rather than deciding it.**

## 6. Deliberately not built yet

- **No cached "current state" per segment.** Derive from recent reports at query
  time. Add a materialized view when read volume justifies it, not before.
- **No PostGIS.** Start/end coordinates cover "where is this segment" without an
  extension dependency. Revisit if routing or containment queries appear.
- **No trust/reputation scoring on reporters.** It conflicts with §4 and there is no
  abuse to model yet.
- **No moderation queue.** Needed before public write access, not before the schema.

## 7. Open decisions

- [ ] Free text: omit entirely (recommended) or include and moderate?
- [ ] Who can file a report at launch — fully open, or seeded by you on one corridor?
- [ ] Photo storage: Vercel Blob is the least-effort fit, but EXIF stripping has to
      happen server-side before the write regardless of where it lands.
- [ ] Does the beachhead corridor (`PLAN.md` §5) determine the first segments, or do
      segments get seeded independently of booking?
