import type {
  AIAnalysis,
  Analytics,
  CreateReportInput,
  IssueCategory,
  IssueStatus,
  Report,
  Severity,
} from "@/types/civic";

/** API root can be overridden for hosted deployments with VITE_API_URL. */
export const API_URL = (import.meta.env["VITE_API_URL"] || "http://localhost:8000").replace(
  /\/$/,
  "",
);

type BackendCategory =
  "ROAD_DAMAGE" | "GARBAGE" | "STREETLIGHT" | "WATER_LEAK" | "PUBLIC_SAFETY" | "OTHER";
type BackendSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
type BackendStatus = "NEW" | "UNDER_REVIEW" | "ASSIGNED" | "IN_PROGRESS" | "RESOLVED";

interface BackendReport {
  id: number;
  title: string;
  description: string;
  category: BackendCategory;
  severity: BackendSeverity;
  priority_score: number;
  status: BackendStatus;
  image_url: string | null;
  latitude: number;
  longitude: number;
  location_name: string;
  created_at: string;
  updated_at: string;
  ai_confidence: number | null;
  ai_summary: string | null;
  recommended_action: string | null;
}

interface BackendAnalysis {
  category: BackendCategory;
  severity: BackendSeverity;
  confidence: number;
  priority_score: number;
  summary: string;
  recommended_action: string;
  priority_factors?: Record<string, number>;
  duplicate_count?: number;
}

interface BackendReportDetail {
  report: BackendReport;
  ai_analysis: {
    confidence: number | null;
    summary: string | null;
    recommended_action: string | null;
  };
  location: { latitude: number; longitude: number; name: string };
  priority: { priority_score: number; factors: Record<string, number> };
  potential_duplicates: unknown[];
  duplicate_count: number;
}

interface BackendAnalytics {
  total_reports: number;
  critical_reports: number;
  resolved_reports: number;
  ai_processed_reports: number;
  reports_by_category: Record<BackendCategory, number>;
  reports_by_severity: Record<BackendSeverity, number>;
  reports_by_status: Record<BackendStatus, number>;
  reports_over_time: { month: string; count: number; resolved?: number }[];
  resolution_rate: number;
  average_resolution_time: number;
}

const categoryFromBackend: Record<BackendCategory, IssueCategory> = {
  ROAD_DAMAGE: "road_damage",
  GARBAGE: "waste",
  STREETLIGHT: "lighting",
  WATER_LEAK: "water",
  PUBLIC_SAFETY: "safety",
  OTHER: "other",
};
const severityFromBackend: Record<BackendSeverity, Severity> = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical",
};
const statusFromBackend: Record<BackendStatus, IssueStatus> = {
  NEW: "new",
  UNDER_REVIEW: "under_review",
  ASSIGNED: "assigned",
  IN_PROGRESS: "in_progress",
  RESOLVED: "resolved",
};
const statusToBackend: Record<IssueStatus, BackendStatus> = {
  new: "NEW",
  under_review: "UNDER_REVIEW",
  assigned: "ASSIGNED",
  in_progress: "IN_PROGRESS",
  resolved: "RESOLVED",
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    throw new Error(`Can't reach CivicLens API at ${API_URL}. Check that the backend is running.`);
  }
  if (!response.ok) {
    let detail = `Request failed (${response.status})`;
    try {
      const body = (await response.json()) as { detail?: unknown };
      if (typeof body.detail === "string") detail = body.detail;
      else if (Array.isArray(body.detail)) detail = body.detail.map((item) => item.msg).join("; ");
    } catch {
      // Keep the useful HTTP status if the server didn't return JSON.
    }
    throw new Error(detail);
  }
  return (await response.json()) as T;
}

function factorsToList(factors: Record<string, number> = {}) {
  const labels: Record<string, string> = {
    severity: "Severity",
    public_impact: "Public impact",
    duplicate_reports: "Duplicate reports",
    age: "Time unresolved",
    location_exposure: "Location exposure",
  };
  return Object.entries(factors).map(([key, value]) => ({
    label: labels[key] ?? key.replaceAll("_", " "),
    value: `${value} pts`,
    weight: Math.min(100, Math.max(0, value * 2)),
  }));
}

function analysisFromBackend(value: BackendAnalysis): AIAnalysis {
  return {
    category: categoryFromBackend[value.category],
    confidence: Math.round(value.confidence <= 1 ? value.confidence * 100 : value.confidence),
    severity: severityFromBackend[value.severity],
    priorityScore: value.priority_score,
    detectedIssue: value.summary,
    recommendedAction: value.recommended_action,
    duplicateCount: value.duplicate_count ?? 0,
    factors: factorsToList(value.priority_factors),
    analyzedAt: new Date().toISOString(),
  };
}

function reportFromBackend(
  value: BackendReport,
  factors?: Record<string, number>,
  duplicateCount = 0,
): Report {
  const hasAnalysis = value.ai_confidence !== null || value.ai_summary !== null;
  const analysis = hasAnalysis
    ? analysisFromBackend({
        category: value.category,
        severity: value.severity,
        confidence: value.ai_confidence ?? 0,
        priority_score: value.priority_score,
        summary: value.ai_summary ?? "Civic report classified by the analysis service.",
        recommended_action:
          value.recommended_action ?? "Review this report and assign it to the appropriate team.",
        priority_factors: factors ?? {},
        duplicate_count: duplicateCount,
      })
    : null;
  return {
    id: String(value.id),
    title: value.title,
    description: value.description,
    imageUrl: value.image_url,
    location: { lat: value.latitude, lng: value.longitude, address: value.location_name },
    status: statusFromBackend[value.status],
    createdAt: value.created_at,
    reporter: "Community",
    analysis,
    timeline: [
      { label: "Reported", at: value.created_at, done: true },
      { label: "AI analyzed", at: analysis ? value.updated_at : null, done: Boolean(analysis) },
      {
        label: "Assigned",
        at: ["ASSIGNED", "IN_PROGRESS", "RESOLVED"].includes(value.status)
          ? value.updated_at
          : null,
        done: ["ASSIGNED", "IN_PROGRESS", "RESOLVED"].includes(value.status),
      },
      {
        label: "In progress",
        at: ["IN_PROGRESS", "RESOLVED"].includes(value.status) ? value.updated_at : null,
        done: ["IN_PROGRESS", "RESOLVED"].includes(value.status),
      },
      {
        label: "Resolved",
        at: value.status === "RESOLVED" ? value.updated_at : null,
        done: value.status === "RESOLVED",
      },
    ],
  };
}

