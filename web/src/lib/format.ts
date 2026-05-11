export function php(amount: number) {
  return `₱${amount.toLocaleString("en-PH")}`;
}

export function timeOfDay(t: string): "early" | "morning" | "afternoon" | "evening" {
  const h = Number(t.slice(0, 2));
  if (h < 6) return "early";
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

export function durationBetween(dep: string, arr: string) {
  const [dh, dm] = dep.split(":").map(Number);
  const [ah, am] = arr.split(":").map(Number);
  const mins = (ah * 60 + am) - (dh * 60 + dm);
  const total = mins < 0 ? mins + 24 * 60 : mins;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export function readableDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-PH", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
