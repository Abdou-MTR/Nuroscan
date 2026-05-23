// src/app/dashboard/upload/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DropZone } from "@/components/upload/DropZone";
import type { UploadState } from "@/types";

export default function UploadPage() {
  const router = useRouter();

  const [uploadState, setUploadState] = useState<UploadState>({
    file: null,
    progress: 0,
    status: "idle",
  });

  /**
   * Simulates an upload → processing pipeline.
   * In production, replace the setTimeout chain with a real fetch/API call.
   */
  function handleFileAccepted(file: File) {
    setUploadState({ file, progress: 0, status: "uploading" });

    // Simulate upload progress
    let progress = 0;
    const uploadInterval = setInterval(() => {
      progress += Math.random() * 18 + 8;
      if (progress >= 100) {
        clearInterval(uploadInterval);
        setUploadState((s) => ({ ...s, progress: 100, status: "processing" }));

        // Simulate AI processing delay
        setTimeout(() => {
          setUploadState((s) => ({ ...s, status: "done" }));
          // Navigate to the analysis page with the first mock scan
          setTimeout(() => router.push("/dashboard/analysis?scanId=scan-001"), 600);
        }, 2200);
      } else {
        setUploadState((s) => ({ ...s, progress: Math.min(progress, 99) }));
      }
    }, 160);
  }

  function handleReset() {
    setUploadState({ file: null, progress: 0, status: "idle" });
  }

  return (
    <div className="flex-1 p-8 overflow-auto">
      {/* ── Page Header ── */}
      <div className="mb-7">
        <h1 className="text-[24px] font-bold text-[#0A2540] tracking-[-0.5px]">
          Upload MRI Scan
        </h1>
        <p className="text-[13px] text-[#6B98BA] mt-[3px]">
          Upload a brain MRI image for AI-powered tumor classification
        </p>
      </div>

      {/* ── Main Content Grid ── */}
      <div className="grid grid-cols-[1fr_280px] gap-[18px]">
        {/* Drop zone */}
        <DropZone uploadState={uploadState} onFileAccepted={handleFileAccepted} onReset={handleReset} />

        {/* Instructions panel */}
        <div className="flex flex-col gap-[14px]">
          {/* How it works */}
          <div
            className="
              bg-white/55 backdrop-blur-[16px] border border-white/75
              rounded-[14px] p-[16px] shadow-[0_2px_12px_rgba(14,165,233,0.06)]
            "
          >
            <h3 className="text-[11px] font-bold text-[#6B98BA] tracking-[1.2px] uppercase mb-3">
              How it works
            </h3>
            <ol className="flex flex-col gap-[10px]">
              {[
                { n: "1", text: "Upload a JPG, PNG, DICOM, or NIfTI MRI image." },
                { n: "2", text: "The AI model runs 10 test-time augmentation passes." },
                { n: "3", text: "Grad-CAM heatmap highlights suspect regions." },
                { n: "4", text: "Review the full probability breakdown & download a PDF report." },
              ].map((step) => (
                <li key={step.n} className="flex items-start gap-[10px]">
                  <span
                    className="
                      w-[20px] h-[20px] rounded-full flex-shrink-0
                      bg-gradient-to-br from-[#38BDF8] to-[#0284C7]
                      text-white text-[10px] font-bold
                      flex items-center justify-center mt-[1px]
                    "
                  >
                    {step.n}
                  </span>
                  <span className="text-[12px] text-[#355878] leading-relaxed">{step.text}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Best practices */}
          <div
            className="
              bg-white/55 backdrop-blur-[16px] border border-white/75
              rounded-[14px] p-[16px] shadow-[0_2px_12px_rgba(14,165,233,0.06)]
            "
          >
            <h3 className="text-[11px] font-bold text-[#6B98BA] tracking-[1.2px] uppercase mb-3">
              Best Practices
            </h3>
            <ul className="flex flex-col gap-[8px]">
              {[
                "T1-weighted contrast-enhanced scans give best results",
                "Standard axial orientation recommended",
                "Minimum resolution: 224 × 224 px",
                "Ensure patient info is anonymized",
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-[8px]">
                  <svg
                    className="w-[13px] h-[13px] stroke-[#10B981] fill-none flex-shrink-0 mt-[2px]"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span className="text-[12px] text-[#355878] leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Supported formats */}
          <div
            className="
              bg-white/55 backdrop-blur-[16px] border border-white/75
              rounded-[14px] p-[16px] shadow-[0_2px_12px_rgba(14,165,233,0.06)]
            "
          >
            <h3 className="text-[11px] font-bold text-[#6B98BA] tracking-[1.2px] uppercase mb-3">
              Accepted Formats
            </h3>
            <div className="grid grid-cols-2 gap-[7px]">
              {(
                [
                  { fmt: "JPG", note: "JPEG images" },
                  { fmt: "PNG", note: "Lossless PNG" },
                  { fmt: "DICOM", note: ".dcm files" },
                  { fmt: "NIfTI", note: ".nii / .nii.gz" },
                ] as const
              ).map(({ fmt, note }) => (
                <div
                  key={fmt}
                  className="
                    bg-white/65 border border-[rgba(14,165,233,0.15)]
                    rounded-[8px] px-[10px] py-[8px]
                  "
                >
                  <div className="text-[12px] font-bold text-[#0A2540]">{fmt}</div>
                  <div className="text-[10.5px] text-[#6B98BA]">{note}</div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Disclaimer mini */}
          <div className="bg-[rgba(14,165,233,0.06)] border border-[rgba(14,165,233,0.18)] rounded-[12px] p-[13px]">
            <p className="text-[11px] text-[#355878] leading-relaxed">
              <span className="font-semibold text-[#0284C7]">Note: </span>
              Results are AI-assisted and for informational purposes only. Always
              consult a qualified radiologist for clinical decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
