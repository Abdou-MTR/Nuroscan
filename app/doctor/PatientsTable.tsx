// src/components/doctor/PatientsTable.tsx
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { DIAGNOSIS_PILL_MAP } from "@/types";

interface DynamicRow {
  id: string;
  patientName: string;
  patientId: string;
  dateOfBirth?: string;
  scanId: string | null;
  scanDate: string;
  scanType: string;
  primaryDiagnosis: string;
  confidence: number;
  status: string;
  assignedDoctorId: string;
}

interface PatientsTableProps {
  rows: DynamicRow[];
}

const PILL_STYLES: Record<string, string> = {
  red:   "bg-[rgba(239,68,68,0.08)]   text-[#EF4444] border border-[rgba(239,68,68,0.18)]",
  green: "bg-[rgba(16,185,129,0.08)]  text-[#10B981] border border-[rgba(16,185,129,0.2)]",
  amber: "bg-[rgba(245,158,11,0.08)]  text-[#92400E] border border-[rgba(245,158,11,0.2)]",
  blue:  "bg-[rgba(14,165,233,0.08)]  text-[#0284C7] border border-[rgba(14,165,233,0.18)]",
  gray:  "bg-[rgba(107,152,186,0.08)] text-[#6B98BA] border border-[rgba(107,152,186,0.18)]",
};

const STATUS_DOT: Record<string, string> = {
  Critical: "bg-[#EF4444]",
  Review:   "bg-[#F59E0B]",
  Normal:   "bg-[#10B981]",
  Pending:  "bg-[#94A3B8]",
};

function getInitials(name: string) {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, #38BDF8, #0284C7)",
  "linear-gradient(135deg, #A78BFA, #7C3AED)",
  "linear-gradient(135deg, #FB923C, #EA580C)",
  "linear-gradient(135deg, #34D399, #059669)",
  "linear-gradient(135deg, #F472B6, #DB2777)",
];

function getAvatarGradient(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
}

export function PatientsTable({ rows }: PatientsTableProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.patientName.toLowerCase().includes(q) ||
        r.patientId.toLowerCase().includes(q) ||
        r.primaryDiagnosis.toLowerCase().includes(q) ||
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
              {["Patient", "Last Scan", "Diagnosis", "Confidence", "Status", "Actions"].map((h) => (
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
                  {query ? <>No patients match &ldquo;{query}&rdquo;.</> : "No patients yet. Click \"Add Patient\" to create one."}
                </td>
              </tr>
            ) : (
              filtered.map((row) => {
                const hasScan = row.scanId !== null;
                const pillVariant = hasScan
                  ? (DIAGNOSIS_PILL_MAP[row.primaryDiagnosis as keyof typeof DIAGNOSIS_PILL_MAP] ?? "gray")
                  : "gray";
                const pillClass   = PILL_STYLES[pillVariant] ?? PILL_STYLES.gray;
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
                          className="w-[32px] h-[32px] rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0 text-white"
                          style={{ background: getAvatarGradient(row.patientId) }}
                        >
                          {getInitials(row.patientName)}
                        </div>
                        <div>
                          <p className="text-[13.5px] font-semibold text-[#0A2540]">
                            {row.patientName}
                          </p>
                          <p className="text-[11px] text-[#6B98BA]">{row.patientId}</p>
                        </div>
                      </div>
                    </td>

                    {/* Last scan date */}
                    <td className="px-[18px] py-[12px] text-[13.5px] text-[#6B98BA]">
                      {hasScan
                        ? new Date(row.scanDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                        : <span className="italic text-[#94A3B8]">No scans yet</span>
                      }
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
                        {hasScan ? row.primaryDiagnosis : "Awaiting Scan"}
                      </span>
                    </td>

                    {/* Confidence */}
                    <td className="px-[18px] py-[12px]">
                      <span className="text-[13.5px] font-bold text-[#0A2540]">
                        {hasScan ? `${row.confidence}%` : <span className="font-normal text-[#94A3B8]">—</span>}
                      </span>
                    </td>

                    {/* Status badge */}
                    <td className="px-[18px] py-[12px]">
                      <span className="inline-flex items-center gap-[5px] text-[11.5px] font-medium text-[#355878]">
                        <span className={`w-[6px] h-[6px] rounded-full flex-shrink-0 ${dotClass}`} />
                        {row.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-[18px] py-[12px] text-right">
                      <div className="flex items-center gap-[6px] justify-end">
                        {/* Run Scan button */}
                        <Link
                          href={`/doctor/upload?patientId=${row.patientId}&patientName=${encodeURIComponent(row.patientName)}&patientDbId=${row.id}&patientDob=${row.dateOfBirth || ""}`}
                          className="
                            text-[12px] text-white font-semibold
                            bg-gradient-to-br from-[#38BDF8] to-[#0284C7]
                            px-[11px] py-[4px] rounded-[6px]
                            hover:shadow-[0_3px_10px_rgba(14,165,233,0.3)]
                            transition-all duration-150
                            inline-flex items-center gap-[4px]
                          "
                          style={{fontSize: "12px",fontWeight: "600" ,color: "#fff", padding: "8px 20px", textDecoration: "none" }}
                        >
                          <svg className="w-[10px] h-[10px] stroke-current fill-none" viewBox="0 0 24 24" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                          </svg>
                          Run Scan
                        </Link>

                        {/* View button (only if scan exists) */}
                        {hasScan && (
                          <Link
                            href={`/doctor/analysis?scanId=${row.scanId}`}
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
                        )}
                      </div>
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
