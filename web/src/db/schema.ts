import {
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
  numeric,
  boolean,
  uuid,
  date,
  time,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const userRole = pgEnum("user_role", ["passenger", "operator", "admin"]);
export const operatorStatus = pgEnum("operator_status", ["pending", "approved", "suspended"]);
export const vehicleClass = pgEnum("vehicle_class", [
  "tricycle",
  "habal_habal",
  "sedan",
  "jeepney",
  "multicab",
  "mpv",
  "van",
  "uv_express",
  "bus_regular",
  "bus_premium",
  "truck",
  "suv_4x4",
]);
export const bookingStatus = pgEnum("booking_status", [
  "pending",
  "confirmed",
  "cancelled",
  "completed",
  "no_show",
]);
export const paymentMethod = pgEnum("payment_method", ["cash", "gcash", "maya", "card"]);
export const paymentStatus = pgEnum("payment_status", ["unpaid", "paid", "refunded", "failed"]);
export const adPlacement = pgEnum("ad_placement", [
  "search_results",
  "confirmation",
  "receipt",
  "homepage",
  "trip_detail",
  "request_ack",
]);
export const supplyApplicantType = pgEnum("supply_applicant_type", [
  "operator",
  "hero_driver",
]);
export const routeRequestPain = pgEnum("route_request_pain", [
  "too_expensive",
  "no_late_night",
  "no_early_morning",
  "unsafe_pickup",
  "no_direct",
  "other",
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  fullName: varchar("full_name", { length: 200 }),
  phone: varchar("phone", { length: 32 }),
  role: userRole("role").notNull().default("passenger"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const operators = pgTable("operators", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerUserId: uuid("owner_user_id").references(() => users.id, { onDelete: "set null" }),
  name: varchar("name", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  legalEntity: varchar("legal_entity", { length: 200 }),
  cpcNumber: varchar("cpc_number", { length: 100 }),
  contactEmail: varchar("contact_email", { length: 255 }),
  contactPhone: varchar("contact_phone", { length: 32 }),
  status: operatorStatus("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const vehicles = pgTable("vehicles", {
  id: uuid("id").defaultRandom().primaryKey(),
  operatorId: uuid("operator_id").references(() => operators.id, { onDelete: "cascade" }).notNull(),
  plateNumber: varchar("plate_number", { length: 32 }).notNull(),
  class: vehicleClass("class").notNull(),
  seatCount: integer("seat_count").notNull(),
  amenities: jsonb("amenities").$type<string[]>().default([]).notNull(),
});

export const routes = pgTable("routes", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  originCity: varchar("origin_city", { length: 100 }).notNull(),
  destinationCity: varchar("destination_city", { length: 100 }).notNull(),
  distanceKm: integer("distance_km"),
  active: boolean("active").notNull().default(true),
});

export const schedules = pgTable("schedules", {
  id: uuid("id").defaultRandom().primaryKey(),
  operatorId: uuid("operator_id").references(() => operators.id, { onDelete: "cascade" }).notNull(),
  routeId: uuid("route_id").references(() => routes.id, { onDelete: "cascade" }).notNull(),
  vehicleId: uuid("vehicle_id").references(() => vehicles.id, { onDelete: "set null" }),
  departureDate: date("departure_date").notNull(),
  departureTime: time("departure_time").notNull(),
  arrivalTime: time("arrival_time").notNull(),
  totalSeats: integer("total_seats").notNull(),
  seatsAvailable: integer("seats_available").notNull(),
  fare: numeric("fare", { precision: 10, scale: 2 }).notNull(),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const bookings = pgTable("bookings", {
  id: uuid("id").defaultRandom().primaryKey(),
  reference: varchar("reference", { length: 12 }).notNull().unique(),
  passengerUserId: uuid("passenger_user_id").references(() => users.id, { onDelete: "set null" }),
  scheduleId: uuid("schedule_id").references(() => schedules.id, { onDelete: "restrict" }).notNull(),
  passengerName: varchar("passenger_name", { length: 200 }).notNull(),
  passengerPhone: varchar("passenger_phone", { length: 32 }).notNull(),
  passengerEmail: varchar("passenger_email", { length: 255 }),
  seats: integer("seats").notNull().default(1),
  fareTotal: numeric("fare_total", { precision: 10, scale: 2 }).notNull(),
  bookingFee: numeric("booking_fee", { precision: 10, scale: 2 }).notNull().default("0"),
  status: bookingStatus("status").notNull().default("pending"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  bookingId: uuid("booking_id").references(() => bookings.id, { onDelete: "cascade" }).notNull(),
  method: paymentMethod("method").notNull(),
  status: paymentStatus("status").notNull().default("unpaid"),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  providerRef: varchar("provider_ref", { length: 200 }),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const ads = pgTable("ads", {
  id: uuid("id").defaultRandom().primaryKey(),
  advertiser: varchar("advertiser", { length: 200 }).notNull(),
  headline: varchar("headline", { length: 200 }).notNull(),
  body: text("body"),
  ctaLabel: varchar("cta_label", { length: 80 }),
  ctaUrl: text("cta_url"),
  imageUrl: text("image_url"),
  placement: adPlacement("placement").notNull(),
  active: boolean("active").notNull().default(true),
  startsAt: timestamp("starts_at", { withTimezone: true }),
  endsAt: timestamp("ends_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const adImpressions = pgTable("ad_impressions", {
  id: uuid("id").defaultRandom().primaryKey(),
  adId: uuid("ad_id").references(() => ads.id, { onDelete: "cascade" }).notNull(),
  shownAt: timestamp("shown_at", { withTimezone: true }).defaultNow().notNull(),
  clicked: boolean("clicked").notNull().default(false),
  context: varchar("context", { length: 200 }),
});

export const routeRequests = pgTable("route_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  origin: varchar("origin", { length: 200 }).notNull(),
  destination: varchar("destination", { length: 200 }).notNull(),
  pain: routeRequestPain("pain").notNull(),
  details: text("details"),
  frequency: varchar("frequency", { length: 100 }),
  contact: varchar("contact", { length: 255 }).notNull(),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const supplyApplications = pgTable("supply_applications", {
  id: uuid("id").defaultRandom().primaryKey(),
  applicantType: supplyApplicantType("applicant_type").notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  contact: varchar("contact", { length: 255 }).notNull(),
  corridor: varchar("corridor", { length: 200 }).notNull(),
  // Operators only — the franchise that makes them legal to aggregate.
  cpcNumber: varchar("cpc_number", { length: 100 }),
  // Hero Drivers only.
  vehicleClass: vehicleClass("vehicle_class"),
  seats: integer("seats"),
  notes: text("notes"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const feedbackSubmissions = pgTable("feedback_submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  message: text("message").notNull(),
  contact: varchar("contact", { length: 255 }),
  pagePath: varchar("page_path", { length: 500 }).notNull(),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const operatorRelations = relations(operators, ({ many, one }) => ({
  vehicles: many(vehicles),
  schedules: many(schedules),
  owner: one(users, { fields: [operators.ownerUserId], references: [users.id] }),
}));

export const scheduleRelations = relations(schedules, ({ one, many }) => ({
  operator: one(operators, { fields: [schedules.operatorId], references: [operators.id] }),
  route: one(routes, { fields: [schedules.routeId], references: [routes.id] }),
  vehicle: one(vehicles, { fields: [schedules.vehicleId], references: [vehicles.id] }),
  bookings: many(bookings),
}));

export const bookingRelations = relations(bookings, ({ one, many }) => ({
  schedule: one(schedules, { fields: [bookings.scheduleId], references: [schedules.id] }),
  passenger: one(users, { fields: [bookings.passengerUserId], references: [users.id] }),
  payments: many(payments),
}));
