import { CircleMarker, MapContainer, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { useEffect } from "react";
import type { MapMarker, MapViewProps } from "./map-types";
import { severityMarkerColor } from "@/lib/civic-ui";

function Recenter({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center[0], center[1], zoom]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

function ClickCapture({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function markerRadius(marker: MapMarker) {
  return marker.severity === "critical" ? 12 : marker.severity === "high" ? 10 : 8;
}

export default function MapViewImpl({
  markers = [],
  center = [12.9716, 77.5946],
  zoom = 13,
  onMarkerClick,
  onPick,
  className,
}: MapViewProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom
      className={className ?? "h-full w-full"}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Recenter center={center} zoom={zoom} />
      {onPick ? <ClickCapture onPick={onPick} /> : null}
      {markers.map((marker) => {
        const color = severityMarkerColor[marker.severity];
        return (
          <CircleMarker
            key={marker.id}
            center={[marker.lat, marker.lng]}
            radius={markerRadius(marker)}
            pathOptions={{
              color,
              fillColor: color,
              fillOpacity: 0.72,
              weight: 2,
              opacity: 0.95,
            }}
            eventHandlers={{ click: () => onMarkerClick?.(marker.id) }}
          >
            <Popup>
              <div style={{ minWidth: 190 }}>
                <p style={{ margin: 0, fontSize: 11, opacity: 0.6 }}>{marker.id}</p>
                <p style={{ margin: "2px 0 4px", fontWeight: 700, fontSize: 13 }}>{marker.title}</p>
                <p style={{ margin: 0, fontSize: 12, opacity: 0.7 }}>{marker.address}</p>
                <p style={{ margin: "6px 0 0", fontSize: 12, fontWeight: 600, color }}>
                  {marker.severity.toUpperCase()} · Priority {marker.priority}
                </p>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
