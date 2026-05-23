// src/app/doctor/page.tsx
"use client";

import { MOCK_PATIENT_TABLE_ROWS, MOCK_DOCTOR_SUMMARY, MOCK_DOCTORS } from "@/data/mock";
import { PatientsTable } from "./PatientsTable";
import { DiagnosisBreakdown } from "./DiagnosisBreakdown";

// In production, derive from the authenticated session.
const ACTIVE_DOCTOR = MOCK_DOCTORS[0]; // Dr. Rachid Benali

export default function DoctorDashboardPage() {
  // Filter rows assigned to this doctor only
  const rows = MOCK_PATIENT_TABLE_ROWS.filter(
    (r) => r.assignedDoctorId === ACTIVE_DOCTOR.id
  );

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex-1 p-8 overflow-auto">

      {/* ── Page header ── */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-[24px] font-bold text-[#0A2540] tracking-[-0.5px]">
            Clinician Dashboard
          </h1>
          <p className="text-[13px] text-[#6B98BA] mt-[3px]">
            {ACTIVE_DOCTOR.specialty} · {ACTIVE_DOCTOR.hospitalAffiliation}
          </p>
        </div>

        {/* Date + doctor pill */}
        <div className="flex items-center gap-[10px]">
          <span className="text-[12px] text-[#6B98BA]">{today}</span>
          <div className="flex items-center gap-[8px] bg-white/60 border border-[rgba(14,165,233,0.18)] rounded-full px-[12px] py-[6px] backdrop-blur-[8px]">
            <div
              className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
              style={{
                background: ACTIVE_DOCTOR.avatarGradient,
                color: ACTIVE_DOCTOR.avatarTextColor,
              }}
            >
              {ACTIVE_DOCTOR.avatarInitials}
            </div>
            <div>
              <p className="text-[12px] font-semibold text-[#0A2540] leading-none">
                {ACTIVE_DOCTOR.name}
              </p>
              <p className="text-[10.5px] text-[#6B98BA] leading-none mt-[1px]">
                {ACTIVE_DOCTOR.licenseNumber}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Top metric strip ── */}
      <div className="grid grid-cols-4 gap-[14px] mb-[22px]">
        {[
          {
            label: "Total Patients",
            value: MOCK_DOCTOR_SUMMARY.totalPatients,
            sub: "Under care",
            color: "#0A2540",
          },
          {
            label: "Scans This Month",
            value: MOCK_DOCTOR_SUMMARY.scansThisMonth,
            sub: "↑ 4 vs last month",
            color: "#0A2540",
          },
          {
            label: "Pending Review",
            value: MOCK_DOCTOR_SUMMARY.pendingReview,
            sub: "Require attention",
            color: "#F59E0B",
          },
          {
            label: "Critical Cases",
            value: rows.filter((r) => r.status === "Critical").length,
            sub: "Active alerts",
            color: "#EF4444",
          },
        ].map((c) => (
          <div
            key={c.label}
            className="
              bg-white/55 backdrop-blur-[20px]
              border border-white/75 rounded-[16px]
              px-[20px] py-[18px]
              shadow-[0_4px_24px_rgba(14,165,233,0.08)]
            "
          >
            <p className="text-[11.5px] font-semibold text-[#6B98BA] tracking-[0.2px] uppercase mb-[8px]">
              {c.label}
            </p>
            <p
              className="text-[26px] font-bold tracking-[-0.5px] leading-none"
              style={{ color: c.color }}
            >
              {c.value}
            </p>
            <p className="text-[11px] text-[#6B98BA] mt-[5px]">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Main content: table + breakdown sidebar ── */}
      <div className="flex gap-[18px] items-start">
        <PatientsTable rows={rows} />
        <DiagnosisBreakdown summary={MOCK_DOCTOR_SUMMARY} />
      </div>

      {/* ── AI disclaimer strip ── */}
      <div className="mt-[18px] bg-[rgba(14,165,233,0.06)] border border-[rgba(14,165,233,0.18)] rounded-[12px] px-4 py-[13px] flex items-start gap-3">
        <svg
          className="w-4 h-4 stroke-[#0284C7] fill-none flex-shrink-0 mt-[1px]"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
        <p className="text-[11.5px] text-[#355878] leading-relaxed">
          <span className="font-semibold text-[#0284C7]">Clinical Reminder: </span>
          All AI-generated results displayed here are decision-support outputs from the ResNet50V2 V5
          model (98.05% test accuracy). Final clinical diagnoses must be issued by a licensed
          radiologist or neurologist after independent review of the imaging data.
        </p>
      </div>
    </div>
  );
}
