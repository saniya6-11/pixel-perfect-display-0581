import { Link } from "@tanstack/react-router";
import { ArrowUpRight, MapPin } from "lucide-react";
import { SeverityBadge, StatusBadge } from "./badges";
import { PriorityBar } from "./PriorityScore";
import { relativeDays } from "@/lib/civic-ui";
import { CATEGORY_LABELS, type Report } from "@/types/civic";
import { Button } from "@/components/ui/button";

export function IssueTable({ reports }: { reports: Report[] }) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-xl border border-border bg-card lg:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/60 text-left">
              {["Issue", "Category", "Location", "Severity", "Priority", "Status", "Reported", ""].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr
                key={report.id}
                className="border-b border-border last:border-0 transition-colors hover:bg-accent-soft/40"
              >
                <td className="max-w-72 px-4 py-3">
                  <Link
                    to="/reports/$reportId"
                    params={{ reportId: report.id }}
                    className="block truncate font-medium hover:text-accent"
                  >
                    {report.title}
                  </Link>
                  <span className="text-xs tabular-nums text-muted-foreground">{report.id}</span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {report.analysis ? CATEGORY_LABELS[report.analysis.category] : "—"}
                </td>
                <td className="max-w-48 truncate px-4 py-3 text-muted-foreground">
                  {report.location.address}
                </td>
                <td className="px-4 py-3">
                  {report.analysis ? <SeverityBadge severity={report.analysis.severity} /> : "—"}
                </td>
                <td className="px-4 py-3">
                  {report.analysis ? <PriorityBar score={report.analysis.priorityScore} /> : "—"}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={report.status} />
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                  {relativeDays(report.createdAt)}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/reports/$reportId" params={{ reportId: report.id }}>
                      View <ArrowUpRight className="size-4" />
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile / tablet cards */}
      <div className="grid gap-3 lg:hidden">
        {reports.map((report) => (
          <Link
            key={report.id}
            to="/reports/$reportId"
            params={{ reportId: report.id }}
            className="surface-card rounded-xl p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs tabular-nums text-muted-foreground">{report.id}</p>
                <p className="truncate font-display text-sm font-semibold">{report.title}</p>
              </div>
              <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" />
            </div>
            <p className="mt-2 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" aria-hidden /> {report.location.address}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {report.analysis ? <SeverityBadge severity={report.analysis.severity} /> : null}
              <StatusBadge status={report.status} />
              {report.analysis ? <PriorityBar score={report.analysis.priorityScore} /> : null}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
