// src/app/report/page.tsx
"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getScanById, getPatientById } from "@/data/mock";
import type { DiagnosisClass } from "@/types";

// ── Helpers ──────────────────────────────────────────────────────────────────

const DIAGNOSIS_THEME: Record<
  DiagnosisClass,
  { bg: string; border: string; iconBg: string; stroke: string; title: string; sub: string }
> = {
  Glioma: {
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.18)",
    iconBg: "rgba(239,68,68,0.12)",
    stroke: "#DC2626",
    title: "#991B1B",
    sub: "#B91C1C",
  },
  Meningioma: {
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.2)",
    iconBg: "rgba(245,158,11,0.12)",
    stroke: "#B45309",
    title: "#78350F",
    sub: "#92400E",
  },
  Pituitary: {
    bg: "rgba(14,165,233,0.08)",
    border: "rgba(14,165,233,0.18)",
    iconBg: "rgba(14,165,233,0.12)",
    stroke: "#0284C7",
    title: "#0369A1",
    sub: "#0284C7",
  },
  "No Tumor": {
    bg: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.2)",
    iconBg: "rgba(16,185,129,0.12)",
    stroke: "#059669",
    title: "#065F46",
    sub: "#047857",
  },
};

// ── Inner component ───────────────────────────────────────────────────────────

