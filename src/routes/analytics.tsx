import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AlertOctagon, Brain, CheckCircle2, FileText } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AppShell } from "@/components/layout/AppShell";
import { ChartCard } from "@/components/civic/ChartCard";
import { EmptyState, ErrorState, SkeletonGrid } from "@/components/civic/states";
import { KpiCard } from "@/components/civic/KpiCard";
import { queries } from "@/lib/api";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics — CivicLens" }] }),
  component: AnalyticsPage,
});

const tooltipStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "10px",
  fontSize: "12px",
  color: "var(--foreground)",
} as const;

function AnalyticsPage() {
  const analytics = useQuery(queries.analytics());
  const data = analytics.data;
  return (
    <AppShell title="Analytics" subtitle="A live view of civic reports and resolution progress.">
      {analytics.isLoading ? (
        <SkeletonGrid />
      ) : analytics.isError || !data ? (
        <ErrorState onRetry={() => analytics.refetch()} />
      ) : data.totals.totalReports === 0 ? (
        <EmptyState
          title="No analytics yet"
          description="Analytics will appear when the first civic report is submitted."
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              label="Total Reports"
              value={data.totals.totalReports}
              delta={data.deltas.totalReports}
              icon={FileText}
            />
            <KpiCard
              label="Critical Issues"
              value={data.totals.criticalIssues}
              delta={data.deltas.criticalIssues}
              icon={AlertOctagon}
              tone="critical"
            />
            <KpiCard
              label="Resolved"
              value={data.totals.resolved}
              delta={data.deltas.resolved}
              icon={CheckCircle2}
              tone="success"
            />
            <KpiCard
              label="AI Processed"
              value={data.totals.aiProcessed}
              delta={data.deltas.aiProcessed}
              icon={Brain}
              tone="accent"
            />
          </div>
          <section className="mt-8 grid gap-4 xl:grid-cols-2">
            <ChartCard
              title="Reports by category"
              description="Report volume across civic issue types"
            >
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data.byCategory} margin={{ left: -20 }}>
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
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="value" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard
              title="Reports over time"
              description="Monthly submissions and resolved reports"
            >
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data.overTime}>
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
                  <Bar
                    dataKey="reports"
                    name="Reports"
                    fill="var(--chart-1)"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="resolved"
                    name="Resolved"
                    fill="var(--chart-2)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </section>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="surface-card rounded-xl p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Resolution rate
              </p>
              <p className="mt-2 font-display text-3xl font-bold">
                {Math.round(data.resolutionRate * 100)}%
              </p>
            </div>
            <div className="surface-card rounded-xl p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Average resolution time
              </p>
              <p className="mt-2 font-display text-3xl font-bold">{data.avgResolutionDays} days</p>
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
}
