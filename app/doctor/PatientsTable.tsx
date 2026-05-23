// src/components/doctor/PatientsTable.tsx
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { PatientTableRow } from "@/types";
import { DIAGNOSIS_PILL_MAP } from "@/types";

interface PatientsTableProps {
  rows: PatientTableRow[];
}

const PILL_STYLES: Record<string, string> = {
  red:   "bg-[rgba(239,68,68,0.08)]   text-[#EF4444] border border-[rgba(239,68,68,0.18)]",
  green: "bg-[rgba(16,185,129,0.08)]  text-[#10B981] border border-[rgba(16,185,129,0.2)]",
  amber: "bg-[rgba(245,158,11,0.08)]  text-[#92400E] border border-[rgba(245,158,11,0.2)]",
  blue:  "bg-[rgba(14,165,233,0.08)]  text-[#0284C7] border border-[rgba(14,165,233,0.18)]",
};

const STATUS_DOT: Record<string, string> = {
  Critical: "bg-[#EF4444]",
  Review:   "bg-[#F59E0B]",
  Normal:   "bg-[#10B981]",
  Pending:  "bg-[#F59E0B]",
};

export function PatientsTable({ rows }: PatientsTableProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.patientId.toLowerCase().includes(q) ||
        r.lastDiagnosis.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q)
    );
  }, [rows, query]);

  return (
    <div
      className="
        flex-1 min-w-0
        bg-white/55 backdrop-blur-[20px]
        border border-white/75 rounded-[16px]
        shadow-[0_4px_24px_rgba(14,165,233,0.08)]
        overflow-hidden
      "
    >
      {/* ── Card header ── */}
      <div className="flex items-center justify-between px-[18px] py-[16px] border-b border-[rgba(14,165,233,0.1)]">
        <span className="text-[13.5px] font-semibold text-[#0A2540]">
          Patient Records
        </span>

        {/* Search box */}
        <div className="flex items-center gap-[8px] bg-white/60 border border-[rgba(14,165,233,0.18)] rounded-[9px] px-[12px] py-[8px] w-[240px] backdrop-blur-[8px]">
          <svg
            className="w-[14px] h-[14px] fill-none flex-shrink-0"
            style={{ stroke: "#6B98BA" }}
            viewBox="0 0 24 24"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search patients…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="
              bg-transparent border-none outline-none
              text-[13px] text-[#0A2540] w-full
              placeholder:text-[#6B98BA]
              font-[inherit]
            "
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-[#6B98BA] hover:text-[#0A2540] transition-colors flex-shrink-0"
            >
              <svg className="w-[12px] h-[12px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["Patient", "Last Scan", "Diagnosis", "Confidence", "Status", ""].map((h) => (
                <th
                  key={h}
                  className="
                    px-[18px] py-[11px] text-left
                    text-[11.5px] font-semibold text-[#6B98BA]
                    tracking-[0.3px] uppercase
                    bg-[rgba(14,165,233,0.04)]
                    border-b border-[rgba(14,165,233,0.1)]
                  "
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-[18px] py-[28px] text-center text-[13px] text-[#6B98BA]">
                  No patients match &ldquo;{query}&rdquo;.
                </td>
              </tr>
            ) : (
              filtered.map((row) => {
                const pillVariant = DIAGNOSIS_PILL_MAP[row.lastDiagnosis];
                const pillClass   = PILL_STYLES[pillVariant] ?? PILL_STYLES.blue;
                const dotClass    = STATUS_DOT[row.status]   ?? STATUS_DOT.Pending;

                return (
                  <tr
                    key={row.patientId}
                    className="
                      border-b border-[rgba(14,165,233,0.06)]
                      last:border-b-0
                      hover:bg-white/40 transition-colors duration-150
                      group
                    "
                  >
                    {/* Patient cell */}
                    <td className="px-[18px] py-[12px]">
                      <div className="flex items-center gap-[10px]">
                        <div
                          className="w-[32px] h-[32px] rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0"
                          style={{
                            background: row.avatarGradient,
                            color: row.avatarTextColor,
                          }}
                        >
                          {row.initials}
                        </div>
                        <div>
                          <p className="text-[13.5px] font-semibold text-[#0A2540]">
                            {row.name}
                          </p>
                          <p className="text-[11px] text-[#6B98BA]">{row.patientId}</p>
                        </div>
                      </div>
                    </td>

                    {/* Last scan date */}
                    <td className="px-[18px] py-[12px] text-[13.5px] text-[#6B98BA]">
                      {row.lastScanDate}
                    </td>

                    {/* Diagnosis pill */}
                    <td className="px-[18px] py-[12px]">
                      <span
                        className={`
                          text-[10.5px] font-semibold
                          px-[10px] py-[3px] rounded-full
                          ${pillClass}
                        `}
                      >
                        {row.lastDiagnosis}
                      </span>
                    </td>

                    {/* Confidence */}
                    <td className="px-[18px] py-[12px]">
                      <span className="text-[13.5px] font-bold text-[#0A2540]">
                        {row.confidence}%
                      </span>
                    </td>

                    {/* Status badge */}
                    <td className="px-[18px] py-[12px]">
                      <span className="inline-flex items-center gap-[5px] text-[11.5px] font-medium text-[#355878]">
                        <span className={`w-[6px] h-[6px] rounded-full flex-shrink-0 ${dotClass}`} />
                        {row.status}
                      </span>
                    </td>

                    {/* View button */}
                    <td className="px-[18px] py-[12px] text-right">
                      <Link
                        href={`/dashboard/analysis?scanId=scan-001`}
                        className="
                          text-[12px] text-[#0284C7] font-semibold
                          bg-[rgba(14,165,233,0.08)] border border-[rgba(14,165,233,0.18)]
                          px-[11px] py-[4px] rounded-[6px]
                          hover:bg-[rgba(14,165,233,0.14)] hover:text-[#0369A1]
                          transition-colors duration-150
                          inline-flex items-center gap-[4px]
                          group-hover:border-[rgba(14,165,233,0.3)]
                        "
                      >
                        View
                        <svg
                          className="w-[10px] h-[10px] stroke-current fill-none"
                          viewBox="0 0 24 24"
                          strokeWidth={2.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Footer count ── */}
      <div className="px-[18px] py-[10px] border-t border-[rgba(14,165,233,0.07)] bg-[rgba(14,165,233,0.02)]">
        <p className="text-[11px] text-[#6B98BA]">
          Showing {filtered.length} of {rows.length} patients
        </p>
      </div>
    </div>
  );
}
