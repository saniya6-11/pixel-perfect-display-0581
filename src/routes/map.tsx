import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/AppShell";
import { MapView, toMarkers } from "@/components/civic/MapView";
import { IssueCard } from "@/components/civic/IssueCard";
import { EmptyState, LoadingState } from "@/components/civic/states";
import { Button } from "@/components/ui/button";
import { categoryFilters, severityMarkerColor } from "@/lib/civic-ui";
import { queries } from "@/lib/api";
import { SEVERITY_LABELS, type Severity } from "@/types/civic";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Civic Map — CivicLens" },
      {
        name: "description",
        content: "Interactive map of civic issues with severity-coded markers and hotspot filters.",
      },
      { property: "og:title", content: "Civic Map — CivicLens" },
      {
        property: "og:description",
        content: "Interactive map of civic issues with severity-coded markers and hotspot filters.",
      },
    ],
  }),
  component: CivicMapPage,
});

function CivicMapPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery(queries.mapIssues());
  const [filter, setFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    const reports = data ?? [];
    if (filter === "all") return reports;
    if (filter === "critical") return reports.filter((r) => r.analysis?.severity === "critical");
    return reports.filter((r) => r.analysis?.category === filter);
  }, [data, filter]);

  const nearby = useMemo(
    () =>
      [...filtered]
        .sort((a, b) => (b.analysis?.priorityScore ?? 0) - (a.analysis?.priorityScore ?? 0))
        .slice(0, 5),
    [filtered],
  );

  return (
    <AppShell
      title="Civic Map"
      subtitle="Geographic intelligence across every reported civic issue."
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {categoryFilters.map((f) => (
          <Button
            key={f.key}
            size="sm"
            variant={filter === f.key ? "default" : "outline"}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.7fr_1fr] xl:items-start">
        <div className="surface-card overflow-hidden rounded-xl">
          <div className="h-[32rem]">
            {isLoading ? (
              <LoadingState label="Loading civic map…" className="h-full rounded-none border-0" />
            ) : (
              <MapView
                markers={toMarkers(filtered)}
                onMarkerClick={(id) =>
                  navigate({ to: "/reports/$reportId", params: { reportId: id } })
                }
              />
            )}
          </div>
          <div className="flex flex-wrap items-center gap-4 border-t border-border px-5 py-3 text-xs text-muted-foreground">
            <span className="font-semibold uppercase tracking-wider">Legend</span>
            {(Object.keys(SEVERITY_LABELS) as Severity[]).map((s) => (
              <span key={s} className="flex items-center gap-1.5">
                <span
                  className="size-3 rounded-full"
                  style={{ background: severityMarkerColor[s] }}
                />
                {SEVERITY_LABELS[s]}
              </span>
            ))}
          </div>
        </div>

        <aside>
          <h3 className="mb-3 font-display text-base font-semibold">Highest priority nearby</h3>
          {nearby.length === 0 ? (
            <EmptyState
              title="Nothing in this filter"
              description="No reports match this category yet. Try another filter or view all issues."
            />
          ) : (
            <div className="grid gap-3">
              {nearby.map((report) => (
                <IssueCard key={report.id} report={report} />
              ))}
            </div>
          )}
        </aside>
      </div>
    </AppShell>
  );
}
