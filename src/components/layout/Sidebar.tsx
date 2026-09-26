import { Link } from "@tanstack/react-router";
import { BarChart3, Brain, LayoutDashboard, Map, ScrollText, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/reports", label: "Reports", icon: ScrollText },
  { to: "/map", label: "Civic Map", icon: Map },
  { to: "/ai-analysis", label: "AI Analysis", icon: Brain },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
] as const;

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <Link
        to="/"
        onClick={onNavigate}
        className="flex items-center gap-2.5 px-5 py-5 text-sidebar-accent-foreground"
      >
        <span className="accent-surface grid size-9 place-items-center rounded-lg text-sidebar-primary-foreground">
          <ShieldCheck className="size-5" aria-hidden />
        </span>
        <span>
          <span className="block font-display text-base font-bold leading-tight">CivicLens</span>
          <span className="block text-[11px] tracking-wide text-sidebar-foreground/60">
            Civic issue intelligence
          </span>
        </span>
      </Link>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            activeProps={{
              className:
                "bg-sidebar-accent text-sidebar-accent-foreground shadow-[inset_2px_0_0_0_var(--sidebar-primary)]",
            }}
          >
            <item.icon className="size-4.5" aria-hidden />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className="rounded-lg bg-sidebar-accent p-4">
          <p className="font-display text-sm font-semibold text-sidebar-accent-foreground">
            Spotted an issue?
          </p>
          <p className="mt-1 text-xs text-sidebar-foreground/70">
            Submit it and get an AI priority score in seconds.
          </p>
          <Button asChild size="sm" className="mt-3 w-full">
            <Link to="/report" onClick={onNavigate}>
              Report an issue
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
