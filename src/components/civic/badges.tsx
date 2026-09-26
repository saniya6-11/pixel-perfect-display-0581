import { AlertOctagon, AlertTriangle, CheckCircle2, CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";
import { severityStyles, statusStyles } from "@/lib/civic-ui";
import { SEVERITY_LABELS, STATUS_LABELS, type IssueStatus, type Severity } from "@/types/civic";

const severityIcon = {
  critical: AlertOctagon,
  high: AlertTriangle,
  medium: CircleDot,
  low: CheckCircle2,
} as const;

export function SeverityBadge({
  severity,
  className,
  showIcon = true,
}: {
  severity: Severity;
  className?: string;
  showIcon?: boolean;
}) {
  const Icon = severityIcon[severity];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide",
        severityStyles[severity],
        className,
      )}
    >
      {showIcon ? <Icon className="size-3.5" aria-hidden /> : null}
      {SEVERITY_LABELS[severity]}
    </span>
  );
}

export function StatusBadge({ status, className }: { status: IssueStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        statusStyles[status],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {STATUS_LABELS[status]}
    </span>
  );
}
