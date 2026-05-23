// src/components/results/DiagnosisBadge.tsx
"use client";

import type { DiagnosisClass, ScanStatus } from "@/types";

interface DiagnosisBadgeProps {
  diagnosis: DiagnosisClass;
  confidence: number;
  status: ScanStatus;
}

type Theme = {
  panelBg: string;
  panelBorder: string;
  iconBg: string;
  iconStroke: string;
  titleColor: string;
  subColor: string;
};

const THEMES: Record<DiagnosisClass, Theme> = {
  Glioma: {
    panelBg: "rgba(239,68,68,0.08)",
    panelBorder: "rgba(239,68,68,0.18)",
    iconBg: "rgba(239,68,68,0.12)",
    iconStroke: "#DC2626",
    titleColor: "#991B1B",
    subColor: "#B91C1C",
  },
  Meningioma: {
    panelBg: "rgba(245,158,11,0.08)",
    panelBorder: "rgba(245,158,11,0.2)",
    iconBg: "rgba(245,158,11,0.12)",
    iconStroke: "#B45309",
    titleColor: "#78350F",
    subColor: "#92400E",
  },
  Pituitary: {
    panelBg: "rgba(14,165,233,0.08)",
    panelBorder: "rgba(14,165,233,0.18)",
    iconBg: "rgba(14,165,233,0.12)",
    iconStroke: "#0284C7",
    titleColor: "#0369A1",
    subColor: "#0284C7",
  },
  "No Tumor": {
    panelBg: "rgba(16,185,129,0.08)",
    panelBorder: "rgba(16,185,129,0.2)",
    iconBg: "rgba(16,185,129,0.12)",
    iconStroke: "#059669",
    titleColor: "#065F46",
    subColor: "#047857",
  },
};

/** The SVG icon path changes depending on severity */
function DiagnosisIcon({ diagnosis }: { diagnosis: DiagnosisClass }) {
  if (diagnosis === "No Tumor") {
    // Checkmark / shield
    return (
      <svg
        className="w-[18px] h-[18px] fill-none"
        style={{ stroke: THEMES["No Tumor"].iconStroke }}
        viewBox="0 0 24 24"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    );
  }

  // Warning triangle for any tumor
  return (
    <svg
      className="w-[18px] h-[18px] fill-none"
      style={{ stroke: THEMES[diagnosis].iconStroke }}
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  );
}

export function DiagnosisBadge({ diagnosis, confidence, status }: DiagnosisBadgeProps) {
  const theme = THEMES[diagnosis];

  const headlineText =
    diagnosis === "No Tumor"
      ? "No Tumor Detected"
      : `${diagnosis} Tumor Detected`;

  return (
    <div
      className="rounded-[12px] p-[14px]"
      style={{
        background: theme.panelBg,
        border: `1px solid ${theme.panelBorder}`,
      }}
    >
      {/* Top row: icon + title */}
      <div className="flex items-center gap-[10px] mb-[10px]">
        <div
          className="w-[36px] h-[36px] rounded-[9px] flex items-center justify-center flex-shrink-0"
          style={{ background: theme.iconBg }}
        >
          <DiagnosisIcon diagnosis={diagnosis} />
        </div>
        <div>
          <p
            className="text-[13px] font-bold leading-tight"
            style={{ color: theme.titleColor }}
          >
            {headlineText}
          </p>
          <p className="text-[11px] mt-[1px]" style={{ color: theme.subColor }}>
            Confidence: {confidence}% · Status: {status}
          </p>
        </div>
      </div>

      {/* Confidence bar */}
      <div
        className="h-[5px] rounded-full overflow-hidden"
        style={{ background: theme.iconBg }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${confidence}%`,
            background: theme.iconStroke,
          }}
        />
      </div>
    </div>
  );
}
