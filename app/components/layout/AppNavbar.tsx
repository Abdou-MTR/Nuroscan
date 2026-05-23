"use client";

/* ═══════════════════════════════════════════════════════════════
   NeuroScan AI — AppNavbar
   src/components/layout/AppNavbar.tsx

   Sticky glassmorphic top navigation bar.
   Used on the public landing page and login screen.
   Accepts an optional `activePage` prop to highlight current link.
   ═══════════════════════════════════════════════════════════════ */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { PUBLIC_NAV_LINKS, ROUTES } from "@/data/constants";

// ── Types ──────────────────────────────────────────────────────

interface AppNavbarProps {
  /** Hides the public nav links (used inside authenticated layouts) */
  hideLinks?: boolean;
  /** Hides the CTA buttons (used when nav is embedded in dash layouts) */
  hideActions?: boolean;
  className?: string;
}

// ── Logo mark ─────────────────────────────────────────────────

function NavLogo() {
  return (
    <Link href={ROUTES.HOME} className="flex items-center gap-[9px] no-underline">
      {/* Hex icon */}
      <div
        className="flex items-center justify-center w-[34px] h-[34px] rounded-[9px] text-white text-[14px] font-bold flex-shrink-0"
        style={{
          background: "linear-gradient(135deg,#38BDF8,#0284C7)",
          boxShadow: "0 4px 12px rgba(14,165,233,0.30)",
        }}
      >
        N
      </div>

      {/* Brand name */}
      <span
        className="text-[16px] font-bold tracking-[-0.3px]"
        style={{ color: "var(--ice-dark)" }}
      >
        NeuroScan
      </span>

      {/* AI badge */}
      <span
        className="text-[9px] font-semibold px-2 py-0.5 rounded-full tracking-[0.5px]"
        style={{
          background: "rgba(14,165,233,0.08)",
          color: "var(--ice-accent)",
          border: "1px solid rgba(14,165,233,0.18)",
        }}
      >
        AI
      </span>
    </Link>
  );
}

// ── Component ─────────────────────────────────────────────────

export function AppNavbar({
  hideLinks = false,
  hideActions = false,
  className,
}: AppNavbarProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn("ice-nav", className)}
      style={{ fontFamily: "var(--font-space-grotesk, 'Space Grotesk', sans-serif)" }}
    >
      {/* Logo */}
      <NavLogo />

      {/* Public nav links */}
      {!hideLinks && (
        <div className="flex items-center gap-7">
          {PUBLIC_NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href.replace("/#", "/"));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-[14px] font-medium no-underline transition-colors duration-200",
                  isActive
                    ? "text-[var(--ice-dark)]"
                    : "text-[var(--ice-text2)] hover:text-[var(--ice-dark)]"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}

      {/* CTA buttons */}
      {!hideActions && (
        <div className="flex items-center gap-2.5">
          <Link
            href={ROUTES.LOGIN}
            className={cn(
              "btn-ice-ghost text-[13px] font-semibold no-underline",
              "px-[18px] py-2 rounded-[8px] transition-all duration-200"
            )}
          >
            Log in
          </Link>
          <Link
            href={ROUTES.LOGIN}
            className={cn(
              "btn-ice-primary text-[13px] font-semibold no-underline",
              "px-[18px] py-2 rounded-[8px]"
            )}
          >
            Get started
          </Link>
        </div>
      )}
    </nav>
  );
}

export default AppNavbar;
