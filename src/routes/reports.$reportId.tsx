import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays, ImageOff, MapPin, User } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { AiAnalysisCard } from "@/components/civic/AiAnalysisCard";
import { StatusTimeline } from "@/components/civic/StatusTimeline";
import { SeverityBadge, StatusBadge } from "@/components/civic/badges";
import { MapView } from "@/components/civic/MapView";
import { EmptyState, ErrorState, LoadingState } from "@/components/civic/states";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api, queries } from "@/lib/api";
import { formatDate } from "@/lib/civic-ui";
import { STATUS_LABELS, type IssueStatus } from "@/types/civic";
import { toast } from "sonner";

export const Route = createFileRoute("/reports/$reportId")({
  head: ({ params }) => ({
    meta: [
      { title: `Report ${params.reportId} — CivicLens` },
      {
        name: "description",
        content: "Full civic report detail: AI classification, priority reasoning and timeline.",
      },
      { property: "og:title", content: `Report ${params.reportId} — CivicLens` },
      {
        property: "og:description",
        content: "Full civic report detail: AI classification, priority reasoning and timeline.",
      },
    ],
  }),
  component: ReportDetail,
});

function ReportDetail() {
  const { reportId } = Route.useParams();
  const queryClient = useQueryClient();
  const { data, isLoading, isError, refetch } = useQuery(queries.report(reportId));

  const statusMutation = useMutation({
    mutationFn: (status: IssueStatus) => api.updateStatus(reportId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast.success("Status updated");
    },
    onError: () => toast.error("Couldn't update the status. Try again."),
  });

  return (
    <AppShell
      title={data?.title ?? "Report"}
      subtitle={data ? `${data.id} · reported ${formatDate(data.createdAt)}` : undefined}
      actions={
        <Button asChild variant="outline">
          <Link to="/reports">
            <ArrowLeft className="size-4" /> All reports
          </Link>
        </Button>
      }
    >
      {isLoading ? (
        <LoadingState label="Loading report…" />
      ) : isError || !data ? (
        <EmptyState
          title="Report not found"
          description="This report may have been removed or the link is out of date."
          action={
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          }
        />
      ) : (
        <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr] xl:items-start">
          <div className="space-y-5">
            <div className="surface-card overflow-hidden rounded-xl">
              {data.imageUrl ? (
                <img
                  src={data.imageUrl}
                  alt={data.title}
                  loading="lazy"
                  className="h-72 w-full object-cover sm:h-96"
                />
              ) : (
                <div className="flex h-56 flex-col items-center justify-center gap-2 bg-muted text-muted-foreground">
                  <ImageOff className="size-6" aria-hidden />
                  <p className="text-sm">No photo attached to this report</p>
                </div>
              )}
              <div className="space-y-4 p-5">
                <div className="flex flex-wrap items-center gap-2">
                  {data.analysis ? <SeverityBadge severity={data.analysis.severity} /> : null}
                  <StatusBadge status={data.status} />
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{data.description}</p>
                <dl className="grid gap-3 border-t border-border pt-4 text-sm sm:grid-cols-3">
                  <Meta icon={MapPin} label="Location" value={data.location.address} />
                  <Meta icon={CalendarDays} label="Reported" value={formatDate(data.createdAt)} />
                  <Meta icon={User} label="Reported by" value={data.reporter} />
                </dl>
              </div>
            </div>

            {data.analysis ? (
              <AiAnalysisCard analysis={data.analysis} />
            ) : (
              <EmptyState
                title="Not analyzed yet"
                description="This report hasn't been through the AI pipeline. Run an analysis to get a priority score."
              />
            )}
          </div>

          <div className="space-y-5">
            <div className="surface-card rounded-xl p-5">
              <h3 className="mb-3 font-display text-base font-semibold">Status</h3>
              <Select
                value={data.status}
                onValueChange={(v) => statusMutation.mutate(v as IssueStatus)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUS_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="surface-card rounded-xl p-5">
              <h3 className="mb-4 font-display text-base font-semibold">Status timeline</h3>
              <StatusTimeline entries={data.timeline} />
            </div>

            <div className="surface-card overflow-hidden rounded-xl">
              <h3 className="px-5 py-4 font-display text-base font-semibold">Location</h3>
              <div className="h-64 border-t border-border">
                <MapView
                  center={[data.location.lat, data.location.lng]}
                  zoom={15}
                  markers={
                    data.analysis
                      ? [
                          {
                            id: data.id,
                            lat: data.location.lat,
                            lng: data.location.lng,
                            address: data.location.address,
                            title: data.title,
                            severity: data.analysis.severity,
                            priority: data.analysis.priorityScore,
                          },
                        ]
                      : []
                  }
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {isError ? <ErrorState className="mt-5" onRetry={() => refetch()} /> : null}
    </AppShell>
  );
}

function Meta({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
        <Icon className="size-3.5" aria-hidden /> {label}
      </dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  );
}
