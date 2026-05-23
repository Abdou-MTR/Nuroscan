/* ═══════════════════════════════════════════════════════════════
   NeuroScan AI — MriThumbnail
   src/components/shared/MriThumbnail.tsx

   Renders a dark MRI scan preview tile used in the recent scans
   list, scan panels, and report sections. Three display modes:
   - "mri"     : Raw dark MRI oval shape
   - "heatmap" : Heat-map blob visualization
   - "overlay" : Overlay blend of both
   ═══════════════════════════════════════════════════════════════ */

import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────

type MriMode = "mri" | "heatmap" | "overlay";

interface MriThumbnailProps {
  mode?: MriMode;
  /** Size in px; default 38 (sidebar list) */
  size?: number;
  /** Use "panel" for large square analysis panels */
  variant?: "thumb" | "panel";
  className?: string;
  /** Show animated scanline; only used in hero / landing preview */
  scanline?: boolean;
}

// ── Background gradient per mode ───────────────────────────────

const BG_GRADIENT: Record<MriMode, string> = {
  mri:     "linear-gradient(135deg,#0A1E35,#0A2A40,#0E3550)",
  heatmap: "linear-gradient(135deg,#060508,#12050A)",
  overlay: "linear-gradient(135deg,#080E18,#0C1828)",
};

// ── MRI Shape (oval brain silhouette) ─────────────────────────

function MriShape({ withBlob = false }: { withBlob?: boolean }) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: "66%", height: "74%" }}
    >
      {/* Outer oval */}
      <div
        className="w-full h-full rounded-full relative"
        style={{
          border: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        {/* Inner core */}
        <div
          className="absolute rounded-full"
          style={{
            width: "30%",
            height: "34%",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
            top: "22%",
            left: "35%",
          }}
        />
        {/* Overlay tumor blob */}
        {withBlob && (
          <div
            className="absolute rounded-full"
            style={{
              width: "42px",
              height: "36px",
              background: "rgba(239,68,68,0.35)",
              filter: "blur(8px)",
              top: "26%",
              left: "18%",
            }}
          />
        )}
      </div>
    </div>
  );
}

// ── Heatmap Blobs ──────────────────────────────────────────────

function HeatBlobs() {
  return (
    <>
      <div
        className="absolute rounded-full"
        style={{
          width: "42%",
          height: "38%",
          background: "rgba(239,68,68,0.55)",
          filter: "blur(12px)",
          top: "28%",
          left: "22%",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: "28%",
          height: "24%",
          background: "rgba(245,158,11,0.40)",
          filter: "blur(10px)",
          top: "20%",
          left: "36%",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: "20%",
          height: "18%",
          background: "rgba(252,211,77,0.30)",
          filter: "blur(8px)",
          top: "48%",
          left: "18%",
        }}
      />
    </>
  );
}

// ── Component ─────────────────────────────────────────────────

export function MriThumbnail({
  mode = "mri",
  size = 38,
  variant = "thumb",
  className,
  scanline = false,
}: MriThumbnailProps) {
  const isPanel = variant === "panel";

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden flex-shrink-0",
        isPanel ? "w-full aspect-square" : "rounded-lg",
        className
      )}
      style={{
        background: BG_GRADIENT[mode],
        ...(variant === "thumb"
          ? { width: size, height: size, borderRadius: 8 }
          : {}),
      }}
    >
      {/* MRI shape */}
      {(mode === "mri" || mode === "overlay") && (
        <MriShape withBlob={mode === "overlay"} />
      )}

      {/* Heatmap blobs */}
      {(mode === "heatmap" || mode === "overlay") && <HeatBlobs />}

      {/* Scanline animation */}
      {scanline && <div className="mri-scanline" />}

      {/* Thumb fallback icon (shown when no blobs needed) */}
      {mode === "mri" && variant === "thumb" && (
        <svg
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          fill="none"
          stroke="rgba(255,255,255,0.30)"
          className="absolute"
          style={{ width: "50%", height: "50%" }}
        >
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" d="M12 7v5l3 3" />
        </svg>
      )}
    </div>
  );
}

export default MriThumbnail;
