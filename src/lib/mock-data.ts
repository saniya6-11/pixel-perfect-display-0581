import type { Analytics, IssueCategory, Report, Severity } from "@/types/civic";

import pothole from "@/assets/issue-pothole.jpg";
import garbage from "@/assets/issue-garbage.jpg";
import streetlight from "@/assets/issue-streetlight.jpg";
import water from "@/assets/issue-water.jpg";

/**
 * Fallback dataset. Used ONLY when the backend at VITE_API_URL is unreachable.
 * Delete this file and the `withFallback` calls in src/lib/api.ts to go
 * backend-only.
 */

const imageFor: Record<IssueCategory, string | null> = {
  road_damage: pothole,
  waste: garbage,
  lighting: streetlight,
  water: water,
  safety: null,
  other: null,
};

function daysAgo(n: number) {
  return new Date(Date.now() - n * 86_400_000).toISOString();
}

function timeline(status: Report["status"], createdAt: string) {
  const order = ["new", "under_review", "assigned", "resolved"];
  const idx = order.indexOf(status);
  const base = new Date(createdAt).getTime();
  const steps = [
    { label: "Reported", offset: 0 },
    { label: "AI analyzed", offset: 0.01 },
    { label: "Assigned", offset: 1 },
    { label: "In progress", offset: 2 },
    { label: "Resolved", offset: 4 },
  ];
  const doneThrough = idx === 0 ? 1 : idx === 1 ? 1 : idx === 2 ? 3 : 4;
  return steps.map((s, i) => ({
    label: s.label,
    at: i <= doneThrough ? new Date(base + s.offset * 86_400_000).toISOString() : null,
    done: i <= doneThrough,
  }));
}

type Seed = {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  severity: Severity;
  priority: number;
  confidence: number;
  status: Report["status"];
  days: number;
  lat: number;
  lng: number;
  address: string;
  detected: string;
  action: string;
  duplicates: number;
  reporter: string;
};

const seeds: Seed[] = [
  {
    id: "CL-2041",
    title: "Large pothole near Ring Road junction",
    description:
      "Deep pothole roughly 1.5 feet wide in the left lane. Two-wheelers are swerving into oncoming traffic to avoid it.",
    category: "road_damage",
    severity: "critical",
    priority: 92,
    confidence: 94,
    status: "assigned",
    days: 4,
    lat: 12.9719,
    lng: 77.5946,
    address: "Ring Road Junction, Sector 4",
    detected: "Large pothole / road surface damage",
    action: "Immediate inspection and temporary barricading recommended.",
    duplicates: 3,
    reporter: "A. Menon",
  },
  {
    id: "CL-2040",
    title: "Garbage overflowing behind market lane",
    description:
      "Bins have not been cleared for a week. Waste spilling onto the footpath and attracting stray animals.",
    category: "waste",
    severity: "high",
    priority: 78,
    confidence: 91,
    status: "under_review",
    days: 2,
    lat: 12.9766,
    lng: 77.5993,
    address: "Market Lane, Ward 11",
    detected: "Solid waste accumulation / uncollected bins",
    action: "Schedule an additional collection round within 24 hours.",
    duplicates: 2,
    reporter: "S. Kulkarni",
  },
  {
    id: "CL-2039",
    title: "Streetlight pole down on residential street",
    description:
      "Pole knocked over after last night's storm. Cables exposed close to the footpath.",
    category: "lighting",
    severity: "critical",
    priority: 88,
    confidence: 96,
    status: "new",
    days: 1,
    lat: 12.9652,
    lng: 77.5855,
    address: "12th Cross, Green Park",
    detected: "Collapsed streetlight with exposed wiring",
    action: "Isolate power supply and cordon the area before repair.",
    duplicates: 1,
    reporter: "R. Fernandes",
  },
  {
    id: "CL-2038",
    title: "Water main leak flooding the corner",
    description:
      "Continuous high-pressure leak flooding the crossing. Water has been running since early morning.",
    category: "water",
    severity: "high",
    priority: 81,
    confidence: 89,
    status: "assigned",
    days: 3,
    lat: 12.9812,
    lng: 77.6042,
    address: "Maple Street Corner, Sector 2",
    detected: "Burst water main / pressurised leak",
    action: "Dispatch water board crew and shut the feeder valve.",
    duplicates: 2,
    reporter: "N. Iyer",
  },
  {
    id: "CL-2037",
    title: "Broken footpath railing near school",
    description: "Safety railing bent and detached at two points on the school approach road.",
    category: "safety",
    severity: "medium",
    priority: 61,
    confidence: 84,
    status: "under_review",
    days: 6,
    lat: 12.9598,
    lng: 77.6128,
    address: "School Approach Road, Ward 7",
    detected: "Damaged pedestrian safety railing",
    action: "Temporary fencing, then weld and repaint the railing.",
    duplicates: 0,
    reporter: "P. Das",
  },
  {
    id: "CL-2036",
    title: "Faded zebra crossing at busy intersection",
    description:
      "Crossing markings nearly invisible, pedestrians crossing unpredictably during peak hours.",
    category: "safety",
    severity: "medium",
    priority: 55,
    confidence: 80,
    status: "resolved",
    days: 12,
    lat: 12.9702,
    lng: 77.6205,
    address: "Central Intersection, Ward 3",
    detected: "Worn road marking / low pedestrian visibility",
    action: "Repaint markings during the next night maintenance window.",
    duplicates: 1,
    reporter: "T. Bose",
  },
  {
    id: "CL-2035",
    title: "Cracked road surface after utility dig",
    description: "Trench refill has sunk, leaving a long ridge across the carriageway.",
    category: "road_damage",
    severity: "medium",
    priority: 58,
    confidence: 87,
    status: "resolved",
    days: 15,
    lat: 12.9885,
    lng: 77.5902,
    address: "Utility Lane, Sector 6",
    detected: "Uneven trench reinstatement",
    action: "Re-level and compact the reinstated trench.",
    duplicates: 0,
    reporter: "M. Sheikh",
  },
  {
    id: "CL-2034",
    title: "Dark stretch with three dead streetlights",
    description:
      "Three consecutive lights out along the park boundary, the stretch is unusable after sunset.",
    category: "lighting",
    severity: "low",
    priority: 42,
    confidence: 78,
    status: "new",
    days: 8,
    lat: 12.9551,
    lng: 77.5991,
    address: "Park Boundary Road, Ward 9",
    detected: "Multiple non-functional street lamps",
    action: "Replace lamp drivers during the routine maintenance cycle.",
    duplicates: 0,
    reporter: "K. Rao",
  },
  {
    id: "CL-2033",
    title: "Blocked storm drain on slope road",
    description: "Drain choked with leaves and plastic, water pools across the road after rain.",
    category: "water",
    severity: "low",
    priority: 38,
    confidence: 76,
    status: "resolved",
    days: 20,
    lat: 12.9634,
    lng: 77.6301,
    address: "Slope Road, Ward 5",
    detected: "Obstructed stormwater drain",
    action: "Desilt the drain ahead of the monsoon cycle.",
    duplicates: 0,
    reporter: "V. Nair",
  },
  {
    id: "CL-2032",
    title: "Illegal dumping at vacant plot",
    description: "Construction debris repeatedly dumped overnight on the vacant corner plot.",
    category: "waste",
    severity: "high",
    priority: 71,
    confidence: 88,
    status: "assigned",
    days: 5,
    lat: 12.9789,
    lng: 77.6155,
    address: "Corner Plot, Sector 8",
    detected: "Construction debris dumping",
    action: "Clear the site and install monitoring signage.",
    duplicates: 2,
    reporter: "A. Grewal",
  },
];

