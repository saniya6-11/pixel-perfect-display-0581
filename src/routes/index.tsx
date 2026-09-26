import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Brain,
  Copy,
  Gauge,
  Map as MapIcon,
  MapPinned,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SeverityBadge } from "@/components/civic/badges";
import { PriorityBar } from "@/components/civic/PriorityScore";
import { queries } from "@/lib/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CivicLens — Turn citizen reports into actionable intelligence" },
      {
        name: "description",
        content:
          "AI-powered civic issue analysis, prioritization and geographic intelligence for smarter communities.",
      },
      { property: "og:title", content: "CivicLens — Civic issue intelligence" },
      {
        property: "og:description",
        content:
          "AI-powered civic issue analysis, prioritization and geographic intelligence for smarter communities.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: ScanSearch,
    title: "AI-powered analysis",
    body: "Report descriptions are classified into civic categories with a confidence score.",
  },
  {
    icon: Gauge,
    title: "Smart prioritization",
    body: "Severity, public impact and exposure combine into a single 0–100 priority score.",
  },
  {
    icon: MapPinned,
    title: "Geographic intelligence",
    body: "Every report is placed on the civic map so clusters and hotspots surface instantly.",
  },
  {
    icon: Copy,
    title: "Duplicate detection",
    body: "Nearby reports describing the same incident are grouped instead of queued twice.",
  },
];

const steps = [
  { n: "01", title: "Report", body: "A citizen submits a photo, description and location." },
  { n: "02", title: "Analyze", body: "The model classifies the issue and estimates severity." },
  { n: "03", title: "Prioritize", body: "A priority score ranks it against every open report." },
  { n: "04", title: "Resolve", body: "Teams are assigned and progress is tracked to closure." },
];

