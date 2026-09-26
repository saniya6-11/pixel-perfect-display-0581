import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AnalyticsInsight } from "@/types/civic";

const toneStyles: Record<AnalyticsInsight["tone"], string> = {
  accent: "border-accent/30 bg-accent-soft text-accent-foreground",
  critical: "border-critical/25 bg-critical-soft text-critical",
  warning: "border-warning/30 bg-warning-soft text-warning-foreground",
  success: "border-success/25 bg-success-soft text-success",
};

export function InsightCard({ insight }: { insight: AnalyticsInsight }) {
  return (
    <article className="surface-card lift-on-hover flex gap-4 rounded-xl p-5">
      <span
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-lg border",
          toneStyles[insight.tone],
        )}
      >
        <Sparkles className="size-5" aria-hidden />
      </span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="font-display text-sm font-semibold">{insight.title}</h4>
          <span
            className={cn(
              "rounded-full border px-2 py-0.5 text-xs font-semibold tabular-nums",
              toneStyles[insight.tone],
            )}
          >
            {insight.metric}
          </span>
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{insight.detail}</p>
      </div>
    </article>
  );
}
