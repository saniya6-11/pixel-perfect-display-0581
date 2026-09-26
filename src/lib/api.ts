import type {
  AIAnalysis,
  Analytics,
  CreateReportInput,
  IssueCategory,
  IssueStatus,
  Report,
  Severity,
} from "@/types/civic";
import { mockAnalytics, mockReports } from "./mock-data";

/**
 * Centralised API service layer.
 *
 * Every screen talks to this module only — never to `fetch` directly.
 * Point it at a backend with VITE_API_URL (e.g. http://localhost:8000).
 *
 * Fallback: if VITE_API_URL is unset or the request fails, the demo dataset in
 * ./mock-data.ts is served instead so the UI stays usable. To go backend-only,
 * set ENABLE_MOCK_FALLBACK to false (or delete `withFallback`).
 */

export const API_URL: string = import.meta.env["VITE_API_URL"] ?? "";
export const ENABLE_MOCK_FALLBACK = true;

export type ApiSource = "live" | "fallback";

let usingFallback = !API_URL;
export const isUsingFallback = () => usingFallback;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_URL) throw new Error("VITE_API_URL is not configured");
  const res = await fetch(`${API_URL.replace(/\/$/, "")}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return (await res.json()) as T;
}

async function withFallback<T>(live: () => Promise<T>, fallback: () => T): Promise<T> {
  try {
    const data = await live();
    usingFallback = false;
    return data;
  } catch (error) {
    if (!ENABLE_MOCK_FALLBACK) throw error;
    usingFallback = true;
    return fallback();
  }
}

/* ---------- local store backing the fallback mode ---------- */

let localReports: Report[] = [...mockReports];

/* ---------- heuristic analyser used when no backend is present ---------- */

const KEYWORDS: { category: IssueCategory; words: string[]; detected: string; action: string }[] = [
  {
    category: "road_damage",
    words: ["pothole", "road", "asphalt", "crack", "tar", "carriageway", "speed breaker"],
    detected: "Large pothole / road surface damage",
    action: "Immediate inspection and temporary barricading recommended.",
  },
  {
    category: "waste",
    words: ["garbage", "trash", "waste", "bin", "dump", "litter", "debris"],
    detected: "Solid waste accumulation / uncollected bins",
    action: "Schedule an additional collection round within 24 hours.",
  },
  {
    category: "water",
    words: ["water", "leak", "pipe", "drain", "flood", "sewage", "overflow"],
    detected: "Water leakage / drainage obstruction",
    action: "Dispatch the water crew and isolate the affected line.",
  },
  {
    category: "lighting",
    words: ["light", "lamp", "streetlight", "dark", "bulb", "pole"],
    detected: "Non-functional or damaged street lighting",
    action: "Isolate the supply and replace the faulty fixture.",
  },
  {
    category: "safety",
    words: ["unsafe", "railing", "danger", "wire", "collapse", "broken", "hazard", "crossing"],
    detected: "Unsafe public infrastructure",
    action: "Cordon the area and schedule a structural inspection.",
  },
];

function analyseLocally(description: string, hasImage: boolean): AIAnalysis {
  const text = description.toLowerCase();
  let best = KEYWORDS[0]!;
  let hits = 0;
  for (const entry of KEYWORDS) {
    const count = entry.words.filter((w) => text.includes(w)).length;
    if (count > hits) {
      hits = count;
      best = entry;
    }
  }
  const urgencyWords = ["danger", "urgent", "accident", "injur", "exposed", "child", "flood", "collapse"];
  const urgency = urgencyWords.filter((w) => text.includes(w)).length;

  const severity: Severity =
    urgency >= 2 ? "critical" : urgency === 1 ? "high" : text.length > 140 ? "medium" : "low";

  const severityWeight = { critical: 92, high: 78, medium: 58, low: 40 }[severity];
  const confidence = Math.min(97, 62 + hits * 9 + (hasImage ? 12 : 0) + Math.min(10, text.length / 20));
  const duplicateCount = hits > 1 ? 3 : hits === 1 ? 1 : 0;
  const priorityScore = Math.round(
    Math.min(99, severityWeight * 0.62 + confidence * 0.22 + duplicateCount * 4 + (hasImage ? 5 : 0)),
  );

  return {
    category: hits === 0 ? "other" : best.category,
    confidence: Math.round(confidence),
    severity,
    priorityScore,
    detectedIssue: hits === 0 ? "Unclassified civic issue" : best.detected,
    recommendedAction:
      hits === 0 ? "Manual triage recommended — description lacks clear signals." : best.action,
    duplicateCount,
    analyzedAt: new Date().toISOString(),
    factors: [
      { label: "Severity", value: severity.toUpperCase(), weight: severityWeight },
      {
        label: "Public impact",
        value: priorityScore > 75 ? "High" : priorityScore > 50 ? "Medium" : "Low",
        weight: Math.min(100, priorityScore + 5),
      },
      {
        label: "Location exposure",
        value: priorityScore > 70 ? "High" : "Medium",
        weight: Math.max(30, priorityScore - 15),
      },
      { label: "Duplicate reports", value: `${duplicateCount}`, weight: duplicateCount * 25 },
      { label: "Time unresolved", value: "0 days", weight: 5 },
    ],
  };
}

/* ---------- public API ---------- */

export const api = {
  listReports: () =>
    withFallback(
      () => request<Report[]>("/api/reports"),
      () => [...localReports],
    ),

  getReport: (id: string) =>
    withFallback(
      () => request<Report>(`/api/reports/${id}`),
      () => {
        const found = localReports.find((r) => r.id === id);
        if (!found) throw new Error("Report not found");
        return found;
      },
    ),

  createReport: (input: CreateReportInput) =>
    withFallback(
      () =>
        request<Report>("/api/reports", {
          method: "POST",
          body: JSON.stringify(input),
        }),
      () => {
        const id = `CL-${2042 + localReports.length - mockReports.length}`;
        const createdAt = new Date().toISOString();
        const report: Report = {
          id,
          title: input.description.split(/[.\n]/)[0]?.slice(0, 70) || "Citizen report",
          description: input.description,
          imageUrl: input.imageDataUrl,
          location: input.location,
          status: "new",
          createdAt,
          reporter: "You",
          analysis: null,
          timeline: [
            { label: "Reported", at: createdAt, done: true },
            { label: "AI analyzed", at: null, done: false },
            { label: "Assigned", at: null, done: false },
            { label: "In progress", at: null, done: false },
            { label: "Resolved", at: null, done: false },
          ],
        };
        localReports = [report, ...localReports];
        return report;
      },
    ),

  analyzeReport: (id: string) =>
    withFallback(
      () => request<AIAnalysis>(`/api/reports/${id}/analyze`, { method: "POST" }),
      () => {
        const report = localReports.find((r) => r.id === id);
        if (!report) throw new Error("Report not found");
        const analysis = analyseLocally(report.description, Boolean(report.imageUrl));
        report.analysis = analysis;
        report.timeline[1] = { label: "AI analyzed", at: new Date().toISOString(), done: true };
        return analysis;
      },
    ),

  updateStatus: (id: string, status: IssueStatus) =>
    withFallback(
      () =>
        request<Report>(`/api/reports/${id}/status`, {
          method: "PATCH",
          body: JSON.stringify({ status }),
        }),
      () => {
        const report = localReports.find((r) => r.id === id);
        if (!report) throw new Error("Report not found");
        report.status = status;
        return report;
      },
    ),

  getAnalytics: () =>
    withFallback(
      () => request<Analytics>("/api/analytics"),
      () => mockAnalytics,
    ),

  getMapIssues: () =>
    withFallback(
      () => request<Report[]>("/api/map/issues"),
      () => [...localReports],
    ),
};

export const queries = {
  reports: () => ({ queryKey: ["reports"], queryFn: api.listReports }),
  report: (id: string) => ({ queryKey: ["reports", id], queryFn: () => api.getReport(id) }),
  analytics: () => ({ queryKey: ["analytics"], queryFn: api.getAnalytics }),
  mapIssues: () => ({ queryKey: ["map-issues"], queryFn: api.getMapIssues }),
};
