"use client";

import * as React from "react";
import { ArrowRight, Check, BusFront, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { submitSupplyApplication } from "@/lib/supply-actions";
import { initialActionState } from "@/lib/listening-state";

const vehicleClasses = [
  { id: "sedan", label: "Sedan" },
  { id: "mpv", label: "MPV (Innova, Avanza)" },
  { id: "suv_4x4", label: "SUV / 4x4" },
  { id: "van", label: "Van" },
  { id: "uv_express", label: "UV Express" },
];

const fieldClass =
  "w-full h-12 px-4 rounded-xl border border-[color:var(--border-strong)] bg-[color:var(--background)] text-base outline-none focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent)]/20 transition-all";

export function ApplyForm({ initialType }: { initialType: "operator" | "hero_driver" }) {
  const [type, setType] = React.useState(initialType);
  const [state, formAction, pending] = React.useActionState(
    submitSupplyApplication,
    initialActionState,
  );
  const [dismissed, setDismissed] = React.useState(false);

  React.useEffect(() => {
    if (state.ok) setDismissed(false);
  }, [state]);

  if (state.ok && !dismissed) {
    return (
      <div className="rounded-2xl border border-[color:var(--success)]/30 bg-[color:var(--success)]/10 p-8">
        <span className="flex size-12 items-center justify-center rounded-full bg-[color:var(--success)]/20 text-[color:var(--success)]">
          <Check className="size-6" />
        </span>
        <h2 className="text-2xl font-semibold tracking-tight mt-5">
          Got it — we&apos;ll be in touch.
        </h2>
        <p className="text-[color:var(--muted)] mt-2 leading-relaxed max-w-lg">
          We read every application ourselves. We&apos;re opening one corridor at a time, so it may
          be a little while before we get to yours — we&apos;ll tell you either way.
        </p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="mt-6 text-sm font-medium text-[color:var(--accent)] underline-offset-4 hover:underline"
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 md:p-8"
    >
      <input type="hidden" name="applicantType" value={type} />

      <fieldset>
        <legend className="text-sm font-medium mb-3">Who are you?</legend>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { id: "operator" as const, label: "Bus / van operator", icon: BusFront, hint: "You hold a CPC" },
            { id: "hero_driver" as const, label: "Hero Driver", icon: Car, hint: "Private vehicle" },
          ].map((o) => (
            <button
              type="button"
              key={o.id}
              onClick={() => setType(o.id)}
              aria-pressed={type === o.id}
              className={cn(
                "flex items-start gap-3 rounded-xl border p-4 text-left transition-all",
                type === o.id
                  ? "border-[color:var(--accent)] bg-[color:var(--accent)]/8"
                  : "border-[color:var(--border-strong)] hover:border-[color:var(--accent)]/50",
              )}
            >
              <o.icon className="size-5 mt-0.5 text-[color:var(--accent)] flex-shrink-0" />
              <span>
                <span className="block font-medium tracking-tight">{o.label}</span>
                <span className="block text-xs text-[color:var(--muted)] mt-0.5">{o.hint}</span>
              </span>
            </button>
          ))}
        </div>
      </fieldset>

      {type === "hero_driver" ? (
        <p className="mt-4 rounded-xl border border-[color:var(--border-strong)] bg-[color:var(--surface-muted)] p-4 text-sm text-[color:var(--muted)] leading-relaxed">
          Straight with you: carpool isn&apos;t open yet. We&apos;re onboarding licensed operators
          first and getting the cost-sharing rules cleared properly before any private vehicle
          carries a paying passenger. This registers your interest — nothing more.
        </p>
      ) : null}

      <div className="mt-6 grid gap-4">
        <label className="block">
          <span className="text-sm font-medium">
            {type === "operator" ? "Company name" : "Your name"}
          </span>
          <input
            name="name"
            required
            maxLength={200}
            placeholder={type === "operator" ? "Victory Liner" : "Juan Cruz"}
            className={cn(fieldClass, "mt-1.5")}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Mobile or email</span>
          <input
            name="contact"
            required
            maxLength={255}
            placeholder="+63 917 000 0000"
            className={cn(fieldClass, "mt-1.5")}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Route you run</span>
          <input
            name="corridor"
            required
            maxLength={200}
            placeholder="Cubao ⇆ Baguio"
            className={cn(fieldClass, "mt-1.5")}
          />
        </label>

        {type === "operator" ? (
          <label className="block">
            <span className="text-sm font-medium">
              CPC number{" "}
              <span className="font-normal text-[color:var(--muted)]">(if you have it handy)</span>
            </span>
            <input name="cpcNumber" maxLength={100} className={cn(fieldClass, "mt-1.5")} />
          </label>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium">Vehicle</span>
              <select name="vehicleClass" defaultValue="sedan" className={cn(fieldClass, "mt-1.5")}>
                {vehicleClasses.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium">Seats you can offer</span>
              <input
                name="seats"
                type="number"
                min={1}
                max={60}
                defaultValue={3}
                className={cn(fieldClass, "mt-1.5")}
              />
            </label>
          </div>
        )}

        <label className="block">
          <span className="text-sm font-medium">
            Anything else{" "}
            <span className="font-normal text-[color:var(--muted)]">(optional)</span>
          </span>
          <textarea
            name="notes"
            rows={3}
            maxLength={2000}
            placeholder="Departure times you run, fleet size, anything we should know."
            className="mt-1.5 w-full px-4 py-3 rounded-xl border border-[color:var(--border-strong)] bg-[color:var(--background)] text-base outline-none focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent)]/20 transition-all resize-none"
          />
        </label>
      </div>

      {state.error ? (
        <p role="alert" className="mt-5 text-sm text-[color:var(--danger)]">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" size="xl" disabled={pending} className="mt-7 w-full">
        {pending ? "Sending…" : <>Send application <ArrowRight className="size-4" /></>}
      </Button>

      <p className="text-xs text-[color:var(--muted)] mt-4 leading-relaxed">
        No commission, no contracts, no quotas. We&apos;re pre-launch and we&apos;ll say so plainly
        rather than waste your time. See our{" "}
        <a
          href="/legal/privacy"
          className="underline decoration-[color:var(--accent)] underline-offset-2"
        >
          privacy notice
        </a>
        .
      </p>
    </form>
  );
}
