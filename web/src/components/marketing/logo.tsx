import { cn } from "@/lib/utils";

export function Logo({ className, showWordmark = true }: { className?: string; showWordmark?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <linearGradient id="ph-mark" x1="2" y1="26" x2="26" y2="2" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="oklch(0.42 0.18 250)" />
            <stop offset="1" stopColor="oklch(0.7 0.18 35)" />
          </linearGradient>
        </defs>
        {/* horizon arc */}
        <path
          d="M2 18 C 6 10, 22 10, 26 18"
          stroke="url(#ph-mark)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* sun */}
        <circle cx="14" cy="18" r="3.2" fill="url(#ph-mark)" />
        {/* base line */}
        <path d="M2 22 H26" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      {showWordmark ? (
        <span className="font-semibold text-[1.05rem] tracking-tight">
          Pasahero{" "}<span className="text-[color:var(--accent)]">PH</span>
        </span>
      ) : null}
    </div>
  );
}