function ReportContent() {
  const params   = useSearchParams();
  const scanId   = params.get("scanId") ?? "scan-001";

  const scan    = getScanById(scanId);
  const patient = scan ? getPatientById(scan.patientId) : undefined;

  if (!scan || !patient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#C8E4F6] to-[#B8D8EE]">
        <p className="text-[#355878] text-[15px]">Report not found for scan &ldquo;{scanId}&rdquo;.</p>
      </div>
    );
  }

  const theme = DIAGNOSIS_THEME[scan.primaryDiagnosis];

  const scanDateFormatted = new Date(scan.scanDate).toLocaleDateString("en-US", {
    month: "long",
    day:   "numeric",
    year:  "numeric",
  });

  const dobFormatted = new Date(patient.dateOfBirth).toLocaleDateString("en-US", {
    month: "long",
    day:   "numeric",
    year:  "numeric",
  });

  const generatedAt = new Date().toLocaleDateString("en-US", {
    month: "short",
    day:   "numeric",
    year:  "numeric",
  });

  const diagnosisHeadline =
    scan.primaryDiagnosis === "No Tumor"
      ? "No Tumor Detected"
      : `${scan.primaryDiagnosis} Tumor Detected`;

  // Sort probabilities highest → lowest
  const sortedProbs = [...scan.probabilities].sort((a, b) => b.probability - a.probability);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#C8E4F6] to-[#B8D8EE] py-[50px] px-[40px] print:py-0 print:px-0 print:bg-white">

      {/* ── Report card ── */}
      <div
        className="
          max-w-[720px] mx-auto
          bg-white/75 backdrop-blur-[24px]
          border border-white/85 rounded-[22px]
          overflow-hidden
          shadow-[0_20px_60px_rgba(10,37,64,0.12)]
          print:shadow-none print:rounded-none print:border-none
        "
      >

        {/* ══ HEADER — dark gradient ══ */}
        <div className="bg-gradient-to-br from-[#0A2540] to-[#1A4A7A] px-[32px] py-[26px] flex items-center justify-between">
          <div>
            {/* Logo + title */}
            <div className="flex items-center gap-[9px] mb-[10px]">
              <div className="w-[30px] h-[30px] bg-gradient-to-br from-[#38BDF8] to-[#0284C7] rounded-[8px] flex items-center justify-center text-[12px] font-bold text-white flex-shrink-0">
                N
              </div>
              <span className="text-[13px] font-semibold text-white/80">NeuroScan AI</span>
              <span className="text-[9px] bg-white/10 border border-white/20 text-white/60 px-[8px] py-[2px] rounded-full font-semibold tracking-[0.5px]">
                MEDICAL REPORT
              </span>
            </div>
            <h1 className="text-[19px] font-bold text-white tracking-[-0.3px]">
              Medical Imaging Report
            </h1>
            <p className="text-[12px] text-white/50 mt-[2px]">
              NeuroScan AI · Generated {generatedAt}
            </p>
          </div>

          {/* Action buttons — hidden in print */}
          <div className="flex gap-[8px] print:hidden">
            <button
              onClick={() => window.print()}
              className="
                flex items-center gap-[6px]
                px-[15px] py-[8px] rounded-[8px]
                bg-white/10 border border-white/20 text-white/75
                text-[12px] font-semibold backdrop-blur-[8px]
                hover:bg-white/20 transition-colors duration-150
              "
            >
              <svg className="w-[13px] h-[13px] stroke-current fill-none" viewBox="0 0 24 24" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
              </svg>
              Save
            </button>

            {scan.reportUrl ? (
              <a
                href={scan.reportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex items-center gap-[6px]
                  px-[15px] py-[8px] rounded-[8px]
                  bg-gradient-to-br from-[#38BDF8] to-[#0284C7] text-white
                  text-[12px] font-semibold
                  shadow-[0_3px_10px_rgba(14,165,233,0.3)]
                  hover:shadow-[0_5px_16px_rgba(14,165,233,0.45)]
                  hover:-translate-y-px transition-all duration-150
                "
              >
                <svg className="w-[13px] h-[13px] stroke-white fill-none" viewBox="0 0 24 24" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download PDF
              </a>
            ) : (
              <button
                disabled
                className="
                  flex items-center gap-[6px] px-[15px] py-[8px] rounded-[8px]
                  bg-white/10 border border-white/15 text-white/40
                  text-[12px] font-semibold cursor-not-allowed
                "
              >
                No PDF Available
              </button>
            )}
          </div>
        </div>

        {/* ══ BODY ══ */}
        <div className="px-[32px] py-[30px]">

          {/* ── Meta grid: Patient + Scan info ── */}
          <div className="grid grid-cols-2 gap-[24px] mb-[26px] pb-[22px] border-b border-[rgba(14,165,233,0.1)]">

            {/* Patient info */}
            <div>
              <h4 className="text-[10px] font-bold text-[#6B98BA] tracking-[1.2px] uppercase mb-[9px]">
                Patient Info
              </h4>
              {[
                { k: "Name",        v: patient.name              },
                { k: "Patient ID",  v: patient.patientId         },
                { k: "Date of Birth", v: dobFormatted            },
                { k: "Scan Date",   v: scanDateFormatted         },
              ].map(({ k, v }) => (
                <div key={k} className="flex justify-between py-[4px]">
                  <span className="text-[12.5px] text-[#6B98BA]">{k}</span>
                  <span className="text-[12.5px] font-semibold text-[#0A2540]">{v}</span>
                </div>
              ))}
            </div>

            {/* Scan / model info */}
            <div>
              <h4 className="text-[10px] font-bold text-[#6B98BA] tracking-[1.2px] uppercase mb-[9px]">
                Scan Info
              </h4>
              {[
                { k: "Model",      v: `${scan.model.backbone} ${scan.model.version}` },
                { k: "Accuracy",   v: `${scan.model.testAccuracy}%`,                  },
                { k: "Image Type", v: scan.imageType                                  },
                { k: "Processing", v: `TTA (n=${scan.model.ttaPasses})`               },
              ].map(({ k, v }) => (
                <div key={k} className="flex justify-between py-[4px]">
                  <span className="text-[12.5px] text-[#6B98BA]">{k}</span>
                  <span
                    className="text-[12.5px] font-semibold"
                    style={{
                      color:
                        k === "Accuracy" ? "#0284C7" : "#0A2540",
                    }}
                  >
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Diagnosis panel ── */}
          <div
            className="rounded-[12px] p-[18px] mb-[22px] flex items-center gap-[14px]"
            style={{
              background: theme.bg,
              border: `1px solid ${theme.border}`,
            }}
          >
            {/* Icon */}
            <div
              className="w-[44px] h-[44px] rounded-[11px] flex items-center justify-center flex-shrink-0"
              style={{ background: theme.iconBg }}
            >
              {scan.primaryDiagnosis === "No Tumor" ? (
                <svg
                  className="w-[22px] h-[22px] fill-none"
                  style={{ stroke: theme.stroke }}
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              ) : (
                <svg
                  className="w-[22px] h-[22px] fill-none"
                  style={{ stroke: theme.stroke }}
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              )}
            </div>

            <div>
              <p
                className="text-[15px] font-bold"
                style={{ color: theme.title }}
              >
                {diagnosisHeadline} — Confidence: {scan.confidence}%
              </p>
              <p
                className="text-[12px] mt-[2px] leading-relaxed"
                style={{ color: theme.sub }}
              >
                AI-assisted diagnosis using {scan.model.backbone} {scan.model.version} with{" "}
                {scan.model.xaiMethod} localization. Please consult a qualified radiologist for
                clinical decisions.
              </p>
            </div>
          </div>

          {/* ── Scan image panels (3-up) ── */}
          <div className="grid grid-cols-3 gap-[10px] mb-[22px]">
            {[
              { label: "Original MRI",    style: "raw"     },
              { label: "Grad-CAM Heatmap", style: "heat"   },
              { label: "Overlay",          style: "overlay" },
            ].map(({ label, style }) => (
              <div
                key={label}
                className="rounded-[10px] overflow-hidden border border-[rgba(14,165,233,0.1)]"
              >
                {/* MRI placeholder image */}
                <div
                  className={`
                    w-full aspect-square flex items-center justify-center
                    relative overflow-hidden
                    ${style === "raw"     ? "bg-gradient-to-br from-[#070E1A] via-[#0A1C2E] to-[#0B2240]" : ""}
                    ${style === "heat"    ? "bg-gradient-to-br from-[#060508] to-[#12050A]"                : ""}
                    ${style === "overlay" ? "bg-gradient-to-br from-[#080E18] to-[#0C1828]"                : ""}
                  `}
                >
                  {/* Brain oval */}
                  <div className="w-[58%] h-[66%] rounded-[50%] border border-white/[0.07] bg-white/[0.02] relative">
                    <div className="absolute w-[30%] h-[34%] rounded-[50%] bg-white/[0.04] border border-white/[0.06] top-[22%] left-[35%]" />
                  </div>

                  {/* Heatmap blobs */}
                  {(style === "heat" || style === "overlay") && (
                    <>
                      <div className="absolute w-[65px] h-[56px] rounded-full bg-[rgba(239,68,68,0.55)] blur-[13px] top-[28%] left-[22%]" />
                      <div className="absolute w-[40px] h-[34px] rounded-full bg-[rgba(245,158,11,0.4)] blur-[10px] top-[20%] left-[38%]" />
                    </>
                  )}

                  {/* Scan line on raw */}
                  {style === "raw" && (
                    <div className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[rgba(14,165,233,0.4)] to-transparent animate-scan" />
                  )}
                </div>

                {/* Panel label */}
                <div className="px-[10px] py-[7px] text-[11px] text-[#6B98BA] font-medium bg-white/65">
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* ── Class Probabilities ── */}
          <div className="mb-[22px]">
            <p className="text-[13px] font-bold text-[#0A2540] mb-[12px]">
              Class Probabilities
            </p>

            <div className="flex flex-col gap-[9px]">
              {sortedProbs.map((prob) => (
                <div key={prob.label} className="flex items-center gap-[12px]">
                  <span className="text-[13px] text-[#355878] font-medium w-[96px] flex-shrink-0">
                    {prob.label}
                  </span>
                  <div className="flex-1 h-[7px] bg-[rgba(14,165,233,0.1)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${prob.probability}%`,
                        background: prob.color,
                      }}
                    />
                  </div>
                  <span className="text-[12.5px] font-bold text-[#0A2540] w-[36px] text-right flex-shrink-0">
                    {prob.probability}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Grad-CAM metadata row ── */}
          <div className="grid grid-cols-3 gap-[12px] mb-[4px]">
            {[
              { k: "Target Layer",   v: scan.gradCam.targetLayer          },
              { k: "Overlay Alpha",  v: scan.gradCam.overlayAlpha          },
              { k: "Training Images", v: scan.model.trainingImages.toLocaleString() },
            ].map(({ k, v }) => (
              <div
                key={k}
                className="
                  bg-[rgba(14,165,233,0.05)] border border-[rgba(14,165,233,0.12)]
                  rounded-[10px] px-[13px] py-[10px]
                "
              >
                <p className="text-[10px] font-semibold text-[#6B98BA] uppercase tracking-[0.8px] mb-[3px]">
                  {k}
                </p>
                <p className="text-[13px] font-bold text-[#0A2540]">{String(v)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ══ FOOTER ══ */}
        <div className="
          px-[32px] py-[18px]
          border-t border-[rgba(14,165,233,0.1)]
          bg-[rgba(14,165,233,0.03)]
          flex items-center justify-between
        ">
          <p className="text-[11px] text-[#6B98BA]">
            NeuroScan AI · For informational use only · Not a substitute for professional medical diagnosis
          </p>
          <p className="text-[11px] text-[#6B98BA]">
            {scan.model.backbone} {scan.model.version} · {scan.model.testAccuracy}% accuracy · {generatedAt}
          </p>
        </div>
      </div>

      {/* Bottom padding so footer breathes */}
      <div className="h-[50px] print:hidden" />
    </div>
  );
}

// ── Page export with Suspense ─────────────────────────────────────────────────
export default function ReportPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#C8E4F6] to-[#B8D8EE]">
          <p className="text-[#355878] text-[14px]">Loading report…</p>
        </div>
      }
    >
      <ReportContent />
    </Suspense>
  );
}
