"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Crown,
  LayoutDashboard,
  BedDouble,
  Bot,
  ConciergeBell,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Menu,
  LogOut,
  Home,
} from "lucide-react";
import { User, UserRole } from "@/types/auth.types";
import { useAuth } from "@/hooks/use-auth";
import { siteConfig } from "@/content/site.config";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  {
    title: "Analytics Overview",
    href: "/admin",
    icon: LayoutDashboard,
    roles: ["SUPER_ADMIN", "ADMIN"],
  },
  {
    title: "Room Inventory",
    href: "/admin/rooms",
    icon: BedDouble,
    roles: ["SUPER_ADMIN", "ADMIN"],
  },
  {
    title: "Room Rack & Desk",
    href: "/front-desk",
    icon: ConciergeBell,
    roles: ["SUPER_ADMIN", "ADMIN", "FRONT_DESK"],
  },
  {
    title: "Housekeeping Kanban",
    href: "/housekeeping",
    icon: Sparkles,
    roles: ["SUPER_ADMIN", "ADMIN", "HOUSEKEEPING"],
  },
  {
    title: "AI Control Center",
    href: "/agent-control",
    icon: Bot,
    roles: ["SUPER_ADMIN", "ADMIN", "FRONT_DESK"],
  },
];

const roleBadgeMap: Record<UserRole, { label: string; className: string }> = {
  SUPER_ADMIN: { label: "Super Admin", className: "border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400" },
  ADMIN: { label: "Admin", className: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  FRONT_DESK: { label: "Front Desk", className: "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  HOUSEKEEPING: { label: "Housekeeping", className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  GUEST: { label: "Guest", className: "border-slate-500/30 bg-slate-500/10 text-slate-600 dark:text-slate-400" },
};

interface DashboardShellProps {
  user: User;
  children: React.ReactNode;
}

export function DashboardShell({ user, children }: DashboardShellProps) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = React.useState(false);

  const filteredNav = navItems.filter((item) => item.roles.includes(user.role));
  const roleBadge = roleBadgeMap[user.role] || roleBadgeMap.GUEST;

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col border-r border-border/40 bg-card/50 backdrop-blur-md transition-all duration-300 relative z-30",
          collapsed ? "w-20" : "w-64"
        )}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border/40">
          <Link href="/" className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Crown className="h-5 w-5" />
            </div>
            {!collapsed && (
              <span className="font-serif font-bold text-sm tracking-tight truncate">
                {siteConfig.name}
              </span>
            )}
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* User Profile Pill */}
        <div className={cn("p-4 border-b border-border/40", collapsed && "px-2 text-center")}>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted font-bold text-xs border border-border/50">
              {user.name ? user.name.slice(0, 2).toUpperCase() : "US"}
            </div>
            {!collapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-semibold truncate">{user.name}</span>
                <Badge variant="outline" className={cn("w-fit text-[10px] py-0 px-1.5 font-medium mt-0.5", roleBadge.className)}>
                  {roleBadge.label}
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {filteredNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  collapsed && "justify-center px-0"
                )}
                title={collapsed ? item.title : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-border/40 space-y-1">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors",
              collapsed && "justify-center px-0"
            )}
          >
            <Home className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Hotel Homepage</span>}
          </Link>
          <button
            onClick={() => logout()}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors",
              collapsed && "justify-center px-0"
            )}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b border-border/40 bg-card/30 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {/* Mobile Sheet Drawer Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open navigation</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <SheetHeader className="p-4 border-b border-border/40">
                  <SheetTitle className="flex items-center gap-2 font-serif text-base">
                    <Crown className="h-5 w-5 text-primary" />
                    {siteConfig.name}
                  </SheetTitle>
                </SheetHeader>
                <div className="p-4 border-b border-border/40 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted font-bold text-xs">
                    {user.name ? user.name.slice(0, 2).toUpperCase() : "US"}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{user.name}</span>
                    <Badge variant="outline" className={cn("w-fit text-[10px] py-0 px-1.5 font-medium mt-0.5", roleBadge.className)}>
                      {roleBadge.label}
                    </Badge>
                  </div>
                </div>
                <nav className="p-3 space-y-1">
                  {filteredNav.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground font-semibold"
                            : "text-muted-foreground hover:bg-accent"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>

            {/* Breadcrumb Title */}
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="text-muted-foreground">Operations</span>
              <span className="text-muted-foreground/40">/</span>
              <span className="text-foreground font-semibold capitalize">
                {pathname.split("/").filter(Boolean).pop() || "Dashboard"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </header>

        {/* Page Content Slot */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
