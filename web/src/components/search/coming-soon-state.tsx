"use client";

import * as React from "react";
import { ArrowRight, BellRing, Clock, MapPin, Route } from "lucide-react";
import type { Corridor } from "@/content/corridors";

export function ComingSoonState({ corridor }: { corridor: Corridor }) {
  return (
    <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-12 items-start">
      <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 md:p-8">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--accent)]/10 border border-[color:var(--accent)]/30 text-[color:var(--accent)] px-3 py-1 text-xs font-medium uppercase tracking-[0.1em]">
          <Clock className="size-3.5" />
          Coming {corridor.expectedLaunch ?? "soon"}
        </span>
        <h2 className="text-3xl md:text-4xl font-semibold tracking-[-0.02em] mt-4">
          {corridor.origin} <span className="text-[color:var(--muted)]">⇆</span>{" "}
          {corridor.destination}
        </h2>
        <p className="text-base md:text-lg text-[color:var(--muted)] leading-relaxed mt-3 max-w-xl">
          {corridor.blurb}
        </p>

        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <Stat icon={<Route className="size-4" />} label="Distance">
            {corridor.distanceKm} km
          </Stat>
          <Stat icon={<Clock className="size-4" />} label="Travel time">
            ~{corridor.durationHours}h
          </Stat>
        </dl>

        <p className="text-xs text-[color:var(--muted)] mt-6 leading-relaxed">
          We open a corridor when we have enough verified Hero Drivers and at least one operator
          partner running daily schedules. Waitlist signups help us decide where to launch next.
        </p>
      </div>

      <div className="rounded-2xl border border-[color:var(--accent)]/30 bg-gradient-to-br from-[color:var(--accent)]/8 to-transparent p-6 md:p-8">
        <div className="flex items-center gap-2 text-[color:var(--accent)]">
          <BellRing className="size-4" />
          <span className="text-xs uppercase tracking-[0.12em] font-medium">Shape the route</span>
        </div>
        <h3 className="text-xl md:text-2xl font-semibold tracking-tight mt-3">
          Tell us how you travel this route.
        </h3>
        <p className="text-sm text-[color:var(--muted)] leading-relaxed mt-2">
          We open {corridor.origin} ⇆ {corridor.destination} where demand is provable. Tell us the
          times you need and what the trip costs you now — we read every one.
        </p>

        <a
          href="/request-corridor"
          className="mt-5 inline-flex items-center justify-center gap-1.5 rounded-full bg-[color:var(--primary)] text-[color:var(--primary-foreground)] px-6 h-12 text-base font-medium hover:opacity-90 transition-opacity"
        >
          Tell us your route <ArrowRight className="size-4" />
        </a>

        <p className="text-xs text-[color:var(--muted)] mt-4 inline-flex items-center gap-1.5">
          <MapPin className="size-3.5" />
          Want to drive this corridor? Apply as a Hero Driver — we open routes where supply lands first.
        </p>
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-[0.1em] text-[color:var(--muted)] inline-flex items-center gap-1.5">
        {icon}
        {label}
      </dt>
      <dd className="text-lg font-semibold tracking-tight mt-1">{children}</dd>
    </div>
  );
}

export function UnsupportedCorridorState({ from, to }: { from: string; to: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[color:var(--border-strong)] bg-[color:var(--surface)] p-10 md:p-12 text-center">
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
        We don&apos;t run {from} ⇆ {to} yet.
      </h2>
      <p className="text-[color:var(--muted)] mt-2 max-w-md mx-auto">
        We&apos;re rolling out corridors one at a time so each one launches with real supply.
        Try one of our active or upcoming routes.
      </p>
      <div className="mt-6">
        <a
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--primary)] text-[color:var(--primary-foreground)] px-6 h-11 text-sm font-medium hover:opacity-90 transition-opacity"
        >
          See all corridors <ArrowRight className="size-4" />
        </a>
      </div>
    </div>
  );
}
