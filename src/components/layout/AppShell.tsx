import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Bell, Menu, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarContent } from "./Sidebar";

export function AppShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string | undefined;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-sidebar-border lg:block">
        <SidebarContent />
      </aside>

      <div className="lg:pl-64">
        <header className="glass-panel sticky top-0 z-30 flex flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Open navigation"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 border-0 p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <SidebarContent onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>

          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <span className="accent-surface grid size-8 place-items-center rounded-lg text-primary-foreground">
              <ShieldCheck className="size-4" aria-hidden />
            </span>
            <span className="font-display text-sm font-bold">CivicLens</span>
          </Link>

          <div className="relative ms-auto hidden max-w-sm flex-1 md:block">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input placeholder="Search reports, wards, categories…" className="ps-9" />
          </div>

          <div className="ms-auto flex items-center gap-1.5 md:ms-0">
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell className="size-5" />
              <span className="absolute right-2 top-2 size-2 rounded-full bg-critical" />
            </Button>
            <Avatar className="size-9 border border-border">
              <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                SA
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold sm:text-3xl">{title}</h1>
              {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
            </div>
            {actions}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
