export type RequestStatus = "queued" | "researching" | "launching";

export type RouteRequest = {
  id: string;
  origin: string;
  destination: string;
  pain: string;
  requestedBy: string;
  postedAgo: string;
  votes: number;
  status: RequestStatus;
};

export const seedRequests: RouteRequest[] = [
  {
    id: "req-cubao-banaue",
    origin: "Cubao",
    destination: "Banaue",
    pain: "Only Ohayami runs this — one bus a day, fully booked by 6pm. Need a backup option for tourists missing the cutoff.",
    requestedBy: "Anna · Pasig",
    postedAgo: "3 days ago",
    votes: 42,
    status: "researching",
  },
  {
    id: "req-cavite-makati",
    origin: "Imus, Cavite",
    destination: "Makati CBD",
    pain: "P2P bus stops at 9pm. Night-shift BPO workers stranded. Grab is ₱700+ one way and surge constantly.",
    requestedBy: "Mark · Imus",
    postedAgo: "1 week ago",
    votes: 87,
    status: "researching",
  },
  {
    id: "req-malolos-cubao",
    origin: "Malolos, Bulacan",
    destination: "Cubao",
    pain: "Buses leave the terminal half-empty but won't pick up along EDSA-North. Riders walk 2km from McArthur Hwy in the rain.",
    requestedBy: "Lourdes · Malolos",
    postedAgo: "2 weeks ago",
    votes: 31,
    status: "queued",
  },
  {
    id: "req-tanay-pasig",
    origin: "Tanay, Rizal",
    destination: "Pasig",
    pain: "Jeepneys stop at 8pm. Last UV Express by 9pm. Carpool would change my life — I work hospital shifts.",
    requestedBy: "Joy · Tanay",
    postedAgo: "5 days ago",
    votes: 64,
    status: "researching",
  },
  {
    id: "req-baler-cubao",
    origin: "Baler, Aurora",
    destination: "Cubao",
    pain: "Genesis is the only operator. ₱750 weekend surge, ₱550 weekday. No mid-tier option for surfers on budget.",
    requestedBy: "Kim · Baler",
    postedAgo: "1 week ago",
    votes: 38,
    status: "queued",
  },
  {
    id: "req-cebu-bantayan",
    origin: "Cebu City",
    destination: "Bantayan Island",
    pain: "Have to chain 3-hour bus + ferry + tricycle. Nobody packages this. Tourists give up.",
    requestedBy: "Rico · Cebu",
    postedAgo: "4 days ago",
    votes: 29,
    status: "queued",
  },
  {
    id: "req-bacoor-ortigas",
    origin: "Bacoor, Cavite",
    destination: "Ortigas",
    pain: "Bus options dump you at Cubao or Ayala. Nothing direct to Ortigas. 1.5hr commute becomes 3hr with transfers.",
    requestedBy: "Hero Driver applicant",
    postedAgo: "2 days ago",
    votes: 53,
    status: "launching",
  },
  {
    id: "req-tagaytay-alabang",
    origin: "Tagaytay",
    destination: "Alabang",
    pain: "Weekend warriors need a way home Sunday night without driving exhausted. Bus to Coastal then taxi is ₱500+.",
    requestedBy: "Carlo · Tagaytay",
    postedAgo: "6 days ago",
    votes: 21,
    status: "queued",
  },
];

export function topRequests(limit = 6): RouteRequest[] {
  return [...seedRequests].sort((a, b) => b.votes - a.votes).slice(0, limit);
}

export function statusLabel(s: RequestStatus): string {
  if (s === "launching") return "Launching soon";
  if (s === "researching") return "Researching";
  return "Queued";
}
