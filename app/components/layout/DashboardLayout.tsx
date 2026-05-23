/* ═══════════════════════════════════════════════════════════════
   NeuroScan AI — DashboardLayout
   src/components/layout/DashboardLayout.tsx

   Composes the full authenticated layout shell:
     [DashboardNavbar — full width]
     [Sidebar] | [Main content area]

   Accepts `role` and `user` to drive the sidebar and navbar.
   Both Patient and Doctor portals share this shell.
   ═══════════════════════════════════════════════════════════════ */

import type { ReactNode } from "react";
import type { UserRole, AppUser } from "@/types";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardNavbar }  from "./DashboardNavbar";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────

interface DashboardLayoutProps {
  role: UserRole;
  user: AppUser;
  children: ReactNode;
  /** Shown in the top navbar e.g. "Patient Dashboard" */
  portalTitle?: string;
  className?: string;
}

// ── Page Header sub-component ──────────────────────────────────

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-[26px]">
      <div>
        <h1
          className="text-[24px] font-bold tracking-[-0.5px]"
          style={{ color: "var(--ice-dark)" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-[13px] mt-0.5" style={{ color: "var(--ice-text3)" }}>
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex items-center gap-2.5">{action}</div>}
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────

export function DashboardLayout({
  role,
  user,
  children,
  portalTitle,
  className,
}: DashboardLayoutProps) {
  const defaultTitle =
    role === "patient" ? "Patient Dashboard" : "Clinician Portal";

  return (
    <div
      className={cn("flex flex-col", className)}
      style={{ background: "var(--ice-bg)", minHeight: "100vh" }}
    >
      {/* Top navbar — full width */}
      <DashboardNavbar
        user={user}
        portalTitle={portalTitle ?? defaultTitle}
      />

      {/* Sidebar + Main row */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <DashboardSidebar role={role} user={user} />

        {/* Main content */}
        <main className="flex-1 overflow-auto" style={{ padding: "32px" }}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
