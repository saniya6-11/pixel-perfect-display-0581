import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertOctagon, Brain, CheckCircle2, FileText, Plus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { KpiCard } from "@/components/civic/KpiCard";
import { ChartCard } from "@/components/civic/ChartCard";
import { IssueCard } from "@/components/civic/IssueCard";
import { MapView, toMarkers } from "@/components/civic/MapView";
import { EmptyState, ErrorState, SkeletonGrid } from "@/components/civic/states";
import { Button } from "@/components/ui/button";
import { queries } from "@/lib/api";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — CivicLens" },
      {
        name: "description",
        content: "Live KPIs, issue intelligence charts and the civic hotspot map in one view.",
      },
      { property: "og:title", content: "Dashboard — CivicLens" },
      {
        property: "og:description",
        content: "Live KPIs, issue intelligence charts and the civic hotspot map in one view.",
      },
    ],
  }),
  component: DashboardPage,
});

const severityColor: Record<string, string> = {
  Critical: "var(--critical)",
  High: "var(--high)",
  Medium: "var(--warning)",
  Low: "var(--success)",
};

const tooltipStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "10px",
  fontSize: "12px",
  color: "var(--foreground)",
} as const;

function DashboardPage() {
  const navigate = useNavigate();
  const analytics = useQuery(queries.analytics());
  const reports = useQuery(queries.reports());

  return (
    <AppShell
      title="Dashboard"
      subtitle="Civic issue intelligence across every open ward."
      actions={
        <Button asChild>
          <Link to="/report">
            <Plus className="size-4" /> New report
          </Link>
        </Button>
      }
    >
      {analytics.isLoading ? (
        <SkeletonGrid />
      ) : analytics.isError || !analytics.data ? (
        <ErrorState onRetry={() => analytics.refetch()} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Total Reports"
            value={analytics.data.totals.totalReports}
            delta={analytics.data.deltas.totalReports}
            icon={FileText}
          />
          <KpiCard
            label="Critical Issues"
            value={analytics.data.totals.criticalIssues}
            delta={analytics.data.deltas.criticalIssues}
            icon={AlertOctagon}
            tone="critical"
          />
          <KpiCard
            label="Resolved"
            value={analytics.data.totals.resolved}
            delta={analytics.data.deltas.resolved}
            icon={CheckCircle2}
            tone="success"
          />
          <KpiCard
            label="AI Processed"
            value={analytics.data.totals.aiProcessed}
            delta={analytics.data.deltas.aiProcessed}
            icon={Brain}
            tone="accent"
          />
        </div>
      )}

      {analytics.data ? (
        <section className="mt-8">
          <h2 className="mb-4 font-display text-lg font-semibold">Issue Intelligence</h2>
          <div className="grid gap-4 xl:grid-cols-2">
            <ChartCard title="Reports by category" description="Where citizen attention is going">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={analytics.data.byCategory} margin={{ left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--muted)" }} />
                  <Bar dataKey="value" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Severity distribution" description="How urgent the open queue is">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={analytics.data.bySeverity}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={3}
                    stroke="var(--card)"
                  >
                    {analytics.data.bySeverity.map((entry) => (
                      <Cell key={entry.name} fill={severityColor[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <ul className="mt-2 flex flex-wrap justify-center gap-4 text-xs">
                {analytics.data.bySeverity.map((s) => (
                  <li key={s.name} className="flex items-center gap-1.5 text-muted-foreground">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ background: severityColor[s.name] }}
                    />
                    {s.name} · {s.value}
                  </li>
                ))}
              </ul>
            </ChartCard>

            <ChartCard title="Reports over time" description="Submissions vs resolutions">
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={analytics.data.overTime} margin={{ left: -20 }}>
                  <defs>
                    <linearGradient id="gReports" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="gResolved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area
                    type="monotone"
                    dataKey="reports"
                    stroke="var(--chart-1)"
                    fill="url(#gReports)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="resolved"
                    stroke="var(--chart-2)"
                    fill="url(#gResolved)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Resolution status" description="Where every report currently sits">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={analytics.data.byStatus} layout="vertical" margin={{ left: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={90}
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--muted)" }} />
                  <Bar dataKey="value" fill="var(--chart-2)" radius={[0, 6, 6, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </section>
      ) : null}

      <section className="mt-8 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <div className="surface-card overflow-hidden rounded-xl">
          <header className="flex items-center justify-between gap-3 px-5 py-4">
            <div>
              <h3 className="font-display text-base font-semibold">Civic hotspot map</h3>
              <p className="text-sm text-muted-foreground">
                Marker colour follows severity. Click a marker for a preview.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/map">Open full map</Link>
            </Button>
          </header>
          <div className="h-96 border-t border-border">
            <MapView
              markers={toMarkers(reports.data ?? [])}
              onMarkerClick={(id) =>
                navigate({ to: "/reports/$reportId", params: { reportId: id } })
              }
            />
          </div>
        </div>

        <div>
          <h3 className="mb-3 font-display text-base font-semibold">Highest priority</h3>
          {reports.isLoading ? (
            <SkeletonGrid count={3} />
          ) : (reports.data?.length ?? 0) === 0 ? (
            <EmptyState
              title="No reports yet"
              description="Once citizens start reporting, the highest priority issues appear here."
            />
          ) : (
            <div className="grid gap-3">
              {[...(reports.data ?? [])]
                .sort((a, b) => (b.analysis?.priorityScore ?? 0) - (a.analysis?.priorityScore ?? 0))
                .slice(0, 4)
                .map((report) => (
                  <IssueCard key={report.id} report={report} />
                ))}
            </div>
          )}
        </div>
      </section>
    </AppShell>
  );
}
