"use client";

/* ═══════════════════════════════════════════════════════════════
   NeuroScan AI — DashboardSidebar
   src/components/layout/DashboardSidebar.tsx

   Frosted-glass sidebar used in both the Patient Dashboard and
   Doctor Portal. Accepts a `role` prop and renders the correct
   nav items from constants.ts. Highlights the active route using
   Next.js usePathname().
   ═══════════════════════════════════════════════════════════════ */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { UserRole, AppUser } from "@/types";
import {
  PATIENT_NAV_ITEMS,
  PATIENT_ACCOUNT_NAV_ITEMS,
  DOCTOR_NAV_ITEMS,
  DOCTOR_ACCOUNT_NAV_ITEMS,
  ADMIN_NAV_ITEMS,
  ADMIN_ACCOUNT_NAV_ITEMS,
} from "@/data/constants";

// ── Types ──────────────────────────────────────────────────────

interface DashboardSidebarProps {
  role: UserRole;
  user: AppUser;
  className?: string;
}

interface NavItemConfig {
  label: string;
  href: string;
  iconPath: string;
}

// ── Icon component ─────────────────────────────────────────────

function NavIcon({ path }: { path: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      fill="none"
      stroke="currentColor"
      className="w-[15px] h-[15px] flex-shrink-0"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}

// ── Single nav item ────────────────────────────────────────────

function SidebarNavItem({
  item,
  active,
}: {
  item: NavItemConfig;
  active: boolean;
}) {
  return (
    <Link
      href={item.href}
      className={cn(
        "sidebar-item no-underline",
        active && "active"
      )}
    >
      <NavIcon path={item.iconPath} />
      <span>{item.label}</span>
    </Link>
  );
}

// ── Section label ──────────────────────────────────────────────

function SidebarSection({ label }: { label: string }) {
  return (
    <div
      className="text-[9.5px] font-bold tracking-[1.5px] uppercase px-[18px] pt-2 pb-0.5"
      style={{ color: "var(--ice-text3)" }}
    >
      {label}
    </div>
  );
}

// ── User footer ────────────────────────────────────────────────

function SidebarUserFooter({ user }: { user: AppUser }) {
  const specialty =
    user.role === "admin" ? "System Administrator" : user.role === "doctor" ? user.specialty : "Patient";

  return (
    <div
      className="mt-auto px-[18px] py-3.5 flex items-center gap-2.5"
      style={{ borderTop: "1px solid rgba(14,165,233,0.10)" }}
    >
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0"
        style={{
          padding: "8px 12px",
          marginRight: "8px",
          marginTop: "4px",
          background: user.avatarGradient,
          color: user.avatarTextColor,
        }}
      >
        {user.avatarInitials}
      </div>

      {/* Name + role */}
      <div className="min-w-0">
        <div
          className="text-[12.5px] font-semibold truncate"
          style={{ color: "var(--ice-dark)" }}
        >
          {user.name}
        </div>
        <div className="text-[11px]" style={{ color: "var(--ice-text3)" }}>
          {specialty}
        </div>
      </div>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────

export function DashboardSidebar({
  role,
  user,
  className,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const mainItems =
    role === "admin"
      ? ADMIN_NAV_ITEMS
      : role === "patient"
      ? PATIENT_NAV_ITEMS
      : DOCTOR_NAV_ITEMS;
  const accountItems =
    role === "admin"
      ? ADMIN_ACCOUNT_NAV_ITEMS
      : role === "patient"
      ? PATIENT_ACCOUNT_NAV_ITEMS
      : DOCTOR_ACCOUNT_NAV_ITEMS;

  const isActive = (href: string) => {
    // Exact match for root portal pages
    if (href === "/dashboard" || href === "/doctor" || href === "/admin") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn("ice-sidebar", className)}
      style={{ minHeight: "calc(100vh - 62px)" }}
    >
      {/* Brand mark */}
      

      {/* Main nav section */}
      <SidebarSection label="Main" />
      <nav>
        {mainItems.map((item) => (
          <SidebarNavItem
            key={item.href}
            item={item}
            active={isActive(item.href)}
          />
        ))}
      </nav>

      {/* Account section */}
      <SidebarSection label="Account" />
      <nav>
        {accountItems.map((item) => (
          <SidebarNavItem
            key={item.href}
            item={item}
            active={isActive(item.href)}
          />
        ))}
      </nav>

      {/* User footer */}
      <SidebarUserFooter user={user} />
    </aside>
  );
}

export default DashboardSidebar;
