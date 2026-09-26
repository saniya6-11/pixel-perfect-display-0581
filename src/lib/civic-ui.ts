import type { IssueCategory, IssueStatus, Severity } from "@/types/civic";

export const severityStyles: Record<Severity, string> = {
  critical: "bg-critical-soft text-critical border-critical/25",
  high: "bg-high-soft text-high border-high/25",
  medium: "bg-warning-soft text-warning-foreground border-warning/30",
  low: "bg-success-soft text-success border-success/25",
};

export const severityMarkerColor: Record<Severity, string> = {
  critical: "var(--critical)",
  high: "var(--high)",
  medium: "var(--warning)",
  low: "var(--success)",
};

export const statusStyles: Record<IssueStatus, string> = {
  new: "bg-accent-soft text-accent-foreground border-accent/30",
  under_review: "bg-warning-soft text-warning-foreground border-warning/30",
  assigned: "bg-primary-soft text-primary border-primary/20",
  resolved: "bg-success-soft text-success border-success/25",
};

export const categoryFilters: { key: IssueCategory | "all" | "critical"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "critical", label: "Critical" },
  { key: "road_damage", label: "Roads" },
  { key: "waste", label: "Waste" },
  { key: "water", label: "Water" },
  { key: "lighting", label: "Lighting" },
  { key: "safety", label: "Safety" },
];

export function priorityTone(score: number): Severity {
  if (score >= 85) return "critical";
  if (score >= 70) return "high";
  if (score >= 50) return "medium";
  return "low";
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function relativeDays(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}
