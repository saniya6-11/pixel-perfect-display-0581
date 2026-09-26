import { useRef, useState } from "react";
import { AlertCircle, ImagePlus, Trash2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MAX_BYTES = 6 * 1024 * 1024;

export function ImageUploader({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (dataUrl: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File | undefined) => {
    setError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("That file isn't an image. Use a JPG, PNG or HEIC photo.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Image is larger than 6 MB. Try a smaller photo.");
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => setError("We couldn't read that file. Please try again.");
    reader.onload = () => onChange(String(reader.result));
    reader.readAsDataURL(file);
  };

  if (value) {
    return (
      <div className="space-y-3">
        <div className="relative overflow-hidden rounded-xl border border-border">
          <img src={value} alt="Reported issue preview" className="h-64 w-full object-cover" />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="absolute right-3 top-3 shadow-[var(--shadow-soft)]"
            onClick={() => onChange(null)}
          >
            <Trash2 className="size-4" /> Remove
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Clear photos help the model classify the issue more confidently.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className={cn(
          "flex min-h-64 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-colors",
          dragging
            ? "border-accent bg-accent-soft"
            : "border-border bg-background hover:border-accent/60 hover:bg-accent-soft/40",
        )}
      >
        <span className="grid size-14 place-items-center rounded-full bg-accent-soft text-accent-foreground">
          {dragging ? (
            <ImagePlus className="size-6" aria-hidden />
          ) : (
            <UploadCloud className="size-6" aria-hidden />
          )}
        </span>
        <div>
          <p className="font-display text-base font-semibold">Upload an image of the issue</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Drag and drop a photo here, or click to browse. JPG or PNG, up to 6 MB.
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
      {error ? (
        <p className="flex items-center gap-2 text-sm text-critical">
          <AlertCircle className="size-4" aria-hidden /> {error}
        </p>
      ) : null}
    </div>
  );
}
