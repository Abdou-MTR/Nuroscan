// app/doctor/page.tsx
"use client";

import { useEffect, useState } from "react";
import { PatientsTable } from "./PatientsTable";
import { DiagnosisBreakdown } from "./DiagnosisBreakdown";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { MOCK_DOCTORS } from "@/data/mock";
import type { DoctorDashboardSummary } from "@/types";

const DEFAULT_DOCTOR = MOCK_DOCTORS[0];

export default function DoctorDashboardPage() {
  const [activeDoctor, setActiveDoctor] = useState(DEFAULT_DOCTOR);
  const [rows, setRows] = useState<any[]>([]);
  const [summary, setSummary] = useState<DoctorDashboardSummary>({
    totalPatients: 0, scansThisMonth: 0, pendingReview: 0,
    breakdown: [
      { label: "Glioma", count: 0, percentage: 0, color: "#EF4444" },
      { label: "Meningioma", count: 0, percentage: 0, color: "#F59E0B" },
      { label: "Pituitary", count: 0, percentage: 0, color: "#0EA5E9" },
      { label: "No Tumor", count: 0, percentage: 0, color: "#10B981" },
    ]
  });

  useEffect(() => {
    async function initDashboard() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setActiveDoctor({
        ...DEFAULT_DOCTOR,
        name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Dr.",
        id: user.id,
      });

      // Fetch patients with their scans
      const { data: patients, error } = await supabase
        .from("patients")
        .select(`
          id, name, patient_id, assigned_doctor_id, date_of_birth,
          scans (
            id, primary_diagnosis, confidence, status,
            scan_date, uploaded_at, image_type
          )
        `)
        .eq("assigned_doctor_id", user.id)
        .order("created_at", { ascending: false });

      if (error) { console.error("Error fetching patients:", error); return; }

      const realRows = (patients || []).map((patient: any) => {
        const patScans: any[] = patient.scans || [];
        const sorted = patScans.sort((a: any, b: any) =>
          new Date(b.uploaded_at || b.scan_date).getTime() - new Date(a.uploaded_at || a.scan_date).getTime()
        );
        const latest = sorted[0];

        return {
          id: patient.id,
          patientName: patient.name,
          patientId: patient.patient_id || patient.id,
          dateOfBirth: patient.date_of_birth || "",
          scanId: latest?.id || null,
          scanDate: latest?.uploaded_at || latest?.scan_date || "No scans yet",
          scanType: latest?.image_type || "-",
          primaryDiagnosis: latest?.primary_diagnosis || "Pending",
          confidence: latest?.confidence || 0,
          status: latest?.status || "Pending",
          assignedDoctorId: patient.assigned_doctor_id,
        };
      });

      setRows(realRows);

      // Compute summary stats
      const now = new Date();
      const allScans = (patients || []).flatMap((p: any) => p.scans || []);
      const scansThisMonth = allScans.filter((s: any) => {
        const d = new Date(s.uploaded_at || s.scan_date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }).length;

      const pendingCount = realRows.filter((r: any) => r.status === "Review" || r.status === "Pending").length;

      const diagCounts: Record<string, number> = { Glioma: 0, Meningioma: 0, Pituitary: 0, "No Tumor": 0 };
      let scansAnalyzed = 0;
      realRows.forEach((r: any) => {
        if (r.primaryDiagnosis !== "Pending" && diagCounts[r.primaryDiagnosis] !== undefined) {
          diagCounts[r.primaryDiagnosis]++;
          scansAnalyzed++;
        }
      });

      setSummary({
        totalPatients: realRows.length,
        scansThisMonth,
        pendingReview: pendingCount,
        breakdown: [
          { label: "Glioma", count: diagCounts["Glioma"], percentage: scansAnalyzed ? Math.round((diagCounts["Glioma"] / scansAnalyzed) * 100) : 0, color: "#EF4444" },
          { label: "Meningioma", count: diagCounts["Meningioma"], percentage: scansAnalyzed ? Math.round((diagCounts["Meningioma"] / scansAnalyzed) * 100) : 0, color: "#F59E0B" },
          { label: "Pituitary", count: diagCounts["Pituitary"], percentage: scansAnalyzed ? Math.round((diagCounts["Pituitary"] / scansAnalyzed) * 100) : 0, color: "#0EA5E9" },
          { label: "No Tumor", count: diagCounts["No Tumor"], percentage: scansAnalyzed ? Math.round((diagCounts["No Tumor"] / scansAnalyzed) * 100) : 0, color: "#10B981" },
        ]
      });
    }
    initDashboard();
  }, []);

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="flex-1 p-8 overflow-auto">
      {/* Page header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-[24px] font-bold text-[#0A2540] tracking-[-0.5px]">Clinician Dashboard</h1>
          <p className="text-[13px] text-[#6B98BA] mt-[3px]">
            {activeDoctor.specialty} · {activeDoctor.hospitalAffiliation}
          </p>
        </div>

        <div className="flex items-center gap-[10px]">
          <Link
            href="/doctor/add-patient"
            className="flex items-center  rounded-[8px] bg-gradient-to-br from-[#38BDF8] to-[#0284C7] text-white text-[12.5px] font-semibold shadow-[0_3px_10px_rgba(14,165,233,0.2)] hover:shadow-[0_4px_14px_rgba(14,165,233,0.3)] transition-all hover:-translate-y-px"
                 style={{fontSize: "12px",fontWeight: "600" ,color: "#fff", padding: "10px 22px", textDecoration: "none" ,border: "none"  ,display: "inline-block" }}
                        >
          +
            Add Patient
          </Link>

          <div className="w-[1px] h-[20px] bg-[rgba(14,165,233,0.2)] mx-[4px]"></div>
          <span className="text-[12px] text-[#6B98BA]">{today}</span>

          <div className="flex items-center gap-[8px] bg-white/60 border border-[rgba(14,165,233,0.18)] rounded-full px-[12px] py-[6px] backdrop-blur-[8px]">
            <div className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={{ background: activeDoctor.avatarGradient, color: activeDoctor.avatarTextColor }}>
              {activeDoctor.avatarInitials}
            </div>
            <div>
              <p className="text-[12px] font-semibold text-[#0A2540] leading-none">{activeDoctor.name}</p>
              <p className="text-[10.5px] text-[#6B98BA] leading-none mt-[1px]">{activeDoctor.licenseNumber}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Metric strip */}
      <div className="grid grid-cols-4 gap-[14px] mb-[22px]">
        {[
          { label: "Total Patients", value: summary.totalPatients, sub: "Under care", color: "#0A2540" },
          { label: "Scans This Month", value: summary.scansThisMonth, sub: "Total uploaded", color: "#0A2540" },
          { label: "Pending Review", value: summary.pendingReview, sub: "Require attention", color: "#F59E0B" },
          { label: "Critical Cases", value: rows.filter((r) => r.status === "Critical").length, sub: "Active alerts", color: "#EF4444" },
        ].map((c) => (
          <div key={c.label} className="bg-white/55 backdrop-blur-[20px] border border-white/75 rounded-[16px] px-[20px] py-[18px] shadow-[0_4px_24px_rgba(14,165,233,0.08)]">
            <p className="text-[11.5px] font-semibold text-[#6B98BA] tracking-[0.2px] uppercase mb-[8px]">{c.label}</p>
            <p className="text-[26px] font-bold tracking-[-0.5px] leading-none" style={{ color: c.color }}>{c.value}</p>
            <p className="text-[11px] text-[#6B98BA] mt-[5px]">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="flex gap-[18px] items-start">
        <PatientsTable rows={rows} />
        <DiagnosisBreakdown summary={summary} />
      </div>

      {/* AI disclaimer */}
      <div className="mt-[18px] bg-[rgba(14,165,233,0.06)] border border-[rgba(14,165,233,0.18)] rounded-[12px] px-4 py-[13px] flex items-start gap-2">
        <svg  style={ {width: "20px", height: "20px" }} 
        className="w-3 h-3 stroke-[#0284C7] fill-none flex-shrink-0 mt-[2px]" viewBox="0 0 24 24" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
        <p className="text-[11.5px] text-[#355878] leading-relaxed">
          <span className="font-semibold text-[#0284C7]">Clinical Reminder: </span>
          All AI-generated results displayed here are decision-support outputs from the ResNet50V2 V5 model (98.05% test accuracy). Final clinical diagnoses must be issued by a licensed radiologist or neurologist after independent review of the imaging data.
        </p>
      </div>
    </div>
  );
}
