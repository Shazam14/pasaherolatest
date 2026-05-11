"use client";

import * as React from "react";
import { ArrowRight, BellRing, Check, Clock, MapPin, Route } from "lucide-react";
import type { Corridor } from "@/content/corridors";

export function ComingSoonState({ corridor }: { corridor: Corridor }) {
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

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
          <span className="text-xs uppercase tracking-[0.12em] font-medium">Get notified</span>
        </div>
        <h3 className="text-xl md:text-2xl font-semibold tracking-tight mt-3">
          Be first when this corridor goes live.
        </h3>
        <p className="text-sm text-[color:var(--muted)] leading-relaxed mt-2">
          One email when {corridor.origin} ⇆ {corridor.destination} opens. No spam, no marketing — just
          the launch ping.
        </p>

        {submitted ? (
          <div className="mt-5 rounded-xl border border-[color:var(--success)]/30 bg-[color:var(--success)]/10 p-4 flex items-start gap-3">
            <span className="flex size-8 items-center justify-center rounded-full bg-[color:var(--success)]/20 text-[color:var(--success)] flex-shrink-0">
              <Check className="size-4" />
            </span>
            <div>
              <p className="font-medium text-[color:var(--success)]">You&apos;re on the list.</p>
              <p className="text-sm text-[color:var(--muted)] mt-1">
                We&apos;ll email <span className="text-[color:var(--foreground)]">{email}</span> the
                moment this corridor goes live.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-5 flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              required
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-full border border-[color:var(--border-strong)] bg-[color:var(--surface)] px-5 h-12 text-base font-medium outline-none focus:border-[color:var(--accent)] transition-colors"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[color:var(--primary)] text-[color:var(--primary-foreground)] px-6 h-12 text-base font-medium hover:opacity-90 transition-opacity"
            >
              Notify me <ArrowRight className="size-4" />
            </button>
          </form>
        )}

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
