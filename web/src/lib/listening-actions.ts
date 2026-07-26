"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { db, schema } from "@/db/client";
import type { ActionState } from "./listening-state";

const painValues = [
  "too_expensive",
  "no_late_night",
  "no_early_morning",
  "unsafe_pickup",
  "no_direct",
  "other",
] as const;

const requestSchema = z.object({
  origin: z.string().trim().min(1).max(200),
  destination: z.string().trim().min(1).max(200),
  pain: z.enum(painValues),
  details: z.string().trim().max(2000).optional().transform((v) => v || null),
  frequency: z.string().trim().max(100).optional().transform((v) => v || null),
  contact: z.string().trim().min(1).max(255),
});

const feedbackSchema = z.object({
  message: z.string().trim().min(1).max(4000),
  contact: z.string().trim().max(255).optional().transform((v) => v || null),
  pagePath: z.string().trim().min(1).max(500),
});

export async function submitRouteRequest(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = requestSchema.safeParse({
    origin: formData.get("origin"),
    destination: formData.get("destination"),
    pain: formData.get("pain"),
    details: formData.get("details") ?? undefined,
    frequency: formData.get("frequency") ?? undefined,
    contact: formData.get("contact"),
  });

  if (!parsed.success) {
    return { ok: false, error: "Please fill in origin, destination, and contact." };
  }

  if (!db) {
    return { ok: false, error: "Storage isn't connected yet. Hang tight." };
  }

  try {
    const ua = (await headers()).get("user-agent") ?? null;
    await db.insert(schema.routeRequests).values({ ...parsed.data, userAgent: ua });
    return { ok: true };
  } catch {
    return { ok: false, error: "Something broke on our side. Try again." };
  }
}

export async function submitFeedback(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = feedbackSchema.safeParse({
    message: formData.get("message"),
    contact: formData.get("contact") ?? undefined,
    pagePath: formData.get("pagePath"),
  });

  if (!parsed.success) {
    return { ok: false, error: "Tell us what's on your mind." };
  }

  if (!db) {
    return { ok: false, error: "Storage isn't connected yet. Hang tight." };
  }

  try {
    const ua = (await headers()).get("user-agent") ?? null;
    await db.insert(schema.feedbackSubmissions).values({ ...parsed.data, userAgent: ua });
    return { ok: true };
  } catch {
    return { ok: false, error: "Something broke on our side. Try again." };
  }
}
