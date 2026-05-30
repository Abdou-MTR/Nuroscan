"use client";

/* ═══════════════════════════════════════════════════════════════
   NeuroScan AI — AppNavbar
   src/components/layout/AppNavbar.tsx

   Sticky glassmorphic top navigation bar.
   Used on the public landing page and login screen.
   Auth-aware: shows user pill + Dashboard link when logged in.
   ═══════════════════════════════════════════════════════════════ */

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { PUBLIC_NAV_LINKS, ROUTES } from "@/data/constants";
import { createClient } from "@/lib/supabase/client";

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
     
      <div
        className="flex items-center justify-center w-[34px] h-[34px] rounded-[9px] text-white text-[14px] font-bold flex-shrink-0"
        style={{
          color: "#fff",
          background: "linear-gradient(135deg,#38BDF8,#0284C7)",
          boxShadow: "0 4px 12px rgba(14,165,233,0.30)",

        }}
      >
        N
      </div>

    
      <span
        className="text-[16px] font-semibold tracking-[-0.3px]"
        style={{ color: "var(--ice-dark)" ,fontSize: "16px", fontWeight: "600" }}
      >
        NeuroScan
      </span>

      {/* AI badge */}
      <span
        className="text-[9px] font-semibold px-8 py-1 rounded-full tracking-[0.5px]"
        style={{
          padding: "8px 8px",
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
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    
    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  };

  const userRole = user?.user_metadata?.role || "patient";
  const dashboardHref = userRole === "doctor" ? ROUTES.DOCTOR_OVERVIEW : ROUTES.PATIENT_DASHBOARD;
  const displayName = user?.user_metadata?.username || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

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
                style={{ color: isActive ? "var(--ice-dark)" : "var(--ice-text2)" , marginRight: "12px" }}
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

      {/* CTA buttons / User pill */}
      {!hideActions && (
        <div className="flex items-center gap-2.5">
          {loading ? (
            /* Skeleton while loading auth state */
            <div className="w-[120px] h-[36px] rounded-[8px] bg-[rgba(14,165,233,0.06)] animate-pulse" />
          ) : user ? (
            /* ── Logged-in state ── */
            <>
              <Link
                href={dashboardHref}
                className={cn(
                  "btn-ice-ghost text-[13px] font-semibold no-underline",
                  "px-[18px] py-2 rounded-[8px] transition-all duration-200"
                )}
              >
                Dashboard
              </Link>
              <div className="flex items-center gap-[8px] bg-white/60 border border-[rgba(14,165,233,0.18)] rounded-full pl-[10px] pr-[6px] py-[5px] backdrop-blur-[8px]">
                <div
                  className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg,#38BDF8,#0284C7)",
                    color: "#fff",
                  }}
                >
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <span className="text-[12px] font-semibold text-[#0A2540] max-w-[100px] truncate">
                  {displayName}
                </span>
                <button
                  onClick={handleSignOut}
              
                  title="Sign out"
                   className="text-[10px] font-semibold px-8 py-4 rounded-full tracking-[0.5px]"
        style={{
          padding: "8px 12px",
          background: "rgba(14,165,233,0.08)",
          color: "var(--ice-accent)",
          border: "1px solid rgba(14,165,233,0.18)",
        }}
                >
                  Sign out
                  
                  
                </button>
              </div>
            </>
          ) : (
            /* ── Logged-out state ── */
            <>
              <Link
                href={ROUTES.LOGIN}
                className={cn(
                  "btn-ice-ghost text-[13px] font-semibold no-underline",
                  "px-[18px] py-2 rounded-[8px] transition-all duration-200"
                )}
                style={{  marginRight: "8px" }}
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
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default AppNavbar;
