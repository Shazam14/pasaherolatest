"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Banknote, Smartphone, CreditCard, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const payments = [
  { id: "cash", label: "Cash on pickup", desc: "Pay at the terminal", icon: Banknote },
  { id: "gcash", label: "GCash", desc: "Pay now via GCash", icon: Smartphone },
  { id: "card", label: "Card", desc: "Visa / Mastercard", icon: CreditCard },
] as const;

export function BookingForm({ pax, kind = "bus" }: { pax: number; kind?: "bus" | "carpool" }) {
  const router = useRouter();
  const params = useSearchParams();
  const [pay, setPay] = React.useState<string>("cash");
  const [submitting, setSubmitting] = React.useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const data = new FormData(e.currentTarget);
    const next = new URLSearchParams(params);
    next.set("name", String(data.get("name")));
    next.set("phone", String(data.get("phone")));
    next.set("email", String(data.get("email") || ""));
    next.set("pay", pay);
    next.set("ref", makeReference());
    router.push(`/book?${next.toString()}`);
  };

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 md:p-8">
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-1">
        {kind === "carpool" ? "Reserve your carpool seat" : "Reserve your seat"}
      </h1>
      <p className="text-[color:var(--muted)] mb-7">
        {kind === "carpool"
          ? "We'll text you the driver's contact and pickup details once you confirm."
          : "We'll send your QR ticket and operator details to your phone."}
      </p>

      <fieldset className="space-y-4 mb-7">
        <legend className="text-xs uppercase tracking-[0.12em] text-[color:var(--muted)] mb-3">
          {pax === 1 ? "Passenger" : "Lead passenger"}
        </legend>
        <Field label="Full name" name="name" required placeholder="Maria Santos" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Mobile number" name="phone" required placeholder="+63 917 000 0000" type="tel" />
          <Field label="Email (optional)" name="email" placeholder="you@example.com" type="email" />
        </div>
      </fieldset>

      <fieldset className="space-y-3 mb-7">
        <legend className="text-xs uppercase tracking-[0.12em] text-[color:var(--muted)] mb-3">
          Payment method
        </legend>
        {payments.map(({ id, label, desc, icon: Icon }) => (
          <label
            key={id}
            className={cn(
              "flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-all",
              pay === id
                ? "border-[color:var(--accent)] bg-[color:var(--accent)]/5"
                : "border-[color:var(--border)] hover:border-[color:var(--border-strong)]"
            )}
          >
            <input
              type="radio"
              name="payment"
              value={id}
              checked={pay === id}
              onChange={() => setPay(id)}
              className="sr-only"
            />
            <div
              className={cn(
                "flex size-10 items-center justify-center rounded-lg",
                pay === id
                  ? "bg-[color:var(--accent)] text-[color:var(--accent-foreground)]"
                  : "bg-[color:var(--surface-muted)] text-[color:var(--muted)]"
              )}
            >
              <Icon className="size-4" />
            </div>
            <div className="flex-1">
              <p className="font-medium tracking-tight">{label}</p>
              <p className="text-xs text-[color:var(--muted)]">{desc}</p>
            </div>
            <span
              className={cn(
                "size-5 rounded-full border-2 flex items-center justify-center transition-colors",
                pay === id ? "border-[color:var(--accent)]" : "border-[color:var(--border-strong)]"
              )}
            >
              {pay === id ? <span className="size-2 rounded-full bg-[color:var(--accent)]" /> : null}
            </span>
          </label>
        ))}
      </fieldset>

      <Button type="submit" size="xl" disabled={submitting} className="w-full">
        {submitting ? "Reserving…" : <>Confirm reservation <ArrowRight className="size-4" /></>}
      </Button>
      <p className="text-xs text-[color:var(--muted)] mt-4 leading-relaxed">
        By reserving, you agree to our{" "}
        <a href="/legal/terms" className="underline decoration-[color:var(--accent)] underline-offset-2">
          terms
        </a>{" "}
        and{" "}
        <a href="/legal/privacy" className="underline decoration-[color:var(--accent)] underline-offset-2">
          privacy policy
        </a>
        . Free cancellation up to 6 hours before departure.
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

function makeReference() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "PH-";
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}
