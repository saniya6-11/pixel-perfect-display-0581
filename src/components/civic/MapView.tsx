import { Suspense, lazy } from "react";
import { MapPinned } from "lucide-react";
import { ClientOnly } from "./ClientOnly";
import type { MapMarker, MapViewProps } from "./map-types";
import type { Report } from "@/types/civic";

const MapViewImpl = lazy(() => import("./MapViewImpl"));

function MapSkeleton() {
  return (
    <div className="grid h-full w-full place-items-center bg-muted">
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <MapPinned className="size-6 animate-pulse" aria-hidden />
        <p className="text-sm">Loading map…</p>
      </div>
    </div>
  );
}

export function MapView(props: MapViewProps) {
  return (
    <ClientOnly fallback={<MapSkeleton />}>
      <Suspense fallback={<MapSkeleton />}>
        <MapViewImpl {...props} />
      </Suspense>
    </ClientOnly>
  );
}

export function toMarkers(reports: Report[]): MapMarker[] {
  return reports
    .filter((r) => r.analysis !== null)
    .map((r) => ({
      id: r.id,
      lat: r.location.lat,
      lng: r.location.lng,
      address: r.location.address,
      title: r.title,
      severity: r.analysis!.severity,
      priority: r.analysis!.priorityScore,
    }));
}
