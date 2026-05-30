// src/app/dashboard/page.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { StatCards } from "@/components/dashboard/StatCards";
import { RecentScansList } from "@/components/dashboard/RecentScansList";
import type { PatientStatCard, ScanRecord } from "@/types";

export default function DashboardPage() {
  const [statCards, setStatCards] = useState<PatientStatCard[]>([]);
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [patientName, setPatientName] = useState("Patient");
  const [patientId, setPatientId] = useState("P-001");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const name = user.user_metadata?.full_name || user.email?.split('@')[0] || "Patient";
      setPatientName(name);
      setPatientId(user.id.substring(0, 8).toUpperCase());

      const { data: userScans, error } = await supabase
        .from("scans")
        .select("*")
        .eq("patient_id", user.id)
        .order("uploaded_at", { ascending: false });

      const fetchedScans: ScanRecord[] = [];
      let totalScans = 0;
      let criticalScans = 0;
      let clearScans = 0;
      let lastScanDate = "No scans yet";

      if (!error && userScans) {
        totalScans = userScans.length;
        userScans.forEach((scan: any, index: number) => {
          if (scan.primary_diagnosis === "No Tumor") clearScans++;
          else if (scan.status === "Critical" || scan.status === "Review") criticalScans++;
          
          if (index === 0) {
            lastScanDate = new Date(scan.uploaded_at || scan.scan_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
          }

          fetchedScans.push({
            id: scan.id,
            patientId: scan.patient_id,
            fileName: scan.filename,
            format: scan.format,
            fileSizeMb: scan.file_size_mb,
            imageType: scan.image_type,
            scanDate: scan.scan_date || scan.uploaded_at,
            uploadedAt: scan.uploaded_at,
            primaryDiagnosis: scan.primary_diagnosis,
            confidence: scan.confidence,
            probabilities: scan.probabilities,
            status: scan.status,
            model: scan.model,
            imageUrl: scan.image_url,
            heatmapUrl: scan.heatmap_url,
          } as unknown as ScanRecord);
        });
      }

      setScans(fetchedScans);

      setStatCards([
        { label: "Total Scans", value: totalScans, subText: "Lifetime MRI scans uploaded" },
        { label: "Last Scan", value: totalScans > 0 ? "Completed" : "None", subText: lastScanDate, valueColor: totalScans > 0 ? "#10B981" : "#94A3B8" },
        { label: "Findings", value: criticalScans, subText: "Scans requiring medical review", valueColor: criticalScans > 0 ? "#EF4444" : "#10B981" },
        { label: "Clear Scans", value: clearScans, subText: "No tumor detected", valueColor: "#10B981" },
      ]);

      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="flex-1 p-8 overflow-auto">
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-[24px] font-bold text-[#0A2540] tracking-[-0.5px]">
            Patient Dashboard
          </h1>
          <p className="text-[13px] text-[#6B98BA] mt-[3px]">
            {loading ? "Loading your data..." : `Welcome back, ${patientName} · Patient ID: ${patientId}`}
          </p>
        </div>

        <Link
          href="/dashboard/upload"
          className="
            inline-flex items-center gap-2 px-5 py-[10px]
            bg-gradient-to-br from-[#38BDF8] to-[#0284C7]
            text-white text-[13.5px] font-semibold rounded-[9px]
            shadow-[0_4px_14px_rgba(14,165,233,0.3)]
            hover:shadow-[0_6px_20px_rgba(14,165,233,0.4)]
            hover:-translate-y-px transition-all duration-200
          "
                           style={{fontSize: "12px",fontWeight: "600" ,color: "#fff", padding: "10px 22px", textDecoration: "none" ,border: "none"  ,display: "inline-block" }}

        >
          <svg
            className="w-4 h-4 stroke-white fill-none flex-shrink-0"
            viewBox="0 0 24 24"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          Upload New Scan
        </Link>
      </div>

      {/* ── Stat Cards Row ── */}
      <StatCards cards={statCards} />

      {/* ── Content Grid: Upload CTA + Recent Scans ── */}
      <div  className="grid grid-cols-[1fr_320px] gap-[18px] mt-20 ">
        {/* Upload call-to-action panel */}
        <div
         
          className="
            bg-white/40 backdrop-blur-[12px] border-2 border-dashed border-[rgba(14,165,233,0.25)]
            rounded-2xl px-7 py-12 flex flex-col items-center justify-center text-center
            cursor-pointer transition-all duration-200 group
            hover:border-[#0EA5E9] hover:bg-white/60
          "
          onClick={() => (window.location.href = "/dashboard/upload")}
        >
          <div
      
            className="
              w-[60px] h-[60px] bg-[rgba(14,165,233,0.08)] rounded-[16px]
              flex items-center justify-center mb-[14px]
              border border-[rgba(14,165,233,0.18)]
              group-hover:bg-[rgba(14,165,233,0.14)] transition-colors
            "
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
            Upload an MRI Scan
          </h3>
          <p className="text-[13px] text-[#355878] mb-5 leading-relaxed max-w-xs">
            Drag-and-drop or click to select a brain MRI image. T1-weighted
            contrast-enhanced scans yield the highest diagnostic accuracy.
          </p>

          <div className="flex gap-2 justify-center flex-wrap">
            {(["JPG", "PNG", "DICOM", "NIfTI"] as const).map((fmt) => (
              <span
                key={fmt}
                className="
                  bg-white/65 border border-[rgba(14,165,233,0.15)]
                  text-[#355878] text-[11px] font-medium
                  px-[10px] py-1 rounded-[6px]
                "
              >
                {fmt}
              </span>
            ))}
          </div>

          <Link
            href="/dashboard/upload"
            className="
              mt-6 inline-flex items-center gap-2 px-5 py-[9px]
              bg-gradient-to-br from-[#38BDF8] to-[#0284C7]
              text-white text-[13px] font-semibold rounded-[8px]
              shadow-[0_4px_12px_rgba(14,165,233,0.25)]
              hover:shadow-[0_6px_18px_rgba(14,165,233,0.35)]
              hover:-translate-y-px transition-all duration-200
            "
            onClick={(e) => e.stopPropagation()}
          >
            Start Upload
            <svg
              className="w-3.5 h-3.5 stroke-white fill-none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {/* Recent scans sidebar */}
        <RecentScansList scans={scans} />
      </div>

      {/* ── AI Note ── */}
      <div
        className="
          mt-[18px] bg-[rgba(14,165,233,0.06)] border border-[rgba(14,165,233,0.18)]
          rounded-[12px] px-4 py-[13px] flex items-start gap-3
        "
      >
        <svg
          className="w-4 h-4 stroke-[#0284C7] fill-none flex-shrink-0 mt-[1px]"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
        <div>
          <p className="text-[12px] font-semibold text-[#0284C7] mb-[2px]">
            AI-Assisted Diagnosis
          </p>
          <p className="text-[11.5px] text-[#355878] leading-relaxed">
            NeuroScan AI uses a ResNet50V2 V5 model trained on 12,064 images with 98.05% test
            accuracy. All results are for informational purposes only and must be reviewed by a
            qualified radiologist before any clinical decision is made.
          </p>
        </div>
      </div>
    </div>
  );
}
