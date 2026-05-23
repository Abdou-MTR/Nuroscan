"use client";

/* ═══════════════════════════════════════════════════════════════
   NeuroScan AI — DashboardNavbar
   src/components/layout/DashboardNavbar.tsx

   Top navigation bar for authenticated portals. Rendered above
   the [Sidebar | Main] split. Shows the portal title, a
   notification bell, and the user avatar/name dropdown trigger.
   ═══════════════════════════════════════════════════════════════ */

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { AppUser } from "@/types";
import { ROUTES } from "@/data/constants";

// ── Types ──────────────────────────────────────────────────────

interface DashboardNavbarProps {
  user: AppUser;
  /** Page title shown centre-left, e.g. "Patient Dashboard" */
  portalTitle?: string;
  className?: string;
}

// ── Bell icon ──────────────────────────────────────────────────

function BellIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      fill="none"
      stroke="currentColor"
      className="w-[17px] h-[17px]"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
      />
    </svg>
  );
}

// ── Logout icon ────────────────────────────────────────────────

function LogoutIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      fill="none"
      stroke="currentColor"
      className="w-[15px] h-[15px]"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
      />
    </svg>
  );
}

// ── Component ─────────────────────────────────────────────────

export function DashboardNavbar({
  user,
  portalTitle,
  className,
}: DashboardNavbarProps) {
  const specialty =
    user.role === "doctor" ? user.specialty : "Patient Portal";

  return (
    <header
      className={cn(
        "flex items-center justify-between px-8 h-[62px] flex-shrink-0",
        className
      )}
      style={{
        background: "rgba(255,255,255,0.65)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.80)",
        boxShadow: "0 1px 20px rgba(14,165,233,0.08)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Left: Logo + Portal title */}
      <div className="flex items-center gap-3">
        {/* Logo mark */}
        <Link href={ROUTES.HOME} className="flex items-center gap-2 no-underline">
          <div
            className="w-[30px] h-[30px] rounded-[7px] flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
            style={{
              background: "linear-gradient(135deg,#38BDF8,#0284C7)",
              boxShadow: "0 3px 10px rgba(14,165,233,0.25)",
            }}
          >
            N
          </div>
        </Link>

        {/* Divider */}
        <div
          className="w-px h-4 flex-shrink-0"
          style={{ background: "rgba(14,165,233,0.18)" }}
        />

        {/* Portal title */}
        {portalTitle && (
          <span
            className="text-[14px] font-semibold tracking-[-0.1px]"
            style={{ color: "var(--ice-dark)" }}
          >
            {portalTitle}
          </span>
        )}
      </div>

      {/* Right: Actions + Avatar */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button
          className="relative w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200"
          style={{
            background: "rgba(14,165,233,0.06)",
            border: "1px solid rgba(14,165,233,0.14)",
            color: "var(--ice-text2)",
          }}
          aria-label="Notifications"
        >
          <BellIcon />
          {/* Unread dot */}
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--red)" }}
          />
        </button>

        {/* Avatar + name */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0"
            style={{
              background: user.avatarGradient,
              color: user.avatarTextColor,
            }}
          >
            {user.avatarInitials}
          </div>
          <div className="hidden sm:block">
            <div
              className="text-[12.5px] font-semibold leading-tight"
              style={{ color: "var(--ice-dark)" }}
            >
              {user.name}
            </div>
            <div
              className="text-[11px] leading-tight"
              style={{ color: "var(--ice-text3)" }}
            >
              {specialty}
            </div>
          </div>
        </div>

        {/* Logout */}
        <Link
          href={ROUTES.LOGIN}
          className={cn(
            "flex items-center gap-1.5 no-underline",
            "text-[12px] font-medium px-3 py-1.5 rounded-[7px]",
            "transition-colors duration-200"
          )}
          style={{
            color: "var(--ice-text3)",
            background: "rgba(14,165,233,0.05)",
            border: "1px solid rgba(14,165,233,0.12)",
          }}
        >
          <LogoutIcon />
          <span className="hidden sm:inline">Sign out</span>
        </Link>
      </div>
    </header>
  );
}

export default DashboardNavbar;
