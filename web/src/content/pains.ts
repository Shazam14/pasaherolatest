export const pains = [
  { id: "too_expensive", label: "Too expensive" },
  { id: "no_late_night", label: "No late-night option" },
  { id: "no_early_morning", label: "No early-morning option" },
  { id: "unsafe_pickup", label: "Unsafe pickup / dropoff" },
  { id: "no_direct", label: "No direct route, too many transfers" },
  { id: "other", label: "Something else" },
] as const;

export function painLabel(id: string): string {
  return pains.find((p) => p.id === id)?.label ?? "Something else";
}
