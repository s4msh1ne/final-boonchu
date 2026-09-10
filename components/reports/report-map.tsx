"use client";

import { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import type { Map as MapLibreMap, MapMouseEvent, Marker } from "maplibre-gl";
import { IconCurrentLocation, IconMapPin } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

const defaultLocation = { latitude: 14.4745, longitude: 100.1177 };

export function ReportMap({
  latitude,
  longitude,
  onChange,
  interactive = true,
}: {
  latitude?: number | null;
  longitude?: number | null;
  onChange?: (location: { latitude: number; longitude: number }) => void;
  interactive?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const center: [number, number] = [longitude ?? defaultLocation.longitude, latitude ?? defaultLocation.latitude];
    const map = new maplibregl.Map({
      container: containerRef.current,
      center,
      zoom: latitude != null ? 15 : 11,
      style: {
        version: 8,
        sources: { osm: { type: "raster", tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"], tileSize: 256, attribution: "© OpenStreetMap contributors" } },
        layers: [{ id: "osm", type: "raster", source: "osm" }],
      },
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    if (latitude != null && longitude != null) markerRef.current = new maplibregl.Marker({ color: "#087f8c" }).setLngLat(center).addTo(map);
    if (interactive) {
      map.on("click", (event: MapMouseEvent) => {
        const next = { latitude: Number(event.lngLat.lat.toFixed(6)), longitude: Number(event.lngLat.lng.toFixed(6)) };
        markerRef.current?.remove();
        markerRef.current = new maplibregl.Marker({ color: "#087f8c" }).setLngLat([next.longitude, next.latitude]).addTo(map);
        onChange?.(next);
      });
    }
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, [interactive, latitude, longitude, onChange]);

  const useCurrentLocation = () => {
    if (!navigator.geolocation) return setMessage("อุปกรณ์นี้ไม่รองรับการระบุตำแหน่ง");
    setMessage("กำลังค้นหาตำแหน่ง...");
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const next = { latitude: Number(coords.latitude.toFixed(6)), longitude: Number(coords.longitude.toFixed(6)) };
      markerRef.current?.remove();
      markerRef.current = new maplibregl.Marker({ color: "#087f8c" }).setLngLat([next.longitude, next.latitude]).addTo(mapRef.current!);
      mapRef.current?.flyTo({ center: [next.longitude, next.latitude], zoom: 16 });
      onChange?.(next);
      setMessage("ระบุตำแหน่งปัจจุบันแล้ว");
    }, () => setMessage("ไม่สามารถเข้าถึงตำแหน่งปัจจุบันได้ กรุณาเลือกตำแหน่งบนแผนที่ด้วยตนเอง"), { enableHighAccuracy: true, timeout: 10000 });
  };

  return <div className="space-y-3">{interactive && <div className="flex flex-wrap items-center gap-2"><Button type="button" variant="outline" className="h-10" onClick={useCurrentLocation}><IconCurrentLocation /> ใช้ตำแหน่งปัจจุบัน</Button><span className="text-xs text-muted-foreground"><IconMapPin className="mr-1 inline size-4" />หรือแตะบนแผนที่เพื่อปักหมุด</span></div>}<div ref={containerRef} className="h-72 overflow-hidden rounded-2xl border bg-muted sm:h-80" aria-label="แผนที่ตำแหน่งปัญหา" />{message && <p className="text-sm text-muted-foreground">{message}</p>}</div>;
}
