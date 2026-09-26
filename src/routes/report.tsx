import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Loader2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ImageUploader } from "@/components/civic/ImageUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/report")({
  head: () => ({ meta: [{ title: "Report an Issue — CivicLens" }] }),
  component: ReportIssuePage,
});

function ReportIssuePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("12.9345");
  const [longitude, setLongitude] = useState("77.6101");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: () =>
      api.createReport({
        title: title.trim(),
        description: description.trim(),
        imageDataUrl,
        location: { address: address.trim(), lat: Number(latitude), lng: Number(longitude) },
      }),
    onSuccess: async (report) => {
      setError(null);
      toast.success("Report submitted and analyzed");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["reports"] }),
        queryClient.invalidateQueries({ queryKey: ["analytics"] }),
        queryClient.invalidateQueries({ queryKey: ["map-issues"] }),
      ]);
      await navigate({ to: "/reports/$reportId", params: { reportId: report.id } });
    },
    onError: (cause) =>
      setError(cause instanceof Error ? cause.message : "Couldn't submit this report."),
  });

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    createMutation.mutate();
  };

  return (
    <AppShell
      title="Report an Issue"
      subtitle="Share a civic issue and help your community get it resolved."
    >
      <form onSubmit={submit} className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr] xl:items-start">
        <section className="surface-card space-y-5 rounded-xl p-5 sm:p-6">
          <div className="space-y-2">
            <Label htmlFor="report-title">Issue title</Label>
            <Input
              id="report-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              minLength={3}
              maxLength={200}
              required
              placeholder="e.g. Large pothole near the school entrance"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="report-description">What happened?</Label>
            <Textarea
              id="report-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              minLength={3}
              maxLength={5000}
              required
              rows={6}
              placeholder="Describe the issue and how it affects people nearby."
            />
          </div>
          <div className="space-y-2">
            <Label>Photo (optional)</Label>
            <ImageUploader value={imageDataUrl} onChange={setImageDataUrl} />
          </div>
        </section>

        <aside className="surface-card space-y-5 rounded-xl p-5 sm:p-6">
          <div className="space-y-2">
            <Label htmlFor="report-location">Location name</Label>
            <Input
              id="report-location"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              required
              maxLength={200}
              placeholder="Street, landmark, or neighbourhood"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="report-latitude">Latitude</Label>
              <Input
                id="report-latitude"
                type="number"
                step="any"
                min="-90"
                max="90"
                value={latitude}
                onChange={(event) => setLatitude(event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="report-longitude">Longitude</Label>
              <Input
                id="report-longitude"
                type="number"
                step="any"
                min="-180"
                max="180"
                value={longitude}
                onChange={(event) => setLongitude(event.target.value)}
                required
              />
            </div>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Coordinates are prefilled with a demo location. Update them to place the report
            accurately on the civic map.
          </p>
          {error ? (
            <p
              role="alert"
              className="rounded-lg border border-critical/25 bg-critical-soft p-3 text-sm text-critical"
            >
              {error}
            </p>
          ) : null}
          <Button type="submit" className="w-full" disabled={createMutation.isPending}>
            {createMutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ArrowRight className="size-4" />
            )}
            {createMutation.isPending ? "Submitting…" : "Submit report"}
          </Button>
        </aside>
      </form>
    </AppShell>
  );
}
