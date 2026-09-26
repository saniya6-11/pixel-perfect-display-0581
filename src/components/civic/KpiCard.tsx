import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "critical" | "success" | "accent";

const toneRing: Record<Tone, string> = {
  primary: "bg-primary-soft text-primary",
  critical: "bg-critical-soft text-critical",
  success: "bg-success-soft text-success",
  accent: "bg-accent-soft text-accent-foreground",
};

export function KpiCard({
  label,
  value,
  delta,
  icon: Icon,
  tone = "primary",
  hint,
}: {
  label: string;
  value: number | string;
  delta?: number;
  icon: LucideIcon;
  tone?: Tone;
  hint?: string;
}) {
  const positive = (delta ?? 0) >= 0;
  const Trend = positive ? TrendingUp : TrendingDown;
  return (
    <div className="surface-card lift-on-hover rounded-xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 font-display text-3xl font-bold tabular-nums">{value}</p>
        </div>
        <span className={cn("grid size-10 shrink-0 place-items-center rounded-lg", toneRing[tone])}>
          <Icon className="size-5" aria-hidden />
        </span>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs">
        {delta !== undefined ? (
          <span
            className={cn(
              "inline-flex items-center gap-1 font-semibold",
              positive ? "text-success" : "text-critical",
            )}
          >
            <Trend className="size-3.5" aria-hidden />
            {Math.abs(delta)}%
          </span>
        ) : null}
        <span className="text-muted-foreground">{hint ?? "vs last week"}</span>
      </div>
    </div>
  );
}
