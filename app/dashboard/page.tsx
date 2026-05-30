"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { StatCards } from "@/components/dashboard/StatCards";
import { RecentScansList } from "@/components/dashboard/RecentScansList";

export default function DashboardPage() {
  const [userName, setUserName] = useState("Patient");
  const [userId, setUserId] = useState("");
  const [scans, setScans] = useState<any[]>([]);
  const [statCards, setStatCards] = useState<any[]>([
    { label: "Total Scans", value: "0", subText: "this month", delta: "+0", icon: "document" },
    { label: "Last Scan", value: "No scans yet", subText: "-", icon: "calendar" },
    { label: "Latest Diagnosis", value: "-", subText: "-", icon: "activity", status: "Review" },
    { label: "Reports", value: "0", subText: "Downloaded", icon: "document" },
  ]);

  useEffect(() => {
    async function initDashboard() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "Patient";
      setUserName(name);
      setUserId(user.id);

      const { data: dbScans, error } = await supabase
        .from("scans")
        .select("*")
        .eq("uploader_id", user.id)
        .order("uploaded_at", { ascending: false });

      if (error) {
        console.error("Error fetching scans:", error);
        return;
      }

      const normalizedScans = (dbScans || []).map((s: any) => ({
        id: s.id,
        fileName: s.filename,
        format: s.format,
        fileSizeMb: s.file_size_mb,
        imageType: s.image_type,
        scanDate: s.scan_date,
        uploadedAt: s.uploaded_at,
        primaryDiagnosis: s.primary_diagnosis,
        confidence: s.confidence,
        probabilities: s.probabilities || [],
        status: s.status,
        model: s.model,
        imageUrl: s.image_url,
        heatmapUrl: s.heatmap_url,
      }));

      setScans(normalizedScans);

      if (normalizedScans.length > 0) {
        const lastScan = normalizedScans[0];
        const now = new Date();
        const thisMonthScans = normalizedScans.filter((s: any) => {
          const d = new Date(s.uploadedAt);
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }).length;

        const lastScanDate = new Date(lastScan.uploadedAt);
        const diffMs = now.getTime() - lastScanDate.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        let relativeTime: string;
        if (diffDays === 0) {
          const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
          relativeTime = diffHours <= 0 ? "Just now" : `${diffHours}h ago`;
        } else if (diffDays === 1) {
          relativeTime = "1d ago";
        } else {
          relativeTime = `${diffDays}d ago`;
        }

        const dateStr = lastScanDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

        setStatCards([
          { label: "Total Scans", value: normalizedScans.length.toString(), delta: `+${thisMonthScans}`, subText: "this month" },
          { label: "Last Scan", value: relativeTime, subText: dateStr },
          {
            label: "Latest Diagnosis",
            value: lastScan.primaryDiagnosis,
            subText: `Confidence: ${typeof lastScan.confidence === "number" ? lastScan.confidence.toFixed(1) : lastScan.confidence}%`,
            valueColor: lastScan.status === "Critical" ? "#DC2626" : (lastScan.primaryDiagnosis === "No Tumor" ? "#10B981" : "#F59E0B"),
          },
          { label: "Reports", value: normalizedScans.length.toString(), subText: "Downloaded" },
        ]);
      }
    }
    initDashboard();
  }, []);

  return (
    <div className="flex-1 p-8 overflow-auto">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-[24px] font-bold text-[#0A2540] tracking-[-0.5px]">Dashboard</h1>
          <p className="text-[13px] text-[#6B98BA] mt-[3px]">Welcome back, {userName}</p>
        </div>
        <Link
          href="/dashboard/upload"
          className="inline-flex items-center gap-2 px-5 py-[10px] bg-gradient-to-br from-[#38BDF8] to-[#0284C7] text-white text-[13.5px] font-semibold rounded-[9px] shadow-[0_4px_14px_rgba(14,165,233,0.3)] hover:shadow-[0_6px_20px_rgba(14,165,233,0.4)] hover:-translate-y-px transition-all duration-200"
                        style={{fontSize: "12px",fontWeight: "600" ,color: "#fff", padding: "10px 22px", textDecoration: "none" ,border: "none"  ,display: "inline-block" }}
 >
          + New Scan
        </Link>
      </div>

      <StatCards cards={statCards} />

      <div className="grid grid-cols-[1fr_320px] gap-[18px] mt-0">
        <Link
          href="/dashboard/upload"
          className="bg-white/40 backdrop-blur-[12px] border-2 border-dashed border-[rgba(14,165,233,0.25)] rounded-2xl px-7 py-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 group hover:border-[#0EA5E9] hover:bg-white/60 no-underline"
        >
          <div className="w-[60px] h-[60px] bg-[rgba(14,165,233,0.08)] rounded-[16px] flex items-center justify-center mb-[14px] border border-[rgba(14,165,233,0.18)] group-hover:bg-[rgba(14,165,233,0.14)] transition-colors">
            <svg className="w-7 h-7 stroke-[#0284C7] fill-none" viewBox="0 0 24 24" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>
          <h3 className="text-[16px] font-semibold text-[#0A2540] mb-[6px]">Upload MRI Scan</h3>
          <p className="text-[13px] text-[#355878] mb-5 leading-relaxed max-w-xs">
            Drag and drop your MRI image here, or click to browse your files
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-[#6B98BA] bg-[rgba(14,165,233,0.06)] border border-[rgba(14,165,233,0.12)] rounded-[6px] px-[10px] py-[4px]">JPG</span>
            <span className="text-[11px] font-medium text-[#6B98BA] bg-[rgba(14,165,233,0.06)] border border-[rgba(14,165,233,0.12)] rounded-[6px] px-[10px] py-[4px]">PNG</span>
            <span className="text-[11px] font-medium text-[#6B98BA] bg-[rgba(14,165,233,0.06)] border border-[rgba(14,165,233,0.12)] rounded-[6px] px-[10px] py-[4px]">Max 10MB</span>
          </div>
        </Link>

        <RecentScansList scans={scans} />
      </div>

      <div className="mt-[18px] bg-[rgba(14,165,233,0.06)] border border-[rgba(14,165,233,0.18)] rounded-[12px] px-4 py-[13px] flex items-start gap-2">
        <svg  style={ {width: "20px", height: "20px" }}
        className="w-3 h-3 stroke-[#0284C7] fill-none flex-shrink-0 mt-[2px]" viewBox="0 0 24 24" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
        <div>
          <p className="text-[12px] font-semibold text-[#0284C7] mb-[2px]">AI-Assisted Diagnosis</p>
          <p className="text-[11.5px] text-[#355878] leading-relaxed">
            NeuroScan AI uses a ResNet50V2 V5 model trained on 12,064 images with 98.05% test accuracy. All results are for informational purposes only and must be reviewed by a qualified radiologist before any clinical decision is made.
          </p>
        </div>
      </div>
    </div>
  );
}