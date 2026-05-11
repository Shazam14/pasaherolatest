"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapPin } from "lucide-react";
import type { LngLat } from "@/content/corridors";

export function RouteMap({
  origin,
  destination,
  originCoord,
  destinationCoord,
  routeGeometry,
  distanceKm,
  durationLabel,
}: {
  origin: string;
  destination: string;
  originCoord: LngLat;
  destinationCoord: LngLat;
  routeGeometry: LngLat[];
  distanceKm: number;
  durationLabel: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "https://tiles.openfreemap.org/styles/positron",
      attributionControl: { compact: true },
      cooperativeGestures: true,
      bounds: bboxOf(routeGeometry),
      fitBoundsOptions: { padding: 48, duration: 0 },
    });

    map.on("load", () => {
      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: routeGeometry,
          },
        },
      });

      map.addLayer({
        id: "route-glow",
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#f97316",
          "line-width": 10,
          "line-opacity": 0.18,
          "line-blur": 4,
        },
      });

      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#ea580c",
          "line-width": 4,
        },
      });

      new maplibregl.Marker({ color: "#1e3a8a" })
        .setLngLat(originCoord)
        .addTo(map);
      new maplibregl.Marker({ color: "#ea580c" })
        .setLngLat(destinationCoord)
        .addTo(map);
    });

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [originCoord, destinationCoord, routeGeometry]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)]">
      <div
        ref={containerRef}
        className="h-[280px] md:h-[340px] w-full"
        aria-label={`Route map: ${origin} to ${destination}`}
      />
      <div className="pointer-events-none absolute top-3 left-3 right-3 flex items-start justify-between gap-3">
        <span className="rounded-full bg-[color:var(--surface)]/95 backdrop-blur px-3 py-1 text-xs font-medium border border-[color:var(--border)] inline-flex items-center gap-1.5 shadow-sm">
          <MapPin className="size-3 text-[color:var(--accent)]" />
          {origin} → {destination}
        </span>
        <span className="rounded-full bg-[color:var(--surface)]/95 backdrop-blur px-3 py-1 text-xs font-medium border border-[color:var(--border)] tnum shadow-sm">
          {distanceKm} km · {durationLabel}
        </span>
      </div>
    </div>
  );
}

function bboxOf(coords: LngLat[]): [[number, number], [number, number]] {
  let minLng = coords[0][0];
  let maxLng = coords[0][0];
  let minLat = coords[0][1];
  let maxLat = coords[0][1];
  for (const [lng, lat] of coords) {
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
  }
  return [
    [minLng, minLat],
    [maxLng, maxLat],
  ];
}
