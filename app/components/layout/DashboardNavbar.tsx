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



  
// ── Logout icon ────────────────────────────────────────────────

function LogoutIcon() {
  return (
    <button

                  title="Sign out"
                   className="text-[10px] font-semibold px-8 py-4 rounded-full tracking-[0.5px]"
        style={{
          padding: "8px 12px",
          background: "rgba(14,165,233,0.08)",
          color: "var(--ice-accent)",
          border: "1px solid rgba(14,165,233,0.18)",
          cursor: "pointer",
        }}
                >
                  Sign out
                  
                  
                </button>
  );
}


// ── Component ─────────────────────────────────────────────────

export function DashboardNavbar({

  user,
  
  className,
}: DashboardNavbarProps) {
  

  return (
    <header
      className={cn(
        "flex items-center justify-between  h-[62px] ",
        className
      )}
      style={{padding: "0 30px",
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
        <Link href={ROUTES.HOME} className="flex items-center gap-[9px] no-underline ml-8">
     
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
      {/* Right: Actions + Avatar */}
      <div className="flex items-center ">
      

        {/* Avatar + name */}
        <div className="flex items-center  cursor-pointer">
          <div
            className=" rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0"
            style={{
              background: user.avatarGradient,
              color: user.avatarTextColor,
              marginRight: "10px",
              padding: "8px 12px",
            }}
          >
            {user.avatarInitials}
          </div>
         
          
        </div>

        {/* Logout */}
        <Link
          href={ROUTES.HOME}
          className={cn(
            "flex items-center gap-1.5 no-underline",
            "text-[12px] font-medium px-3 py-1.5 rounded-[7px]",
            "transition-colors duration-200"
          )}
         
        >         

          <LogoutIcon />
        </Link>
      </div>
    </header>
  );
}

export default DashboardNavbar;