function analyticsFromBackend(value: BackendAnalytics): Analytics {
  const byCategory = Object.entries(value.reports_by_category).map(([key, count]) => ({
    name: categoryFromBackend[key as BackendCategory].replaceAll("_", " "),
    value: count,
  }));
  const bySeverity = Object.entries(value.reports_by_severity).map(([key, count]) => ({
    name:
      severityFromBackend[key as BackendSeverity][0]!.toUpperCase() +
      severityFromBackend[key as BackendSeverity].slice(1),
    value: count,
    key: severityFromBackend[key as BackendSeverity],
  }));
  const byStatus = Object.entries(value.reports_by_status).map(([key, count]) => ({
    name: statusFromBackend[key as BackendStatus].replaceAll("_", " "),
    value: count,
  }));
  const categoryTotal = byCategory.reduce((total, item) => total + item.value, 0);
  return {
    totals: {
      totalReports: value.total_reports,
      criticalIssues: value.critical_reports,
      resolved: value.resolved_reports,
      aiProcessed: value.ai_processed_reports,
    },
    deltas: { totalReports: 0, criticalIssues: 0, resolved: 0, aiProcessed: 0 },
    byCategory,
    bySeverity,
    overTime: value.reports_over_time.map((item) => ({
      date: item.month,
      reports: item.count,
      resolved: item.resolved ?? 0,
    })),
    byStatus,
    resolutionRate: value.resolution_rate,
    avgResolutionDays: value.average_resolution_time,
    insights: [
      {
        id: "resolution-rate",
        title: "Resolution rate",
        detail: "Share of reported issues marked resolved.",
        metric: `${Math.round(value.resolution_rate * 100)}%`,
        tone: "success",
      },
      {
        id: "largest-category",
        title: "Most reported category",
        detail: "Category with the highest report volume.",
        metric: [...byCategory].sort((a, b) => b.value - a.value)[0]?.name ?? "No reports",
        tone: "accent",
      },
      {
        id: "ai-coverage",
        title: "AI coverage",
        detail: "Reports processed by the analysis service.",
        metric: categoryTotal
          ? `${Math.round((value.ai_processed_reports / categoryTotal) * 100)}%`
          : "0%",
        tone: "warning",
      },
    ],
  };
}

export const api = {
  async listReports(): Promise<Report[]> {
    const reports = await request<BackendReport[]>("/api/reports");
    return reports.map((report) => reportFromBackend(report));
  },

  async getReport(id: string): Promise<Report> {
    const detail = await request<BackendReportDetail>(`/api/reports/${encodeURIComponent(id)}`);
    return reportFromBackend(detail.report, detail.priority.factors, detail.duplicate_count);
  },

  async createReport(input: CreateReportInput): Promise<Report> {
    const created = await request<BackendReport>("/api/reports", {
      method: "POST",
      body: JSON.stringify({
        title: input.title,
        description: input.description,
        latitude: input.location.lat,
        longitude: input.location.lng,
        location_name: input.location.address,
        image_url: input.imageDataUrl,
      }),
    });
    return reportFromBackend(created);
  },

  async analyzeReport(id: string): Promise<AIAnalysis> {
    const result = await request<BackendAnalysis>(
      `/api/reports/${encodeURIComponent(id)}/analyze`,
      { method: "POST" },
    );
    return analysisFromBackend(result);
  },

  async updateStatus(id: string, status: IssueStatus): Promise<Report> {
    const updated = await request<BackendReport>(`/api/reports/${encodeURIComponent(id)}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: statusToBackend[status] }),
    });
    return reportFromBackend(updated);
  },

  async getAnalytics(): Promise<Analytics> {
    return analyticsFromBackend(await request<BackendAnalytics>("/api/analytics"));
  },

  async getMapIssues(): Promise<Report[]> {
    const [issues, reports] = await Promise.all([
      request<
        {
          id: number;
          latitude: number;
          longitude: number;
          category: BackendCategory;
          severity: BackendSeverity;
          priority_score: number;
          status: BackendStatus;
        }[]
      >("/api/map/issues"),
      request<BackendReport[]>("/api/reports"),
    ]);
    const byId = new Map(reports.map((report) => [report.id, report]));
    return issues.flatMap((issue) => {
      const report = byId.get(issue.id);
      if (!report) return [];
      return [
        reportFromBackend({
          ...report,
          latitude: issue.latitude,
          longitude: issue.longitude,
          category: issue.category,
          severity: issue.severity,
          priority_score: issue.priority_score,
          status: issue.status,
        }),
      ];
    });
  },
};

export const queries = {
  reports: () => ({ queryKey: ["reports"], queryFn: api.listReports }),
  report: (id: string) => ({ queryKey: ["reports", id], queryFn: () => api.getReport(id) }),
  analytics: () => ({ queryKey: ["analytics"], queryFn: api.getAnalytics }),
  mapIssues: () => ({ queryKey: ["map-issues"], queryFn: api.getMapIssues }),
};