function Landing() {
  const reports = useQuery(queries.reports());
  const analytics = useQuery(queries.analytics());
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 glass-panel">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="accent-surface grid size-9 place-items-center rounded-lg text-primary-foreground">
              <ShieldCheck className="size-5" aria-hidden />
            </span>
            <span className="font-display text-lg font-bold">CivicLens</span>
          </Link>
          <nav className="ms-auto hidden items-center gap-1 md:flex">
            <Button asChild variant="ghost" size="sm">
              <Link to="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link to="/map">Civic Map</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link to="/analytics">Analytics</Link>
            </Button>
          </nav>
          <Button asChild size="sm" className="ms-auto md:ms-0">
            <Link to="/report">Report an Issue</Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="hero-surface relative overflow-hidden">
        <div className="absolute inset-0 opacity-25 [background:radial-gradient(60%_60%_at_80%_10%,color-mix(in_oklab,var(--accent)_70%,transparent),transparent)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:px-8 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/85">
              <Sparkles className="size-3.5" aria-hidden /> AI-powered civic issue intelligence
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
              Turn citizen reports into{" "}
              <span className="text-gradient-accent">actionable intelligence.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              AI-powered civic issue analysis, prioritization and geographic intelligence for
              smarter communities.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/report">
                  Report an Issue <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/25 bg-white/5 text-white hover:bg-white/15 hover:text-white"
              >
                <Link to="/map">
                  <MapIcon className="size-4" /> Explore Civic Map
                </Link>
              </Button>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-6">
              {[
                [String(analytics.data?.totals.totalReports ?? "—"), "Reports processed"],
                [
                  analytics.data
                    ? `${analytics.data.totals.totalReports ? Math.round((analytics.data.totals.aiProcessed / analytics.data.totals.totalReports) * 100) : 0}%`
                    : "—",
                  "AI coverage",
                ],
                [analytics.data ? `${analytics.data.avgResolutionDays}d` : "—", "Avg. resolution"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="font-display text-2xl font-bold text-white">{value}</dt>
                  <dd className="text-xs text-white/60">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <DashboardPreview
            reports={reports.data ?? []}
            analytics={analytics.data}
            loading={reports.isLoading || analytics.isLoading}
          />
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <article key={f.title} className="surface-card lift-on-hover rounded-xl p-5">
              <span className="grid size-10 place-items-center rounded-lg bg-accent-soft text-accent-foreground">
                <f.icon className="size-5" aria-hidden />
              </span>
              <h3 className="mt-4 font-display text-base font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">How it works</h2>
            <p className="mt-2 text-muted-foreground">
              Four steps from a photo on the street to a tracked municipal work order.
            </p>
          </div>
          <ol className="mt-10 grid gap-4 md:grid-cols-4">
            {steps.map((s) => (
              <li key={s.n} className="relative rounded-xl border border-border bg-background p-5">
                <span className="font-display text-xs font-bold tracking-widest text-accent">
                  {s.n}
                </span>
                <h3 className="mt-2 font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="hero-surface flex flex-wrap items-center justify-between gap-6 rounded-2xl px-6 py-10 sm:px-10">
          <div>
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
              See something broken? Report it in under a minute.
            </h2>
            <p className="mt-2 max-w-xl text-sm text-white/70">
              The model will classify, score and place your report on the civic map immediately.
            </p>
          </div>
          <Button asChild size="lg">
            <Link to="/report">
              <Brain className="size-4" /> Analyze with AI
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-sm text-muted-foreground sm:px-6 lg:px-8">
          <p>CivicLens — civic issue intelligence</p>
          <p>Live civic issue intelligence</p>
        </div>
      </footer>
    </div>
  );
}

function DashboardPreview({
  reports,
  analytics,
  loading,
}: {
  reports: import("@/types/civic").Report[];
  analytics: import("@/types/civic").Analytics | undefined;
  loading: boolean;
}) {
  const top = [...reports]
    .sort((a, b) => (b.analysis?.priorityScore ?? 0) - (a.analysis?.priorityScore ?? 0))
    .slice(0, 3);
  const bars = analytics?.overTime.slice(-12).map((item) => item.reports) ?? [];
  const maxBar = Math.max(1, ...bars);
  return (
    <div className="relative">
      <div className="rounded-2xl border border-white/15 bg-white/10 p-2 shadow-[var(--shadow-lift)] backdrop-blur">
        <div className="overflow-hidden rounded-xl bg-card">
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <span className="size-2.5 rounded-full bg-critical/60" />
            <span className="size-2.5 rounded-full bg-warning/60" />
            <span className="size-2.5 rounded-full bg-success/60" />
            <span className="ms-2 text-xs font-medium text-muted-foreground">
              CivicLens · Dashboard
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 p-4 pb-0">
            {[
              ["Total", analytics?.totals.totalReports ?? (loading ? "…" : 0)],
              ["Critical", analytics?.totals.criticalIssues ?? (loading ? "…" : 0)],
              ["Resolved", analytics?.totals.resolved ?? (loading ? "…" : 0)],
              ["AI", analytics?.totals.aiProcessed ?? (loading ? "…" : 0)],
            ].map(([label, value]) => (
              <div
                key={String(label)}
                className="rounded-lg border border-border bg-background p-2.5"
              >
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {label}
                </p>
                <p className="font-display text-lg font-bold tabular-nums">{value}</p>
              </div>
            ))}
          </div>

          <div className="p-4">
            <div className="flex h-24 items-end gap-1.5 rounded-lg border border-border bg-background p-3">
              {(bars.length ? bars : [0]).map((count, i) => (
                <span
                  key={i}
                  className="accent-surface flex-1 rounded-sm"
                  style={{
                    height: `${Math.max(6, (count / maxBar) * 100)}%`,
                    opacity: 0.55 + i / 30,
                  }}
                />
              ))}
            </div>

            <ul className="mt-3 space-y-2">
              {!loading && top.length === 0 ? (
                <li className="rounded-lg border border-border bg-background px-3 py-4 text-xs text-muted-foreground">
                  No reports yet. Submit the first civic issue.
                </li>
              ) : null}
              {top.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2"
                >
                  <Wrench className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                  <span className="min-w-0 flex-1 truncate text-xs font-medium">{r.title}</span>
                  {r.analysis ? (
                    <SeverityBadge severity={r.analysis.severity} showIcon={false} />
                  ) : null}
                  {r.analysis ? (
                    <PriorityBar score={r.analysis.priorityScore} className="hidden sm:flex" />
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
