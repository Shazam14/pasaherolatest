export const corridor = {
  slug: "manila-baguio",
  origin: { city: "Manila", region: "NCR", code: "MNL" },
  destination: { city: "Baguio", region: "CAR", code: "BAG" },
  distanceKm: 246,
  travelTimeHours: 4.5,
  vehicleTypes: ["Bus", "UV Express", "Premium Van", "Carpool"] as const,
};

export const seedOperators = [
  { id: "victory", name: "Victory Liner", type: "Bus", terminal: "Pasay / Cubao" },
  { id: "genesis", name: "Genesis Bus", type: "Bus", terminal: "Pasay / Cubao" },
  { id: "joybus", name: "Joybus Premiere", type: "Premium Bus", terminal: "Cubao" },
  { id: "solidnorth", name: "Solid North", type: "Bus", terminal: "Cubao" },
  { id: "uv-express", name: "Verified UV Express Lines", type: "UV Express", terminal: "Various" },
];

// Hero Drivers — peer-to-peer carpool. They're already driving Manila → Baguio
// and listing their empty seats to recover fuel cost. Not commercial drivers.
export const seedCarpoolDrivers = [
  {
    id: "juan-cruz",
    name: "Juan Cruz",
    initials: "JC",
    car: "Toyota Vios",
    color: "Silver",
    plate: "ABC 1234",
    rating: 4.8,
    trips: 47,
    pickup: "Trinoma north entrance",
    verified: true,
  },
  {
    id: "maria-reyes",
    name: "Maria Reyes",
    initials: "MR",
    car: "Honda Civic",
    color: "Gray",
    plate: "DEF 5678",
    rating: 4.9,
    trips: 112,
    pickup: "Petron Balintawak",
    verified: true,
  },
  {
    id: "kenneth-tan",
    name: "Kenneth Tan",
    initials: "KT",
    car: "Mitsubishi Mirage",
    color: "White",
    plate: "GHI 9012",
    rating: 4.7,
    trips: 28,
    pickup: "SM North EDSA",
    verified: true,
  },
  {
    id: "anna-garcia",
    name: "Anna Garcia",
    initials: "AG",
    car: "Toyota Innova",
    color: "Black",
    plate: "JKL 3456",
    rating: 5.0,
    trips: 89,
    pickup: "Robinsons Magnolia",
    verified: true,
  },
];

export type ListingKind = "bus" | "carpool";

type BusListing = {
  kind: "bus";
  corridorId: string;
  operator: string;
  departure: string;
  arrival: string;
  price: number;
  vehicle: string;
};

type CarpoolListing = {
  kind: "carpool";
  corridorId: string;
  driver: string;
  departure: string;
  arrival: string;
  price: number;
  seatsAvailable: number;
};

export const seedSchedules: BusListing[] = [
  { kind: "bus", corridorId: "manila-baguio", operator: "victory", departure: "04:30", arrival: "09:00", price: 760, vehicle: "Premium" },
  { kind: "bus", corridorId: "manila-baguio", operator: "genesis", departure: "06:00", arrival: "10:30", price: 760, vehicle: "Regular" },
  { kind: "bus", corridorId: "manila-baguio", operator: "joybus", departure: "07:30", arrival: "11:30", price: 950, vehicle: "Joybus Premiere" },
  { kind: "bus", corridorId: "manila-baguio", operator: "victory", departure: "09:00", arrival: "13:30", price: 760, vehicle: "Regular" },
  { kind: "bus", corridorId: "manila-baguio", operator: "solidnorth", departure: "11:00", arrival: "15:30", price: 720, vehicle: "Regular" },
  { kind: "bus", corridorId: "manila-baguio", operator: "joybus", departure: "13:00", arrival: "17:00", price: 950, vehicle: "Joybus Premiere" },
];

// Every price here must sit at or below the cost-share cap, because seed listings
// set the norm for what a real listing looks like. See CARPOOL-COST-SHARE.md.
//
//   tripCost = 246km / kmPerLitre x fuelPrice + 600 tolls
//   cap      = floor(tripCost / (seatsAvailable + 1))
//
// The +1 is the driver paying their own share, so no listing can profit. Figures
// below are illustrative pending real fuel and toll data.
//
//   Vios    15km/L @62  trip 1617  4 shares  cap 404
//   Civic   14km/L @62  trip 1689  4 shares  cap 422
//   Mirage  19km/L @62  trip 1403  3 shares  cap 467
//   Innova  12km/L @58  trip 1789  6 shares  cap 298
export const seedCarpools: CarpoolListing[] = [
  { kind: "carpool", corridorId: "manila-baguio", driver: "juan-cruz", departure: "05:00", arrival: "09:30", price: 400, seatsAvailable: 3 },
  { kind: "carpool", corridorId: "manila-baguio", driver: "maria-reyes", departure: "06:30", arrival: "11:00", price: 420, seatsAvailable: 3 },
  { kind: "carpool", corridorId: "manila-baguio", driver: "kenneth-tan", departure: "08:00", arrival: "12:30", price: 400, seatsAvailable: 2 },
  { kind: "carpool", corridorId: "manila-baguio", driver: "anna-garcia", departure: "14:00", arrival: "18:30", price: 295, seatsAvailable: 5 },
];

export type AnyListing = BusListing | CarpoolListing;

export const allListings: AnyListing[] = [...seedSchedules, ...seedCarpools];

export function listingsForCorridor(corridorId: string): AnyListing[] {
  return allListings.filter((l) => l.corridorId === corridorId);
}

export function listingId(l: AnyListing): string {
  const key = l.kind === "bus" ? l.operator : l.driver;
  return `${l.kind}-${key}-${l.departure.replace(":", "")}`;
}

export function listingById(id: string): AnyListing | null {
  return allListings.find((l) => listingId(l) === id) ?? null;
}

export function amenitiesFor(l: AnyListing): string[] {
  if (l.kind === "carpool") {
    return ["Air conditioning", "USB charging", "Music on request", "1 bag per passenger"];
  }
  const v = l.vehicle.toLowerCase();
  if (v.includes("joybus") || v.includes("premium")) {
    return [
      "Reclining seats",
      "Onboard restroom",
      "Wi-Fi",
      "USB charging",
      "Free water",
      "Movie / audio",
    ];
  }
  return ["Air conditioning", "Reclining seats", "USB charging", "Overhead storage"];
}

export type Stop = { label: string; time: string; note?: string };

export function stopsFor(l: AnyListing, origin: string, destination: string): Stop[] {
  if (l.kind === "carpool") {
    const driver = seedCarpoolDrivers.find((d) => d.id === l.driver);
    return [
      { label: driver?.pickup ?? origin, time: l.departure, note: "Pickup point" },
      { label: `${destination} drop-off`, time: l.arrival, note: "Arrange with driver" },
    ];
  }
  const op = seedOperators.find((o) => o.id === l.operator);
  return [
    { label: op?.terminal ?? origin, time: l.departure, note: "Terminal boarding" },
    { label: `${destination} terminal`, time: l.arrival, note: "Arrival" },
  ];
}
