export type CorridorStatus = "active" | "coming-soon";

export type LngLat = [number, number];

export type Corridor = {
  id: string;
  origin: string;
  destination: string;
  status: CorridorStatus;
  distanceKm: number;
  durationHours: number;
  heroCount: number;
  blurb: string;
  expectedLaunch?: string;
  /** lng/lat of origin city center, used to seed the map view. */
  originCoord?: LngLat;
  /** lng/lat of destination city center. */
  destinationCoord?: LngLat;
  /** simplified driving route geometry (lng/lat pairs) from OSRM. */
  routeGeometry?: LngLat[];
};

export const corridors: Corridor[] = [
  {
    id: "manila-baguio",
    origin: "Manila",
    destination: "Baguio",
    status: "active",
    distanceKm: 246,
    durationHours: 4.5,
    heroCount: 4,
    blurb: "Summer capital. Buses, vans, and Hero Drivers running daily.",
    originCoord: [120.9842, 14.5995],
    destinationCoord: [120.596, 16.4023],
    routeGeometry: [
      [120.984206, 14.599528],
      [121.000514, 14.693364],
      [120.935548, 14.814556],
      [120.841801, 14.876921],
      [120.598156, 15.197765],
      [120.576158, 15.198129],
      [120.567371, 15.233932],
      [120.65692, 15.369434],
      [120.678124, 15.48585],
      [120.634454, 15.56437],
      [120.613658, 15.671213],
      [120.641904, 15.783968],
      [120.622025, 15.878863],
      [120.467647, 16.318351],
      [120.495903, 16.335271],
      [120.500445, 16.376416],
      [120.557344, 16.374918],
      [120.59602, 16.402273],
    ],
  },
  {
    id: "manila-launion",
    origin: "Manila",
    destination: "La Union",
    status: "coming-soon",
    distanceKm: 273,
    durationHours: 5,
    heroCount: 0,
    blurb: "Surf, weekend escapes, San Juan beachfront — high carpool demand.",
    expectedLaunch: "Q3 2026",
  },
  {
    id: "manila-clark",
    origin: "Manila",
    destination: "Clark",
    status: "coming-soon",
    distanceKm: 86,
    durationHours: 1.75,
    heroCount: 0,
    blurb: "Clark / Angeles BPO commuters and weekend flyers from CRK.",
    expectedLaunch: "Q3 2026",
  },
  {
    id: "manila-subic",
    origin: "Manila",
    destination: "Subic",
    status: "coming-soon",
    distanceKm: 124,
    durationHours: 2.5,
    heroCount: 0,
    blurb: "Beach, duty free, and weekend family trips through SCTEX.",
    expectedLaunch: "Q4 2026",
  },
  {
    id: "manila-tagaytay",
    origin: "Manila",
    destination: "Tagaytay",
    status: "coming-soon",
    distanceKm: 60,
    durationHours: 1.5,
    heroCount: 0,
    blurb: "Short-haul weekend favorite — bulalo, tagaytay ridge, day trips.",
    expectedLaunch: "Q4 2026",
  },
  {
    id: "manila-naga",
    origin: "Manila",
    destination: "Naga",
    status: "coming-soon",
    distanceKm: 377,
    durationHours: 9,
    heroCount: 0,
    blurb: "Bicol gateway — long-haul corridor with strong diaspora demand.",
    expectedLaunch: "2027",
  },
  {
    id: "manila-batangas",
    origin: "Manila",
    destination: "Batangas",
    status: "coming-soon",
    distanceKm: 110,
    durationHours: 2.5,
    heroCount: 0,
    blurb: "Anilao diving, Boracay ferry connection, and Lipa weekend runs.",
    expectedLaunch: "Q4 2026",
  },
];

export const activeCorridors = corridors.filter((c) => c.status === "active");
export const comingSoonCorridors = corridors.filter((c) => c.status === "coming-soon");

export const originCities = Array.from(new Set(corridors.map((c) => c.origin)));
export const destinationCities = Array.from(new Set(corridors.map((c) => c.destination)));
export const allCities = Array.from(
  new Set(corridors.flatMap((c) => [c.origin, c.destination]))
);

export function findCorridor(from: string, to: string): Corridor | null {
  if (!from || !to || from === to) return null;
  return (
    corridors.find(
      (c) =>
        (c.origin === from && c.destination === to) ||
        (c.origin === to && c.destination === from)
    ) ?? null
  );
}

export function corridorById(id: string): Corridor | null {
  return corridors.find((c) => c.id === id) ?? null;
}
