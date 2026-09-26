export type IssueCategory =
  | "road_damage"
  | "waste"
  | "water"
  | "lighting"
  | "safety"
  | "other";

export type Severity = "critical" | "high" | "medium" | "low";

export type IssueStatus = "new" | "under_review" | "assigned" | "resolved";

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface AnalysisFactor {
  label: string;
  value: string;
  weight: number; // 0-100
}

export interface AIAnalysis {
  category: IssueCategory;
  confidence: number; // 0-100
  severity: Severity;
  priorityScore: number; // 0-100
  detectedIssue: string;
  recommendedAction: string;
  duplicateCount: number;
  factors: AnalysisFactor[];
  analyzedAt: string;
}

export interface TimelineEntry {
  label: string;
  at: string | null;
  done: boolean;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  location: Location;
  status: IssueStatus;
  createdAt: string;
  reporter: string;
  analysis: AIAnalysis | null;
  timeline: TimelineEntry[];
}

export interface CreateReportInput {
  description: string;
  imageDataUrl: string | null;
  location: Location;
}

export interface AnalyticsInsight {
  id: string;
  title: string;
  detail: string;
  metric: string;
  tone: "accent" | "critical" | "warning" | "success";
}

export interface Analytics {
  totals: {
    totalReports: number;
    criticalIssues: number;
    resolved: number;
    aiProcessed: number;
  };
  deltas: {
    totalReports: number;
    criticalIssues: number;
    resolved: number;
    aiProcessed: number;
  };
  byCategory: { name: string; value: number }[];
  bySeverity: { name: string; value: number; key: Severity }[];
  overTime: { date: string; reports: number; resolved: number }[];
  byStatus: { name: string; value: number }[];
  resolutionRate: number;
  avgResolutionDays: number;
  insights: AnalyticsInsight[];
}

export const CATEGORY_LABELS: Record<IssueCategory, string> = {
  road_damage: "Road Damage",
  waste: "Waste",
  water: "Water",
  lighting: "Lighting",
  safety: "Safety",
  other: "Other",
};

export const STATUS_LABELS: Record<IssueStatus, string> = {
  new: "New",
  under_review: "Under Review",
  assigned: "Assigned",
  resolved: "Resolved",
};

export const SEVERITY_LABELS: Record<Severity, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};
