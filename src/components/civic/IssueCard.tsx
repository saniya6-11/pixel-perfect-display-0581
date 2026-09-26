import { Link } from "@tanstack/react-router";
import { ArrowUpRight, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { relativeDays } from "@/lib/civic-ui";
import { SeverityBadge, StatusBadge } from "./badges";
import { PriorityBar } from "./PriorityScore";
import type { Report } from "@/types/civic";

export function IssueCard({ report, className }: { report: Report; className?: string }) {
  return (
    <Link
      to="/reports/$reportId"
      params={{ reportId: report.id }}
      className={cn(
        "surface-card lift-on-hover group block rounded-xl p-4 focus-visible:outline-2 focus-visible:outline-ring",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium tabular-nums text-muted-foreground">{report.id}</p>
          <h4 className="mt-0.5 truncate font-display text-sm font-semibold">{report.title}</h4>
        </div>
        <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:text-accent" />
      </div>

      <p className="mt-2 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
        <MapPin className="size-3.5 shrink-0" aria-hidden />
        {report.location.address}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {report.analysis ? <SeverityBadge severity={report.analysis.severity} /> : null}
        <StatusBadge status={report.status} />
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        {report.analysis ? (
          <PriorityBar score={report.analysis.priorityScore} />
        ) : (
          <span className="text-xs text-muted-foreground">Awaiting analysis</span>
        )}
        <span className="text-xs text-muted-foreground">{relativeDays(report.createdAt)}</span>
      </div>
    </Link>
  );
}