export const mockReports: Report[] = seeds.map((s) => {
  const createdAt = daysAgo(s.days);
  return {
    id: s.id,
    title: s.title,
    description: s.description,
    imageUrl: imageFor[s.category],
    location: { lat: s.lat, lng: s.lng, address: s.address },
    status: s.status,
    createdAt,
    reporter: s.reporter,
    analysis: {
      category: s.category,
      confidence: s.confidence,
      severity: s.severity,
      priorityScore: s.priority,
      detectedIssue: s.detected,
      recommendedAction: s.action,
      duplicateCount: s.duplicates,
      analyzedAt: createdAt,
      factors: [
        { label: "Severity", value: s.severity.toUpperCase(), weight: s.priority },
        {
          label: "Public impact",
          value: s.priority > 75 ? "High" : s.priority > 50 ? "Medium" : "Low",
          weight: Math.min(100, s.priority + 6),
        },
        {
          label: "Location exposure",
          value: s.priority > 70 ? "High" : "Medium",
          weight: Math.max(30, s.priority - 12),
        },
        {
          label: "Duplicate reports",
          value: `${s.duplicates}`,
          weight: Math.min(100, s.duplicates * 25),
        },
        {
          label: "Time unresolved",
          value: `${s.days} days`,
          weight: Math.min(100, s.days * 8),
        },
      ],
    },
    timeline: timeline(s.status, createdAt),
  };
});

export const mockAnalytics: Analytics = {
  totals: { totalReports: 127, criticalIssues: 23, resolved: 84, aiProcessed: 112 },
  deltas: { totalReports: 12, criticalIssues: 18, resolved: 9, aiProcessed: 14 },
  byCategory: [
    { name: "Road Damage", value: 48 },
    { name: "Waste", value: 27 },
    { name: "Lighting", value: 21 },
    { name: "Water", value: 18 },
    { name: "Safety", value: 9 },
    { name: "Other", value: 4 },
  ],
  bySeverity: [
    { name: "Critical", value: 23, key: "critical" },
    { name: "High", value: 34, key: "high" },
    { name: "Medium", value: 41, key: "medium" },
    { name: "Low", value: 29, key: "low" },
  ],
  overTime: [
    { date: "Wk 1", reports: 12, resolved: 7 },
    { date: "Wk 2", reports: 18, resolved: 11 },
    { date: "Wk 3", reports: 15, resolved: 13 },
    { date: "Wk 4", reports: 24, resolved: 16 },
    { date: "Wk 5", reports: 21, resolved: 18 },
    { date: "Wk 6", reports: 19, resolved: 19 },
  ],
  byStatus: [
    { name: "New", value: 18 },
    { name: "Under Review", value: 14 },
    { name: "Assigned", value: 11 },
    { name: "Resolved", value: 84 },
  ],
  resolutionRate: 66,
  avgResolutionDays: 3.8,
  insights: [
    {
      id: "i1",
      title: "Road damage dominates the queue",
      detail: "Road damage represents 38% of reported issues this cycle.",
      metric: "38%",
      tone: "accent",
    },
    {
      id: "i2",
      title: "Three geographic clusters need attention",
      detail: "Sectors 2, 4 and 8 account for most high-priority reports.",
      metric: "3 clusters",
      tone: "warning",
    },
    {
      id: "i3",
      title: "Possible duplicate incidents detected",
      detail: "7 reports may describe the same underlying incidents.",
      metric: "7 reports",
      tone: "success",
    },
    {
      id: "i4",
      title: "Critical volume trending up",
      detail: "Critical issues increased 18% compared with last week.",
      metric: "+18%",
      tone: "critical",
    },
  ],
};
