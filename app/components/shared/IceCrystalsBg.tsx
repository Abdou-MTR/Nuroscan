/* ═══════════════════════════════════════════════════════════════
   NeuroScan AI — IceCrystalsBg
   src/components/shared/IceCrystalsBg.tsx

   Decorative absolute-positioned layer rendered inside a
   position:relative container. Produces the signature Arctic Ice
   gradient orbs and frosted crystal circles visible on the
   landing page, login screen, and auth sections.

   Usage:
     <div className="relative overflow-hidden">
       <IceCrystalsBg />
       {children}
     </div>
   ═══════════════════════════════════════════════════════════════ */

import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────

type BgPreset = "landing" | "login" | "dashboard" | "minimal";

interface IceCrystalsBgProps {
  /** Layout preset; controls orb positions and crystal counts */
  preset?: BgPreset;
  className?: string;
}

// ── Orb definition ─────────────────────────────────────────────

interface OrbConfig {
  width: number;
  height: number;
  background: string;
  style: React.CSSProperties;
}

// ── Crystal definition ─────────────────────────────────────────

interface CrystalConfig {
  size: number;
  style: React.CSSProperties;
}

// ── Preset configurations ──────────────────────────────────────

const PRESETS: Record<
  BgPreset,
  { orbs: OrbConfig[]; crystals: CrystalConfig[] }
> = {
  landing: {
    orbs: [
      {
        width: 500,
        height: 400,
        background:
          "radial-gradient(ellipse,rgba(56,189,248,0.20),transparent 65%)",
        style: { top: -100, right: -80 },
      },
      {
        width: 350,
        height: 280,
        background:
          "radial-gradient(ellipse,rgba(14,165,233,0.10),transparent 65%)",
        style: { bottom: 50, left: -50 },
      },
    ],
    crystals: [
      { size: 200, style: { top: -60, right: 100, opacity: 0.6 } },
      { size: 120, style: { bottom: 80, left: 60, opacity: 0.5 } },
      { size: 80,  style: { top: 200, left: 200, opacity: 0.4 } },
    ],
  },
  login: {
    orbs: [
      {
        width: 400,
        height: 320,
        background:
          "radial-gradient(ellipse,rgba(56,189,248,0.15),transparent 65%)",
        style: { top: -80, right: -60 },
      },
      {
        width: 300,
        height: 240,
        background:
          "radial-gradient(ellipse,rgba(14,165,233,0.08),transparent 65%)",
        style: { bottom: 20, left: -40 },
      },
    ],
    crystals: [
      { size: 180, style: { top: -50, left: "15%", opacity: 0.50 } },
      { size: 100, style: { bottom: 60, right: "20%", opacity: 0.40 } },
      { size: 60,  style: { top: "40%", right: "8%", opacity: 0.30 } },
    ],
  },
  dashboard: {
    orbs: [
      {
        width: 320,
        height: 260,
        background:
          "radial-gradient(ellipse,rgba(56,189,248,0.12),transparent 65%)",
        style: { top: -60, right: 0 },
      },
    ],
    crystals: [
      { size: 140, style: { top: -40, right: 80, opacity: 0.40 } },
      { size: 80,  style: { bottom: 60, left: 40, opacity: 0.30 } },
    ],
  },
  minimal: {
    orbs: [
      {
        width: 260,
        height: 200,
        background:
          "radial-gradient(ellipse,rgba(56,189,248,0.10),transparent 65%)",
        style: { top: -40, right: -20 },
      },
    ],
    crystals: [
      { size: 100, style: { top: -30, right: 60, opacity: 0.35 } },
    ],
  },
};

// ── Component ─────────────────────────────────────────────────

export function IceCrystalsBg({
  preset = "landing",
  className,
}: IceCrystalsBgProps) {
  const config = PRESETS[preset];

  return (
    <div
      className={cn("absolute inset-0 pointer-events-none overflow-hidden", className)}
      aria-hidden="true"
    >
      {/* Gradient orbs */}
      {config.orbs.map((orb, i) => (
        <div
          key={`orb-${i}`}
          className="absolute rounded-full"
          style={{
            width: orb.width,
            height: orb.height,
            background: orb.background,
            filter: "blur(40px)",
            opacity: 0.5,
            ...orb.style,
          }}
        />
      ))}

      {/* Frosted crystal circles */}
      {config.crystals.map((crystal, i) => (
        <div
          key={`crystal-${i}`}
          className="absolute rounded-full"
          style={{
            width: crystal.size,
            height: crystal.size,
            background: "rgba(255,255,255,0.35)",
            border: "1px solid rgba(255,255,255,0.60)",
            ...crystal.style,
          }}
        />
      ))}
    </div>
  );
}

export default IceCrystalsBg;
