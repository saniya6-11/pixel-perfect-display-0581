import { Brain, Copy, Gauge, ShieldAlert, Sparkles, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { PriorityScore } from "./PriorityScore";
import { SeverityBadge } from "./badges";
import { CATEGORY_LABELS, type AIAnalysis } from "@/types/civic";

export function AiAnalysisCard({
  analysis,
  className,
  compact = false,
}: {
  analysis: AIAnalysis;
  className?: string;
  compact?: boolean;
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-soft)]",
        className,
      )}
    >
      <header className="hero-surface flex items-center justify-between gap-3 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-lg bg-white/10 text-white">
            <Brain className="size-5" aria-hidden />
          </span>
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-white">
              AI Analysis
            </p>
            <p className="text-xs text-white/65">Model verdict with confidence scoring</p>
          </div>
        </div>
        <Sparkles className="size-5 text-white/70" aria-hidden />
      </header>

      <div className="grid gap-6 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Category">
            <p className="font-display text-lg font-bold uppercase tracking-tight">
              {CATEGORY_LABELS[analysis.category]}
            </p>
          </Field>

          <Field label="Confidence">
            <div className="flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="accent-surface h-full rounded-full transition-all duration-700"
                  style={{ width: `${analysis.confidence}%` }}
                />
              </div>
              <span className="font-display text-sm font-bold tabular-nums">
                {analysis.confidence}%
              </span>
            </div>
          </Field>

          <Field label="Severity">
            <SeverityBadge severity={analysis.severity} />
          </Field>

          <Field label="Potential duplicates">
            <p className="text-sm">
              <span className="font-display text-lg font-bold">{analysis.duplicateCount}</span>{" "}
              <span className="text-muted-foreground">nearby reports may match</span>
            </p>
          </Field>
        </div>

        <PriorityScore score={analysis.priorityScore} label="Priority score" />
      </div>

      <div className="grid gap-3 border-t border-border p-5 sm:grid-cols-2">
        <Callout icon={ShieldAlert} title="Detected issue" body={analysis.detectedIssue} />
        <Callout icon={Wrench} title="Recommended action" body={analysis.recommendedAction} />
      </div>

      {!compact ? (
        <div className="border-t border-border p-5">
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Gauge className="size-4" aria-hidden /> Why this issue received this priority
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {analysis.factors.map((factor) => (
              <li key={factor.label} className="rounded-lg border border-border bg-background p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{factor.label}</span>
                  <span className="font-semibold">{factor.value}</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary/70"
                    style={{ width: `${Math.min(100, factor.weight)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  );
}

function Callout({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Copy;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className="size-4" aria-hidden /> {title}
      </p>
      <p className="mt-2 text-sm leading-relaxed">{body}</p>
    </div>
  );
}
