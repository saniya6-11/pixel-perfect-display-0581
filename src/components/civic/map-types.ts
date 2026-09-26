import type { Severity } from "@/types/civic";

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  severity: Severity;
  title: string;
  address: string;
  priority: number;
}

export interface MapViewProps {
  markers?: MapMarker[];
  center?: [number, number];
  zoom?: number;
  onMarkerClick?: (id: string) => void;
  onPick?: (lat: number, lng: number) => void;
  className?: string;
}
