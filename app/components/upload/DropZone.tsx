// src/components/upload/DropZone.tsx
"use client";

import { useRef, useState, useCallback } from "react";
import type { UploadState } from "@/types";

interface DropZoneProps {
  uploadState: UploadState;
  onFileAccepted: (file: File) => void;
  onReset: () => void;
}

const ACCEPTED_MIME = [
  "image/jpeg",
  "image/png",
  "application/dicom",
  // NIfTI has no standard MIME; accept all .nii / .nii.gz via extension check
];

const ACCEPTED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".dcm", ".nii", ".gz"];

function isAccepted(file: File): boolean {
  const nameLower = file.name.toLowerCase();
  const extOk = ACCEPTED_EXTENSIONS.some((ext) => nameLower.endsWith(ext));
  const mimeOk = ACCEPTED_MIME.includes(file.type);
  return extOk || mimeOk;
}

export function DropZone({ uploadState, onFileAccepted, onReset }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragError, setDragError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      setDragError(null);
      if (!isAccepted(file)) {
        setDragError("Unsupported format. Please upload a JPG, PNG, DICOM, or NIfTI file.");
        return;
      }
      onFileAccepted(file);
    },
    [onFileAccepted]
  );

  // ── Drag events ──────────────────────────────────────────────────
  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }
  function onDragLeave(e: React.DragEvent) {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  }
  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }
  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input so the same file can be re-selected after a reset
    e.target.value = "";
  }

  // ── Render helpers ───────────────────────────────────────────────
  const { status, progress, file } = uploadState;
  const isIdle = status === "idle";
  const isUploading = status === "uploading";
  const isProcessing = status === "processing";
  const isDone = status === "done";
  const isError = status === "error";
  const isActive = isUploading || isProcessing || isDone;

  const progressLabel =
    isUploading
      ? `Uploading… ${Math.round(progress)}%`
      : isProcessing
      ? "Running AI analysis…"
      : isDone
      ? "Analysis complete — redirecting…"
      : "";

  return (
    <div className="flex flex-col gap-[14px]">
      {/* Drop zone area */}
      <div
        onDragOver={isIdle ? onDragOver : undefined}
        onDragLeave={isIdle ? onDragLeave : undefined}
        onDrop={isIdle ? onDrop : undefined}
        onClick={isIdle ? () => inputRef.current?.click() : undefined}
        className={`
          relative rounded-[16px] px-7 text-center transition-all duration-200 overflow-hidden
          border-2 border-dashed backdrop-blur-[12px]
          ${isIdle
            ? isDragging
              ? "border-[#0EA5E9] bg-white/60 cursor-copy"
              : "border-[rgba(14,165,233,0.25)] bg-white/40 hover:border-[#0EA5E9] hover:bg-white/60 cursor-pointer"
            : "border-[rgba(14,165,233,0.2)] bg-white/40 cursor-default"
          }
          ${isDone ? "border-[rgba(16,185,129,0.4)] bg-[rgba(16,185,129,0.04)]" : ""}
          ${isError ? "border-[rgba(239,68,68,0.4)] bg-[rgba(239,68,68,0.04)]" : ""}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.dcm,.nii,.nii.gz"
          className="hidden"
          onChange={onInputChange}
        />

        {/* ── IDLE STATE ── */}
        {isIdle && (
          <div className="py-[52px]">
            <div
              className={`
                w-[60px] h-[60px] rounded-[16px] mx-auto mb-[14px]
                flex items-center justify-center
                border border-[rgba(14,165,233,0.18)]
                transition-colors duration-200
                ${isDragging ? "bg-[rgba(14,165,233,0.14)]" : "bg-[rgba(14,165,233,0.08)]"}
              `}
            >
              <svg
                className="w-7 h-7 stroke-[#0284C7] fill-none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>

            <h3 className="text-[16px] font-semibold text-[#0A2540] mb-[6px]">
              {isDragging ? "Drop to upload" : "Drag & drop your MRI scan here"}
            </h3>
            <p className="text-[13px] text-[#355878] mb-5 leading-relaxed max-w-sm mx-auto">
              Or click to browse. Supports JPG, PNG, DICOM, and NIfTI formats.
            </p>

            <div className="flex gap-[8px] justify-center flex-wrap">
              {(["JPG", "PNG", "DICOM", "NIfTI"] as const).map((fmt) => (
                <span
                  key={fmt}
                  className="
                    bg-white/65 border border-[rgba(14,165,233,0.15)]
                    text-[#355878] text-[11px] font-medium
                    px-[10px] py-[4px] rounded-[6px]
                  "
                >
                  {fmt}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── ACTIVE STATE (uploading / processing / done) ── */}
        {isActive && file && (
          <div className="py-[40px] flex flex-col items-center">
            {/* File info */}
            <div className="flex items-center gap-[10px] mb-5">
              <div className="w-[44px] h-[44px] rounded-[10px] bg-gradient-to-br from-[#0A1E35] to-[#0E3550] flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 fill-none"
                  style={{ stroke: "rgba(255,255,255,0.5)" }}
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-[14px] font-semibold text-[#0A2540]">{file.name}</p>
                <p className="text-[12px] text-[#6B98BA]">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            {/* Progress bar */}
            {(isUploading || isProcessing) && (
              <div className="w-full max-w-sm mb-3">
                <div className="h-[6px] bg-[rgba(14,165,233,0.12)] rounded-full overflow-hidden">
                  <div
                    className={`
                      h-full rounded-full transition-all duration-300
                      ${isProcessing
                        ? "bg-gradient-to-r from-[#38BDF8] to-[#0284C7] animate-pulse w-full"
                        : "bg-gradient-to-r from-[#38BDF8] to-[#0284C7]"
                      }
                    `}
                    style={{ width: isProcessing ? "100%" : `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Status label */}
            <p
              className={`
                text-[13px] font-medium
                ${isDone ? "text-[#10B981]" : "text-[#355878]"}
              `}
            >
              {isDone ? (
                <span className="flex items-center gap-[6px]">
                  <svg className="w-4 h-4 stroke-[#10B981] fill-none" viewBox="0 0 24 24" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {progressLabel}
                </span>
              ) : (
                <>
                  {isProcessing && (
                    <span className="inline-block w-3 h-3 rounded-full bg-[#0EA5E9] mr-2 animate-ping" />
                  )}
                  {progressLabel}
                </>
              )}
            </p>
          </div>
        )}

        {/* ── ERROR STATE ── */}
        {isError && (
          <div className="py-[48px] flex flex-col items-center gap-3">
            <div className="w-[52px] h-[52px] rounded-[14px] bg-[rgba(239,68,68,0.1)] flex items-center justify-center">
              <svg className="w-6 h-6 stroke-[#EF4444] fill-none" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <p className="text-[14px] font-semibold text-[#EF4444]">Upload failed</p>
            <p className="text-[12px] text-[#355878]">{uploadState.errorMessage ?? "An unknown error occurred."}</p>
          </div>
        )}
      </div>

      {/* Drag error message */}
      {dragError && (
        <p className="text-[12px] text-[#EF4444] text-center">{dragError}</p>
      )}

      {/* Reset button */}
      {(isActive || isError) && (
        <button
          onClick={onReset}
          className="
            self-center text-[12.5px] text-[#6B98BA] font-medium
            hover:text-[#0284C7] transition-colors duration-150
            underline underline-offset-2
          "
        >
          Upload a different file
        </button>
      )}
    </div>
  );
}
