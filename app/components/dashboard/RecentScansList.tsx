// src/components/dashboard/RecentScansList.tsx
"use client";

import Link from "next/link";
import type { ScanRecord } from "@/types";
import { DIAGNOSIS_PILL_MAP } from "@/types";

const PILL_STYLES: Record<string, string> = {
  red: "bg-[rgba(239,68,68,0.08)] text-[#EF4444] border border-[rgba(239,68,68,0.18)]",
  green: "bg-[rgba(16,185,129,0.08)] text-[#10B981] border border-[rgba(16,185,129,0.2)]",
  amber: "bg-[rgba(245,158,11,0.08)] text-[#92400E] border border-[rgba(245,158,11,0.2)]",
  blue: "bg-[rgba(14,165,233,0.08)] text-[#0284C7] border border-[rgba(14,165,233,0.18)]",
};

const STATUS_DOT: Record<string, string> = {
  Critical: "bg-[#EF4444]",
  Review: "bg-[#F59E0B]",
  Normal: "bg-[#10B981]",
  Pending: "bg-[#F59E0B]",
};

interface RecentScansListProps {
  /** All scans for the active patient, newest-first */
  scans: ScanRecord[];
  /** Max items to render (default 5) */
  limit?: number;
}

export function RecentScansList({ scans, limit = 5 }: RecentScansListProps) {
  const visible = scans.slice(0, limit);

  return (
    <div
      className="
        bg-white/55 backdrop-blur-[20px]
        border border-white/75 rounded-[16px]
        shadow-[0_4px_24px_rgba(14,165,233,0.08)]
        overflow-hidden
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between px-[18px] py-[16px] border-b border-[rgba(14,165,233,0.1)]">
        <span className="text-[13.5px] font-semibold text-[#0A2540]">Recent Scans</span>
        <Link
          href="/dashboard/analysis"
          className="text-[12px] text-[#0284C7] font-medium hover:text-[#0EA5E9] transition-colors"
        >
          View all
        </Link>
      </div>

      {/* Scan items */}
      {visible.length === 0 ? (
        <div className="px-[18px] py-[28px] text-center text-[13px] text-[#6B98BA]">
          No scans uploaded yet.
        </div>
      ) : (
        visible.map((scan) => {
          const pillVariant = DIAGNOSIS_PILL_MAP[scan.primaryDiagnosis];
          const pillClass = PILL_STYLES[pillVariant] ?? PILL_STYLES.blue;
          const dotClass = STATUS_DOT[scan.status] ?? STATUS_DOT.Pending;

          const formattedDate = new Date(scan.scanDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });

          return (
            <Link
              key={scan.id}
              href={`/dashboard/analysis?scanId=${scan.id}`}
              className="
                flex items-center gap-[12px] px-[18px] py-[12px]
                border-b border-[rgba(14,165,233,0.07)] last:border-b-0
                cursor-pointer transition-colors duration-150
                hover:bg-[rgba(14,165,233,0.04)]
                group
              "
            >
              {/* Thumbnail */}
              <div
                className="
                  w-[38px] h-[38px] flex-shrink-0 rounded-[8px]
                  bg-gradient-to-br from-[#0A1E35] to-[#0E3550]
                  flex items-center justify-center
                "
              >
                <svg
                  className="w-4 h-4 fill-none flex-shrink-0"
                  style={{ stroke: "rgba(255,255,255,0.35)" }}
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>

              {/* Name & date */}
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-[#0A2540] truncate group-hover:text-[#0284C7] transition-colors">
                  {scan.fileName}
                </p>
                <p className="text-[11px] text-[#6B98BA] mt-[1px]">{formattedDate}</p>
              </div>

              {/* Diagnosis pill */}
              <span className={`text-[10.5px] font-semibold px-[10px] py-[3px] rounded-full flex-shrink-0 ${pillClass}`}>
                {scan.primaryDiagnosis}
              </span>

            </Link>
          );
        })
      )}
    </div>
  );
}
