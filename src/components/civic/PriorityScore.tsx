import { cn } from "@/lib/utils";
import { priorityTone } from "@/lib/civic-ui";
import type { Severity } from "@/types/civic";

const toneColor: Record<Severity, string> = {
  critical: "var(--critical)",
  high: "var(--high)",
  medium: "var(--warning)",
  low: "var(--success)",
};

const toneText: Record<Severity, string> = {
  critical: "text-critical",
  high: "text-high",
  medium: "text-warning-foreground",
  low: "text-success",
};

export function PriorityScore({
  score,
  size = 96,
  label = "Priority",
  className,
}: {
  score: number;
  size?: number;
  label?: string;
  className?: string;
}) {
  const tone = priorityTone(score);
  const color = toneColor[tone];
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div
        className="relative grid place-items-center rounded-full"
        style={{
          width: size,
          height: size,
          background: `conic-gradient(${color} ${score * 3.6}deg, color-mix(in oklab, var(--muted) 85%, transparent) 0deg)`,
        }}
      >
        <div
          className="grid place-items-center rounded-full bg-card"
          style={{ width: size - 16, height: size - 16 }}
        >
          <span className={cn("font-display text-2xl font-bold leading-none", toneText[tone])}>
            {score}
          </span>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">/ 100</span>
        </div>
      </div>
      {label ? (
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      ) : null}
    </div>
  );
}

export function PriorityBar({ score, className }: { score: number; className?: string }) {
  const tone = priorityTone(score);
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${score}%`, background: toneColor[tone] }}
        />
      </div>
      <span className={cn("text-sm font-semibold tabular-nums", toneText[tone])}>{score}</span>
    </div>
  );
}
