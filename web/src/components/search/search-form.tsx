"use client";

import * as React from "react";
import { ArrowRight, Calendar, MapPin, Users, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { allCities, corridors, findCorridor } from "@/content/corridors";

function destinationsFor(origin: string) {
  return corridors
    .filter((c) => c.origin === origin || c.destination === origin)
    .map((c) => {
      const city = c.origin === origin ? c.destination : c.origin;
      return { city, status: c.status };
    });
}

export function SearchForm() {
  const [from, setFrom] = React.useState<string>("Manila");
  const [to, setTo] = React.useState<string>("Baguio");
  const [date, setDate] = React.useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  });
  const [pax, setPax] = React.useState(1);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const possibleDestinations = React.useMemo(() => destinationsFor(from), [from]);

  React.useEffect(() => {
    if (!possibleDestinations.some((d) => d.city === to)) {
      const firstActive = possibleDestinations.find((d) => d.status === "active");
      setTo((firstActive ?? possibleDestinations[0])?.city ?? to);
    }
  }, [from, possibleDestinations, to]);

  const corridor = findCorridor(from, to);
  const isComingSoon = corridor?.status === "coming-soon";

  return (
    <form
      action="/search"
      method="GET"
      className="rounded-2xl border border-[color:var(--border-strong)] bg-[color:var(--surface)] shadow-[0_24px_64px_-32px_oklch(0.16_0.05_250/0.4)]"
    >
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_1fr_auto] gap-1 p-2">
        <Field icon={<MapPin className="size-4" />} label="From">
          <select
            name="from"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full bg-transparent text-base font-medium tracking-tight outline-none"
          >
            {allCities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>

        <button
          type="button"
          onClick={swap}
          aria-label="Swap origin and destination"
          className="hidden md:flex items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] hover:bg-[color:var(--surface-muted)] size-10 self-center mx-1 transition-colors"
        >
          <ArrowLeftRight className="size-4" />
        </button>

        <Field icon={<MapPin className="size-4" />} label="To">
          <select
            name="to"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full bg-transparent text-base font-medium tracking-tight outline-none"
          >
            {possibleDestinations.map(({ city, status }) => (
              <option key={city} value={city}>
                {city}
                {status === "coming-soon" ? " (soon)" : ""}
              </option>
            ))}
          </select>
        </Field>

        <div className="grid grid-cols-2 gap-1">
          <Field icon={<Calendar className="size-4" />} label="Date">
            <input
              name="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-transparent text-base font-medium tracking-tight outline-none"
            />
          </Field>
          <Field icon={<Users className="size-4" />} label="Passengers">
            <select
              name="pax"
              value={pax}
              onChange={(e) => setPax(Number(e.target.value))}
              className="w-full bg-transparent text-base font-medium tracking-tight outline-none"
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "passenger" : "passengers"}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Button type="submit" size="lg" className="md:rounded-xl md:h-auto md:self-stretch md:px-8">
          {isComingSoon ? "Join waitlist" : "Search trips"} <ArrowRight className="size-4" />
        </Button>
      </div>
      {isComingSoon && (
        <p className="text-xs text-[color:var(--muted)] px-4 pb-3 -mt-1">
          {corridor?.origin} ⇆ {corridor?.destination} isn&apos;t live yet — search will take you to the waitlist.
        </p>
      )}
    </form>
  );
}

function Field({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label
      className={cn(
        "group flex flex-col gap-1 rounded-xl px-4 py-3 transition-colors",
        "hover:bg-[color:var(--surface-muted)] focus-within:bg-[color:var(--surface-muted)]"
      )}
    >
      <span className="flex items-center gap-1.5 text-[0.7rem] uppercase tracking-[0.08em] text-[color:var(--muted)]">
        {icon}
        {label}
      </span>
      {children}
    </label>
  );
}
