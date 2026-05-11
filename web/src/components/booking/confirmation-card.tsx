import { CheckCircle2, MessageSquare, Calendar, MapPin } from "lucide-react";
import { php, readableDate } from "@/lib/format";

const paymentLabels: Record<string, string> = {
  cash: "Cash on pickup",
  gcash: "GCash",
  card: "Card",
};

export function ConfirmationCard({
  reference,
  passengerName,
  phone,
  email,
  payment,
  operator,
  date,
  departure,
  total,
  kind = "bus",
}: {
  reference: string;
  passengerName: string;
  phone: string;
  email: string;
  payment: string;
  operator: string;
  date: string;
  departure: string;
  total: number;
  kind?: "bus" | "carpool";
}) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 md:p-8">
      <div className="flex items-center gap-3 mb-2">
        <span className="flex size-10 items-center justify-center rounded-full bg-[color:var(--success)]/15 text-[color:var(--success)]">
          <CheckCircle2 className="size-5" />
        </span>
        <span className="text-xs uppercase tracking-[0.12em] text-[color:var(--success)] font-medium">
          Reserved
        </span>
      </div>
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
        You&apos;re booked, {passengerName.split(" ")[0]}.
      </h1>
      <p className="text-[color:var(--muted)] mt-2">
        {kind === "carpool"
          ? `${operator} will be in touch shortly with the pickup point and ETA.`
          : `Show your reference at the ${operator} terminal counter — they'll have your seat ready.`}
      </p>

      <div className="mt-6 rounded-xl border border-dashed border-[color:var(--accent)] bg-[color:var(--accent)]/5 p-5 flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.12em] text-[color:var(--muted)]">Reference</p>
          <p className="text-2xl md:text-3xl font-mono tnum tracking-tight mt-1">{reference}</p>
        </div>
        <QrCodePlaceholder reference={reference} />
      </div>

      <dl className="mt-6 space-y-3 text-sm">
        <Row label={kind === "carpool" ? "Driver" : "Operator"}>{operator}</Row>
        <Row label="Departure">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="size-3.5 text-[color:var(--muted)]" />
            {readableDate(date)} · {departure}
          </span>
        </Row>
        <Row label="Passenger">{passengerName}</Row>
        <Row label="Contact">
          <span className="inline-flex items-center gap-1.5">
            <MessageSquare className="size-3.5 text-[color:var(--muted)]" />
            {phone}
            {email ? ` · ${email}` : ""}
          </span>
        </Row>
        <Row label="Payment">{paymentLabels[payment] ?? payment}</Row>
        <Row label="Total">
          <span className="tnum font-semibold">{php(total)}</span>
        </Row>
      </dl>

      <div className="mt-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-muted)] p-4 flex items-start gap-3">
        <MapPin className="size-4 text-[color:var(--accent)] mt-0.5 flex-shrink-0" />
        <p className="text-sm text-[color:var(--muted)] leading-relaxed">
          We&apos;ll text your QR ticket and terminal directions to <span className="text-[color:var(--foreground)] font-medium">{phone}</span> shortly.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href="/"
          className="inline-flex items-center justify-center rounded-full border border-[color:var(--border-strong)] px-5 h-11 text-sm font-medium hover:bg-[color:var(--surface-muted)] transition-colors"
        >
          Back to home
        </a>
        <a
          href="/search?corridor=manila-baguio"
          className="inline-flex items-center justify-center rounded-full bg-[color:var(--primary)] text-[color:var(--primary-foreground)] px-5 h-11 text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Book another trip
        </a>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-[color:var(--muted)] flex-shrink-0">{label}</dt>
      <dd className="font-medium text-right">{children}</dd>
    </div>
  );
}

function QrCodePlaceholder({ reference }: { reference: string }) {
  // Visual stand-in until we wire a real QR library (qrcode.react or similar) in v2.
  // Generates a deterministic 7×7 dot pattern from the reference characters.
  const grid: boolean[][] = Array.from({ length: 7 }, (_, r) =>
    Array.from({ length: 7 }, (_, c) => {
      const ch = reference.charCodeAt((r * 7 + c) % reference.length);
      return (ch + r * 3 + c * 5) % 3 !== 0;
    })
  );
  // Force corner anchors so it reads as a QR-like mark.
  [
    [0, 0], [0, 6], [6, 0],
  ].forEach(([r, c]) => {
    grid[r][c] = true;
    grid[r][c + 1 < 7 ? c + 1 : c - 1] = true;
    grid[r + 1 < 7 ? r + 1 : r - 1][c] = true;
  });

  return (
    <div className="size-24 rounded-lg bg-[color:var(--surface)] border border-[color:var(--border)] p-2 grid grid-cols-7 gap-[2px]">
      {grid.flat().map((on, i) => (
        <span
          key={i}
          className={on ? "bg-[color:var(--foreground)] rounded-[1px]" : "bg-transparent"}
        />
      ))}
    </div>
  );
}
