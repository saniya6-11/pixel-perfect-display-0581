import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/civic-ui";
import type { TimelineEntry } from "@/types/civic";

export function StatusTimeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol className="relative space-y-5 ps-7">
      <span className="absolute left-[11px] top-2 bottom-2 w-px bg-border" aria-hidden />
      {entries.map((entry) => (
        <li key={entry.label} className="relative">
          <span
            className={cn(
              "absolute -left-7 top-0.5 grid size-6 place-items-center rounded-full border",
              entry.done
                ? "border-accent/40 bg-accent text-accent-foreground"
                : "border-border bg-card text-muted-foreground",
            )}
            aria-hidden
          >
            {entry.done ? (
              <Check className="size-3.5" />
            ) : (
              <span className="size-1.5 rounded-full bg-current" />
            )}
          </span>
          <p
            className={cn(
              "text-sm font-medium",
              entry.done ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {entry.label}
          </p>
          <p className="text-xs text-muted-foreground">
            {entry.at ? formatDate(entry.at) : "Pending"}
          </p>
        </li>
      ))}
    </ol>
  );
}
