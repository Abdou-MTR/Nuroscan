// src/components/doctor/DiagnosisBreakdown.tsx
"use client";

import type { DoctorDashboardSummary } from "@/types";

interface DiagnosisBreakdownProps {
  summary: DoctorDashboardSummary;
}

const CARD_BASE = `
  bg-white/55 backdrop-blur-[16px]
  border border-white/75 rounded-[14px]
  px-[16px] py-[14px]
  shadow-[0_2px_12px_rgba(14,165,233,0.06)]
`;

export function DiagnosisBreakdown({ summary }: DiagnosisBreakdownProps) {
  return (
    <aside className="w-[260px] flex-shrink-0 flex flex-col gap-[12px]">

      {/* ── Total Patients ── */}
      <div className={CARD_BASE}>
        <p className="text-[11px] font-semibold text-[#6B98BA] tracking-[0.2px] uppercase mb-[5px]">
          Total Patients
        </p>
        <p className="text-[22px] font-bold text-[#0A2540] tracking-[-0.4px] leading-none">
          {summary.totalPatients}
        </p>
      </div>

      {/* ── Scans This Month ── */}
      <div className={CARD_BASE}>
        <p className="text-[11px] font-semibold text-[#6B98BA] tracking-[0.2px] uppercase mb-[5px]">
          Scans This Month
        </p>
        <p className="text-[22px] font-bold text-[#0A2540] tracking-[-0.4px] leading-none">
          {summary.scansThisMonth}
        </p>
      </div>

      {/* ── Diagnosis Breakdown ── */}
      <div className={CARD_BASE}>
        <p className="text-[11px] font-semibold text-[#6B98BA] tracking-[0.2px] uppercase mb-[10px]">
          Diagnosis Breakdown
        </p>

        {/* Stacked progress bar */}
        <div className="flex h-[6px] rounded-full overflow-hidden mb-[12px] gap-[1px]">
          {summary.breakdown.map((item) => (
            <div
              key={item.label}
              className="h-full transition-all duration-500"
              style={{
                width: `${item.percentage}%`,
                background: item.color,
                borderRadius: "999px",
              }}
              title={`${item.label}: ${item.percentage}%`}
            />
          ))}
        </div>

        {/* Row list */}
        <div className="flex flex-col gap-[6px]">
          {summary.breakdown.map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-[7px]">
                <span
                  className="w-[8px] h-[8px] rounded-full flex-shrink-0"
                  style={{ background: item.color }}
                />
                <span className="text-[12px] text-[#6B98BA]">{item.label}</span>
              </div>
              <span
                className="text-[12px] font-semibold"
                style={{ color: item.color }}
              >
                {item.count} ({item.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Pending Review ── */}
      <div
        className="
          bg-[rgba(245,158,11,0.07)] border border-[rgba(245,158,11,0.2)]
          rounded-[14px] px-[16px] py-[14px]
        "
      >
        <p className="text-[11px] font-semibold text-[#92400E] tracking-[0.2px] uppercase mb-[5px]">
          Pending Review
        </p>
        <div className="flex items-baseline gap-[6px]">
          <p className="text-[22px] font-bold text-[#F59E0B] tracking-[-0.4px] leading-none">
            {summary.pendingReview}
          </p>
          <p className="text-[11px] text-[#92400E]">scans awaiting review</p>
        </div>
        {summary.pendingReview > 0 && (
          <div className="mt-[9px] flex items-center gap-[6px]">
            <span className="w-[6px] h-[6px] rounded-full bg-[#F59E0B] animate-pulse" />
            <span className="text-[11px] text-[#92400E] font-medium">Action required</span>
          </div>
        )}
      </div>

      {/* ── Quick stats footer ── */}
      <div className={CARD_BASE}>
        <p className="text-[11px] font-semibold text-[#6B98BA] tracking-[0.2px] uppercase mb-[10px]">
          Model Info
        </p>
        {[
          { k: "Backbone",     v: "ResNet50V2 V5" },
          { k: "Test Accuracy", v: "98.05%"       },
          { k: "XAI Method",   v: "Grad-CAM"      },
          { k: "TTA Passes",   v: "10"            },
        ].map(({ k, v }) => (
          <div
            key={k}
            className="flex justify-between py-[4px] border-b border-[rgba(14,165,233,0.07)] last:border-b-0"
          >
            <span className="text-[11.5px] text-[#6B98BA]">{k}</span>
            <span className="text-[11.5px] font-semibold text-[#0A2540]">{v}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
