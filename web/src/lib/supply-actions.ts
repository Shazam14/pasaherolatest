"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { db, schema } from "@/db/client";
import type { ActionState } from "./listening-state";

const vehicleClasses = [
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
] as const;

const applicationSchema = z
  .object({
    applicantType: z.enum(["operator", "hero_driver"]),
    name: z.string().trim().min(1).max(200),
    contact: z.string().trim().min(1).max(255),
    corridor: z.string().trim().min(1).max(200),
    cpcNumber: z.string().trim().max(100).optional().transform((v) => v || null),
    vehicleClass: z.enum(vehicleClasses).optional().nullable(),
    seats: z.coerce.number().int().min(1).max(60).optional().nullable(),
    notes: z.string().trim().max(2000).optional().transform((v) => v || null),
  })
  // Type-specific fields only persist for the type that owns them, so an
  // operator can never end up filed with a seat count and vice versa.
  .transform((v) =>
    v.applicantType === "operator"
      ? { ...v, vehicleClass: null, seats: null }
      : { ...v, cpcNumber: null },
  );

export async function submitSupplyApplication(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const raw = {
    applicantType: formData.get("applicantType"),
    name: formData.get("name"),
    contact: formData.get("contact"),
    corridor: formData.get("corridor"),
    cpcNumber: formData.get("cpcNumber") ?? undefined,
    vehicleClass: formData.get("vehicleClass") || null,
    seats: formData.get("seats") || null,
    notes: formData.get("notes") ?? undefined,
  };

  const parsed = applicationSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Please fill in your name, contact, and the route you run." };
  }

  if (!db) {
    return { ok: false, error: "Storage isn't connected yet. Hang tight." };
  }

  try {
    const ua = (await headers()).get("user-agent") ?? null;
    await db.insert(schema.supplyApplications).values({ ...parsed.data, userAgent: ua });
    return { ok: true };
  } catch {
    return { ok: false, error: "Something broke on our side. Try again." };
  }
}
