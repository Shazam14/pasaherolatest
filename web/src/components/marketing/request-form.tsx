"use client";

import * as React from "react";
import { ArrowRight, Check, MapPinned } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { submitRouteRequest } from "@/lib/listening-actions";
import { initialActionState } from "@/lib/listening-state";

const pains = [
  { id: "too_expensive", label: "Too expensive" },
  { id: "no_late_night", label: "No late-night option" },
  { id: "no_early_morning", label: "No early-morning option" },
  { id: "unsafe_pickup", label: "Unsafe pickup / dropoff" },
  { id: "no_direct", label: "No direct route, too many transfers" },
  { id: "other", label: "Something else" },
] as const;

export function RequestForm() {
  const [pain, setPain] = React.useState<string>("too_expensive");
  const [state, formAction, pending] = React.useActionState(
    submitRouteRequest,
    initialActionState,
  );
  const [dismissed, setDismissed] = React.useState(false);

  React.useEffect(() => {
    if (state.ok) setDismissed(false);
  }, [state]);

  const showSuccess = state.ok && !dismissed;

  if (showSuccess) {
    return (
      <div className="rounded-2xl border border-[color:var(--success)]/30 bg-[color:var(--success)]/10 p-8">
        <span className="flex size-12 items-center justify-center rounded-full bg-[color:var(--success)]/20 text-[color:var(--success)]">
          <Check className="size-6" />
        </span>
        <h2 className="text-2xl font-semibold tracking-tight mt-5">
          Got it — your route is in.
        </h2>
        <p className="text-[color:var(--muted)] mt-2 leading-relaxed max-w-md">
          We read every request. When a corridor crosses our threshold for verified Hero
          Drivers + operator interest, we open it. We&apos;ll email you the moment yours goes
          live.
        </p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="mt-6 text-sm font-medium text-[color:var(--accent)] underline-offset-4 hover:underline"
        >
          Submit another route
        </button>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 md:p-8"
    >
      <div className="flex items-center gap-2 text-[color:var(--accent)]">
        <MapPinned className="size-4" />
        <span className="text-xs uppercase tracking-[0.12em] font-medium">
          Tell us your route
        </span>
      </div>
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mt-3">
        The route you wish existed.
      </h1>
      <p className="text-[color:var(--muted)] mt-2 leading-relaxed">
        We open corridors where commuters tell us the current options are broken. Be
        specific — the details are what move it up the queue.
      </p>

      <fieldset className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="From"
          name="origin"
          required
          placeholder="Bacoor, Cavite"
        />
        <Field
          label="To"
          name="destination"
          required
          placeholder="Ortigas"
        />
      </fieldset>

      <fieldset className="mt-6">
        <legend className="text-[0.7rem] uppercase tracking-[0.08em] text-[color:var(--muted)] mb-3">
          What&apos;s broken about the current options?
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {pains.map((p) => (
            <label
              key={p.id}
              className={cn(
                "rounded-xl border px-4 py-3 text-sm cursor-pointer transition-all",
                pain === p.id
                  ? "border-[color:var(--accent)] bg-[color:var(--accent)]/5 text-[color:var(--foreground)]"
                  : "border-[color:var(--border)] hover:border-[color:var(--border-strong)] text-[color:var(--muted)]"
              )}
            >
              <input
                type="radio"
                name="pain"
                value={p.id}
                checked={pain === p.id}
                onChange={() => setPain(p.id)}
                className="sr-only"
              />
              {p.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-6">
        <label className="block">
          <span className="text-[0.7rem] uppercase tracking-[0.08em] text-[color:var(--muted)] block mb-1.5">
            Tell us more (optional but really helpful)
          </span>
          <textarea
            name="details"
            rows={3}
            placeholder="Last bus leaves at 8pm and I work till 11pm…"
            className="w-full px-4 py-3 rounded-xl border border-[color:var(--border-strong)] bg-[color:var(--background)] text-base outline-none focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent)]/20 transition-all resize-none"
          />
        </label>
      </fieldset>

      <fieldset className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="How often would you take it?"
          name="frequency"
          placeholder="2x a week"
        />
        <Field
          label="Email or mobile"
          name="contact"
          required
          placeholder="you@email.com or +63 917…"
        />
      </fieldset>

      {state.error ? (
        <p
          role="alert"
          className="mt-5 text-sm text-[color:var(--danger)]"
        >
          {state.error}
        </p>
      ) : null}

      <Button type="submit" size="xl" disabled={pending} className="mt-7 w-full">
        {pending ? "Sending…" : <>Send my route <ArrowRight className="size-4" /></>}
      </Button>
      <p className="text-xs text-[color:var(--muted)] mt-4 leading-relaxed">
        Closed beta — we read every request personally. No spam, no marketing. We only
        contact you when your corridor moves forward.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  ...rest
}: { label: string; name: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-[0.7rem] uppercase tracking-[0.08em] text-[color:var(--muted)] block mb-1.5">
        {label}
      </span>
      <input
        name={name}
        className="w-full h-12 px-4 rounded-xl border border-[color:var(--border-strong)] bg-[color:var(--background)] text-base font-medium tracking-tight outline-none focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent)]/20 transition-all"
        {...rest}
      />
    </label>
  );
}
