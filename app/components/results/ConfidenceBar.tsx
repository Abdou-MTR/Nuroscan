// src/components/results/ConfidenceBar.tsx
"use client";

import type { DiagnosisClass } from "@/types";

interface ConfidenceBarProps {
  /** 0–100 confidence percentage */
  confidence: number;
  /** Used to colour the bar appropriately */
  diagnosis: DiagnosisClass;
}

const ACCENT_COLORS: Record<DiagnosisClass, { bar: string; label: string }> = {
  Glioma:      { bar: "#EF4444", label: "#991B1B" },
  Meningioma:  { bar: "#F59E0B", label: "#78350F" },
  Pituitary:   { bar: "#0EA5E9", label: "#0369A1" },
  "No Tumor":  { bar: "#10B981", label: "#065F46" },
};

/** Confidence tier label */
function confidenceTier(conf: number): string {
  if (conf >= 90) return "Very High";
  if (conf >= 75) return "High";
  if (conf >= 60) return "Moderate";
  return "Low";
}

export function ConfidenceBar({ confidence, diagnosis }: ConfidenceBarProps) {
  const colors = ACCENT_COLORS[diagnosis];

  return (
    <div
      className="
        bg-white/55 border border-white/75 rounded-[12px] p-[13px]
        shadow-[0_2px_12px_rgba(14,165,233,0.06)]
      "
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-[10px]">
        <p className="text-[10px] font-bold text-[#6B98BA] tracking-[1px] uppercase">
          AI Confidence
        </p>
        <span
          className="text-[10.5px] font-semibold px-[8px] py-[2px] rounded-full"
          style={{
            background: `${colors.bar}18`,
            color: colors.label,
            border: `1px solid ${colors.bar}30`,
          }}
        >
          {confidenceTier(confidence)}
        </span>
      </div>

      {/* Percentage display */}
      <div className="flex items-baseline gap-[4px] mb-[8px]">
        <span
          className="text-[28px] font-bold tracking-[-0.5px] leading-none"
          style={{ color: colors.bar }}
        >
          {confidence.toFixed(1)}
        </span>
        <span className="text-[14px] font-semibold text-[#6B98BA]">%</span>
      </div>

      {/* Bar */}
      <div className="h-[7px] bg-[rgba(14,165,233,0.1)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${confidence}%`,
            background: `linear-gradient(90deg, ${colors.bar}99, ${colors.bar})`,
          }}
        />
      </div>

      {/* Scale ticks */}
      <div className="flex justify-between mt-[4px]">
        {["0%", "25%", "50%", "75%", "100%"].map((t) => (
          <span key={t} className="text-[9.5px] text-[#6B98BA]">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
