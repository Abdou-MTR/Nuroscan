// src/app/dashboard/analysis/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { getScanById, getPatientById } from "@/data/mock";
import { ScanViewTabs } from "@/components/upload/ScanViewTabs";
import { DiagnosisBadge } from "@/components/results/DiagnosisBadge";
import { ConfidenceBar } from "@/components/results/ConfidenceBar";
import { ProbabilityList } from "@/components/results/ProbabilityList";
import { AiDisclaimer } from "@/components/results/AiDisclaimer";

// ── Inner component so we can safely use useSearchParams ──────────
function AnalysisContent() {
  const params = useSearchParams();
  const scanId = params.get("scanId") ?? "scan-001";

  const scan = getScanById(scanId);
  const patient = scan ? getPatientById(scan.patientId) : undefined;

  if (!scan) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-[18px] font-bold text-[#0A2540] mb-2">Scan not found</p>
          <p className="text-[13px] text-[#6B98BA]">Scan ID &quot;{scanId}&quot; does not exist in records.</p>
        </div>
      </div>
    );
  }

  const scanDateFormatted = new Date(scan.scanDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex min-h-full">
      {/* ── Analysis Sidebar ── */}
      <aside
        className="
          w-[268px] flex-shrink-0
          bg-white/50 backdrop-blur-[20px]
          border-r border-white/75
          p-[22px_16px] flex flex-col gap-[14px]
          overflow-auto
        "
      >
        {/* Scan info */}
        <div>
          <p className="text-[10px] font-bold text-[#6B98BA] tracking-[1.2px] uppercase mb-[6px]">
            Scan Info
          </p>
          <div
            className="
              bg-white/55 border border-white/75 rounded-[12px] p-[13px]
              shadow-[0_2px_12px_rgba(14,165,233,0.06)]
            "
          >
            <h4 className="text-[10px] font-bold text-[#6B98BA] tracking-[1px] uppercase mb-[9px]">
              File Details
            </h4>
            {[
              { k: "File", v: scan.fileName },
              { k: "Format", v: scan.format },
              { k: "Size", v: `${scan.fileSizeMb} MB` },
              { k: "Image Type", v: scan.imageType },
              { k: "Scan Date", v: scanDateFormatted },
            ].map(({ k, v }) => (
              <div
                key={k}
                className="flex justify-between py-[5px] border-b border-[rgba(14,165,233,0.07)] last:border-b-0"
              >
                <span className="text-[12px] text-[#6B98BA]">{k}</span>
                <span className="text-[12px] text-[#0A2540] font-semibold">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Patient info */}
        {patient && (
          <div>
            <p className="text-[10px] font-bold text-[#6B98BA] tracking-[1.2px] uppercase mb-[6px]">
              Patient
            </p>
            <div
              className="
                bg-white/55 border border-white/75 rounded-[12px] p-[13px]
                shadow-[0_2px_12px_rgba(14,165,233,0.06)]
              "
            >
              {[
                { k: "Name", v: patient.name },
                { k: "ID", v: patient.patientId },
                {
                  k: "DOB",
                  v: new Date(patient.dateOfBirth).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }),
                },
              ].map(({ k, v }) => (
                <div
                  key={k}
                  className="flex justify-between py-[5px] border-b border-[rgba(14,165,233,0.07)] last:border-b-0"
                >
                  <span className="text-[12px] text-[#6B98BA]">{k}</span>
                  <span className="text-[12px] text-[#0A2540] font-semibold">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Diagnosis badge */}
        <DiagnosisBadge
          diagnosis={scan.primaryDiagnosis}
          confidence={scan.confidence}
          status={scan.status}
        />

        {/* Confidence bar */}
        <ConfidenceBar confidence={scan.confidence} diagnosis={scan.primaryDiagnosis} />

        {/* Probability list */}
        <ProbabilityList probabilities={scan.probabilities} />

        {/* Model info */}
        <div>
          <p className="text-[10px] font-bold text-[#6B98BA] tracking-[1.2px] uppercase mb-[6px]">
            Model
          </p>
          <div
            className="
              bg-white/55 border border-white/75 rounded-[12px] p-[13px]
              shadow-[0_2px_12px_rgba(14,165,233,0.06)]
            "
          >
            {[
              { k: "Backbone", v: `${scan.model.backbone} ${scan.model.version}` },
              { k: "Accuracy", v: `${scan.model.testAccuracy}%` },
              { k: "XAI", v: scan.model.xaiMethod },
              { k: "TTA Passes", v: scan.model.ttaPasses },
            ].map(({ k, v }) => (
              <div
                key={k}
                className="flex justify-between py-[5px] border-b border-[rgba(14,165,233,0.07)] last:border-b-0"
              >
                <span className="text-[12px] text-[#6B98BA]">{k}</span>
                <span className="text-[12px] text-[#0A2540] font-semibold">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-[8px] mt-auto pt-2">
          {scan.reportGenerated && scan.reportUrl ? (
            <a
              href={scan.reportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex-1 flex items-center justify-center gap-[6px]
                px-[10px] py-[10px] rounded-[9px]
                bg-gradient-to-br from-[#38BDF8] to-[#0284C7]
                text-white text-[12.5px] font-semibold
                shadow-[0_3px_10px_rgba(14,165,233,0.2)]
                hover:shadow-[0_5px_16px_rgba(14,165,233,0.35)]
                hover:-translate-y-px transition-all duration-200
              "
            >
              <svg className="w-3.5 h-3.5 stroke-white fill-none" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              PDF Report
            </a>
          ) : (
            <button
              disabled
              className="
                flex-1 flex items-center justify-center gap-[6px]
                px-[10px] py-[10px] rounded-[9px]
                bg-white/55 border border-[rgba(14,165,233,0.2)]
                text-[#6B98BA] text-[12.5px] font-semibold
                opacity-60 cursor-not-allowed
              "
            >
              No Report Yet
            </button>
          )}
          <button
            className="
              flex-1 flex items-center justify-center gap-[6px]
              px-[10px] py-[10px] rounded-[9px]
              bg-white/55 backdrop-blur-[8px]
              border border-[rgba(14,165,233,0.2)]
              text-[#355878] text-[12.5px] font-semibold
              hover:bg-white/80 hover:-translate-y-px transition-all duration-200
            "
            onClick={() => window.history.back()}
          >
            <svg className="w-3.5 h-3.5 stroke-[#355878] fill-none" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
            Back
          </button>
        </div>
      </aside>

      {/* ── Analysis Main ── */}
      <main className="flex-1 p-[28px] flex flex-col gap-[18px] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[20px] font-bold text-[#0A2540] tracking-[-0.4px]">
              Scan Analysis — {scan.fileName}
            </h1>
            <p className="text-[12px] text-[#6B98BA] mt-[2px]">
              {scan.imageType} · {scanDateFormatted} · {scan.format}
            </p>
          </div>

          {/* View tabs */}
          <ScanViewTabs />
        </div>

        {/* Three scan panels */}
        <div className="grid grid-cols-3 gap-[14px]">
          {[
            { label: "Original MRI", tag: "Raw scan", style: "raw" },
            { label: "Grad-CAM Heatmap", tag: "Grad-CAM", style: "heat" },
            { label: "Overlay", tag: "Overlay", style: "overlay" },
          ].map(({ label, tag, style }) => (
            <div
              key={label}
              className="
                bg-white/55 backdrop-blur-[16px]
                border border-white/75 rounded-[14px] overflow-hidden
                shadow-[0_4px_24px_rgba(14,165,233,0.08)]
              "
            >
              <div className="flex items-center justify-between px-[14px] py-[10px] border-b border-[rgba(14,165,233,0.08)]">
                <span className="text-[12px] font-semibold text-[#355878]">{label}</span>
                <span className="text-[9.5px] bg-[rgba(14,165,233,0.08)] text-[#0284C7] px-[7px] py-[2px] rounded-[5px] font-medium">
                  {tag}
                </span>
              </div>

              {/* MRI placeholder */}
              <div
                className={`
                  w-full aspect-square flex items-center justify-center relative overflow-hidden
                  ${style === "raw" ? "bg-gradient-to-br from-[#070E1A] via-[#0A1C2E] to-[#0B2240]" : ""}
                  ${style === "heat" ? "bg-gradient-to-br from-[#060508] to-[#12050A]" : ""}
                  ${style === "overlay" ? "bg-gradient-to-br from-[#080E18] to-[#0C1828]" : ""}
                `}
              >
                {/* Brain shape */}
                <div className="w-[66%] h-[74%] rounded-[50%] border border-white/[0.07] bg-white/[0.02] relative">
                  <div className="absolute w-[30%] h-[34%] rounded-[50%] bg-white/[0.04] border border-white/[0.06] top-[22%] left-[35%]" />
                </div>

                {/* Heatmap blobs (only on heat + overlay) */}
                {(style === "heat" || style === "overlay") && (
                  <>
                    <div className="absolute w-[80px] h-[70px] rounded-full bg-[rgba(239,68,68,0.55)] blur-[12px] top-[28%] left-[22%]" />
                    <div className="absolute w-[50px] h-[44px] rounded-full bg-[rgba(245,158,11,0.4)] blur-[12px] top-[20%] left-[36%]" />
                    <div className="absolute w-[36px] h-[30px] rounded-full bg-[rgba(252,211,77,0.3)] blur-[12px] top-[48%] left-[18%]" />
                  </>
                )}

                {/* Scan line animation on raw */}
                {style === "raw" && (
                  <div className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[rgba(14,165,233,0.4)] to-transparent animate-scan" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* AI Disclaimer */}
        <AiDisclaimer
          modelName={`${scan.model.backbone} ${scan.model.version}`}
          accuracy={scan.model.testAccuracy}
          xaiMethod={scan.model.xaiMethod}
          ttaPasses={scan.model.ttaPasses}
        />
      </main>
    </div>
  );
}

// ── Page wrapper with Suspense for useSearchParams ────────────────
export default function AnalysisPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center">
          <div className="text-[#6B98BA] text-[14px]">Loading analysis…</div>
        </div>
      }
    >
      <AnalysisContent />
    </Suspense>
  );
}
