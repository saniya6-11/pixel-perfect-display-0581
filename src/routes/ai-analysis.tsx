import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Brain, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AiAnalysisCard } from "@/components/civic/AiAnalysisCard";
import { EmptyState, ErrorState, LoadingState } from "@/components/civic/states";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { api, queries } from "@/lib/api";

export const Route = createFileRoute("/ai-analysis")({
  head: () => ({ meta: [{ title: "AI Analysis — CivicLens" }] }),
  component: AiAnalysisPage,
});

function AiAnalysisPage() {
  const queryClient = useQueryClient();
  const reports = useQuery(queries.reports());
  const analyze = useMutation({
    mutationFn: (id: string) => api.analyzeReport(id),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["reports"] }),
        queryClient.invalidateQueries({ queryKey: ["analytics"] }),
        queryClient.invalidateQueries({ queryKey: ["map-issues"] }),
      ]);
      toast.success("Report analysis complete");
    },
    onError: () => toast.error("Couldn't analyze this report. Try again."),
  });

  return (
    <AppShell
      title="AI Analysis"
      subtitle="Review classifications, confidence, priority, and recommended actions."
    >
      {reports.isLoading ? (
        <LoadingState label="Loading reports for analysis…" />
      ) : reports.isError ? (
        <ErrorState onRetry={() => reports.refetch()} />
      ) : reports.data?.length === 0 ? (
        <EmptyState
          title="No reports to analyze"
          description="New civic reports will appear here after submission."
          icon={Brain}
        />
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {(reports.data ?? []).map((report) => (
            <section key={report.id} className="space-y-3">
              <header className="surface-card flex flex-wrap items-center justify-between gap-3 rounded-xl p-4">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground">Report {report.id}</p>
                  <h2 className="truncate font-display font-semibold">{report.title}</h2>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => analyze.mutate(report.id)}
                  disabled={analyze.isPending}
                >
                  {analyze.isPending && analyze.variables === report.id ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Sparkles className="size-4" />
                  )}
                  {report.analysis ? "Re-analyze" : "Analyze"}
                </Button>
              </header>
              {report.analysis ? (
                <AiAnalysisCard analysis={report.analysis} compact />
              ) : (
                <EmptyState
                  title="Analysis pending"
                  description="Run the report through the civic triage service."
                />
              )}
            </section>
          ))}
        </div>
      )}
    </AppShell>
  );
}
