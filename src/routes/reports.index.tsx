import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { IssueTable } from "@/components/civic/IssueTable";
import { EmptyState, ErrorState, LoadingState } from "@/components/civic/states";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { queries } from "@/lib/api";
import { CATEGORY_LABELS, STATUS_LABELS, SEVERITY_LABELS } from "@/types/civic";

export const Route = createFileRoute("/reports/")({
  head: () => ({
    meta: [
      { title: "Reports — CivicLens" },
      {
        name: "description",
        content: "Search, filter and triage every civic report by category, severity and status.",
      },
      { property: "og:title", content: "Reports — CivicLens" },
      {
        property: "og:description",
        content: "Search, filter and triage every civic report by category, severity and status.",
      },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  const { data, isLoading, isError, refetch } = useQuery(queries.reports());
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [severity, setSeverity] = useState("all");
  const [status, setStatus] = useState("all");
  const [period, setPeriod] = useState("all");

  const filtered = useMemo(() => {
    const cutoff = period === "all" ? 0 : Date.now() - Number(period) * 86_400_000;
    return (data ?? []).filter((r) => {
      if (search) {
        const hay = `${r.id} ${r.title} ${r.description} ${r.location.address}`.toLowerCase();
        if (!hay.includes(search.toLowerCase())) return false;
      }
      if (category !== "all" && r.analysis?.category !== category) return false;
      if (severity !== "all" && r.analysis?.severity !== severity) return false;
      if (status !== "all" && r.status !== status) return false;
      if (cutoff && new Date(r.createdAt).getTime() < cutoff) return false;
      return true;
    });
  }, [data, search, category, severity, status, period]);

  const reset = () => {
    setSearch("");
    setCategory("all");
    setSeverity("all");
    setStatus("all");
    setPeriod("all");
  };

  return (
    <AppShell
      title="Reports"
      subtitle={`${filtered.length} of ${data?.length ?? 0} reports match your filters.`}
      actions={
        <Button asChild>
          <Link to="/report">
            <Plus className="size-4" /> New report
          </Link>
        </Button>
      }
    >
      <div className="surface-card mb-5 rounded-xl p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by issue, ID or location…"
              className="ps-9"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <FilterSelect
              value={category}
              onChange={setCategory}
              placeholder="Category"
              options={Object.entries(CATEGORY_LABELS)}
            />
            <FilterSelect
              value={severity}
              onChange={setSeverity}
              placeholder="Severity"
              options={Object.entries(SEVERITY_LABELS)}
            />
            <FilterSelect
              value={status}
              onChange={setStatus}
              placeholder="Status"
              options={Object.entries(STATUS_LABELS)}
            />
            <FilterSelect
              value={period}
              onChange={setPeriod}
              placeholder="Date"
              options={[
                ["7", "Last 7 days"],
                ["30", "Last 30 days"],
                ["90", "Last 90 days"],
              ]}
            />
          </div>
          <Button variant="ghost" size="sm" onClick={reset} className="lg:ms-1">
            <SlidersHorizontal className="size-4" /> Reset
          </Button>
        </div>
      </div>

      {isLoading ? (
        <LoadingState label="Loading reports…" />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No reports match these filters"
          description="Try widening the date range or clearing a filter to see more civic reports."
          action={
            <Button variant="outline" size="sm" onClick={reset}>
              Clear filters
            </Button>
          }
        />
      ) : (
        <IssueTable reports={filtered} />
      )}
    </AppShell>
  );
}

function FilterSelect({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: [string, string][];
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="bg-background">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All {placeholder.toLowerCase()}</SelectItem>
        {options.map(([key, label]) => (
          <SelectItem key={key} value={key}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
