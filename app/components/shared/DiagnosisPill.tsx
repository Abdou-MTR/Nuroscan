/* ═══════════════════════════════════════════════════════════════
   NeuroScan AI — DiagnosisPill
   src/components/shared/DiagnosisPill.tsx

   Colored pill badge for diagnosis labels, status labels,
   format tags, and model badges. Maps DiagnosisClass → variant
   automatically, or accepts an explicit variant override.
   ═══════════════════════════════════════════════════════════════ */

import type { DiagnosisClass, PillVariant, ScanStatus } from "@/types";
import { DIAGNOSIS_PILL_VARIANT } from "@/data/constants";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────

interface DiagnosisPillProps {
  /** The diagnosis label text (auto-maps to variant if no override given) */
  label: DiagnosisClass | ScanStatus | string;
  /** Explicit variant override; if omitted, derived from label */
  variant?: PillVariant;
  className?: string;
  /** Smaller size for sub-elements like table cells */
  size?: "default" | "xs";
}

// ── Variant → CSS classes ──────────────────────────────────────

const pillClasses: Record<PillVariant, string> = {
  red:   "pill pill-red",
  green: "pill pill-green",
  amber: "pill pill-amber",
  blue:  "pill pill-blue",
};

// ── Auto-map status strings → variant ─────────────────────────

const STATUS_VARIANT_MAP: Record<string, PillVariant> = {
  Critical: "red",
  Review:   "amber",
  Normal:   "green",
  Pending:  "amber",
};

function resolveVariant(
  label: string,
  override?: PillVariant
): PillVariant {
  if (override) return override;
  // Try diagnosis class map first
  if (label in DIAGNOSIS_PILL_VARIANT) {
    return DIAGNOSIS_PILL_VARIANT[label as DiagnosisClass];
  }
  // Try status map
  if (label in STATUS_VARIANT_MAP) {
    return STATUS_VARIANT_MAP[label];
  }
  // Fallback
  return "blue";
}

// ── Component ─────────────────────────────────────────────────

export function DiagnosisPill({
  label,
  variant,
  className,
  size = "default",
}: DiagnosisPillProps) {
  const resolved = resolveVariant(label, variant);

  return (
    <span
      className={cn(
        pillClasses[resolved],
        size === "xs" && "text-[9.5px] py-0.5 px-2",
        className
      )}
    >
      {label}
    </span>
  );
}

// ── Status Dot component (used in status badge pairs) ─────────

interface StatusDotProps {
  status: ScanStatus;
  className?: string;
}

const STATUS_DOT_BG: Record<ScanStatus, string> = {
  Critical: "bg-[#EF4444]",
  Review:   "bg-[#F59E0B]",
  Normal:   "bg-[#10B981]",
  Pending:  "bg-[#F59E0B]",
};

export function StatusDot({ status, className }: StatusDotProps) {
  return (
    <span
      className={cn(
        "inline-block w-1.5 h-1.5 rounded-full flex-shrink-0",
        STATUS_DOT_BG[status],
        className
      )}
    />
  );
}

// ── StatusBadge: dot + label inline ───────────────────────────

interface StatusBadgeProps {
  status: ScanStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[11.5px] font-medium",
        className
      )}
      style={{ color: "var(--ice-text2)" }}
    >
      <StatusDot status={status} />
      {status}
    </span>
  );
}

export default DiagnosisPill;
