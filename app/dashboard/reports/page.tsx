"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

const PILL_STYLES: Record<string, string> = {
  red:   "bg-[rgba(239,68,68,0.08)]   text-[#EF4444] border border-[rgba(239,68,68,0.18)]",
  green: "bg-[rgba(16,185,129,0.08)]  text-[#10B981] border border-[rgba(16,185,129,0.2)]",
  amber: "bg-[rgba(245,158,11,0.08)]  text-[#92400E] border border-[rgba(245,158,11,0.2)]",
  blue:  "bg-[rgba(14,165,233,0.08)]  text-[#0284C7] border border-[rgba(14,165,233,0.18)]",
  gray:  "bg-[rgba(107,152,186,0.08)] text-[#6B98BA] border border-[rgba(107,152,186,0.18)]",
};

const DIAGNOSIS_PILL_MAP: Record<string, string> = {
  "Glioma": "red", "Meningioma": "amber", "Pituitary": "blue", "No Tumor": "green",
};

const STATUS_DOT: Record<string, string> = {
  Critical: "bg-[#EF4444]", Review: "bg-[#F59E0B]", Normal: "bg-[#10B981]", Pending: "bg-[#94A3B8]",
};

const DIAG_COLOR: Record<string, string> = {
  Glioma: "#EF4444", Meningioma: "#F59E0B", Pituitary: "#3B82F6", "No Tumor": "#10B981", Pending: "#94A3B8",
};

interface ReportRow {
  scanId: string;
  patientName: string;
  patientId: string;
  dateOfBirth: string;
  fileName: string;
  scanDate: string;
  imageType: string;
  format: string;
  fileSizeMb: number | string;
  primaryDiagnosis: string;
  confidence: number;
  probabilities: { className: string; probability: number; color: string }[];
  status: string;
  model: { backbone: string; version: string; testAccuracy: number; xaiMethod: string; ttaPasses: number };
  imageUrl?: string;
  heatmapUrl?: string;
}

export default function PatientReportsPage() {
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [downloading, setDownloading] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data, error } = await supabase
        .from("scans")
        .select(`
          id,
          filename,
          format,
          image_type,
          file_size_mb,
          scan_date,
          uploaded_at,
          primary_diagnosis,
          confidence,
          probabilities,
          status,
          model,
          image_url,
          heatmap_url
        `)
        .eq("uploader_id", user.id)
        .order("uploaded_at", { ascending: false });

      if (error) { console.error("Error loading reports:", error); setLoading(false); return; }

      const userName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Patient";

      const rows: ReportRow[] = (data || []).map((scan: any) => {
        const probs = (scan.probabilities || []).map((p: any) => ({
          className: p.className || p.label || p.class_name || "Unknown",
          probability: p.probability ?? 0,
          color: DIAG_COLOR[p.className || p.label] ?? "#0284C7",
        }));

        return {
          scanId: scan.id,
          patientName: userName,
          patientId: user.id,
          dateOfBirth: "N/A",
          fileName: scan.filename ?? "MRI Scan",
          scanDate: scan.uploaded_at || scan.scan_date || new Date().toISOString(),
          imageType: scan.image_type ?? "MRI",
          format: scan.format ?? "JPG",
          fileSizeMb: scan.file_size_mb ?? "-",
          primaryDiagnosis: scan.primary_diagnosis ?? "Pending",
          confidence: scan.confidence ?? 0,
          probabilities: probs,
          status: scan.status ?? "Pending",
          model: scan.model ?? { backbone: "ResNet50V2", version: "V5", testAccuracy: 98.05, xaiMethod: "Grad-CAM", ttaPasses: 10 },
          imageUrl: scan.image_url ?? undefined,
          heatmapUrl: scan.heatmap_url ?? undefined,
        };
      });

      setReports(rows);
      setLoading(false);
    }
    load();
  }, []);

  const statuses = ["All", "Critical", "Review", "Normal", "Pending"];

  const filtered = reports.filter(r => {
    const s = search.toLowerCase();
    const matchSearch = r.fileName.toLowerCase().includes(s) || r.primaryDiagnosis.toLowerCase().includes(s);
    const matchStatus = filterStatus === "All" || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleDownloadPDF = async (report: ReportRow) => {
    setDownloading(report.scanId);
    try {
      const html2pdf = (await import("html2pdf.js")).default;

      const diagColor = DIAG_COLOR[report.primaryDiagnosis] ?? "#0284C7";
      const scanDateFormatted = new Date(report.scanDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

      const probsHtml = report.probabilities.map(p => {
        const isTop = p.className === report.primaryDiagnosis;
        return `
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:7px;">
            <span style="width:100px;font-size:11px;color:#355878;">${p.className}</span>
            <div style="flex:1;height:8px;background:#F1F5F9;border-radius:4px;overflow:hidden;">
              <div style="width:${p.probability}%;height:100%;background:${isTop ? diagColor : "#CBD5E1"};border-radius:4px;"></div>
            </div>
            <span style="width:48px;text-align:right;font-size:11px;font-weight:600;color:${isTop ? diagColor : "#64748B"};">${p.probability.toFixed(1)}%</span>
          </div>`;
      }).join("");

      const imagesHtml = (report.imageUrl || report.heatmapUrl) ? `
        <div style="margin-bottom:20px;">
          <p style="margin:0 0 10px;font-size:10px;font-weight:700;color:#6B98BA;letter-spacing:1px;text-transform:uppercase;">Scan Imagery</p>
          <div style="display:flex;gap:12px;">
            <div style="flex:1;background:#0A1C2E;border-radius:8px;overflow:hidden;text-align:center;border:1px solid #1E3A5F;">
              <p style="margin:0;padding:8px;font-size:9px;color:#6B98BA;background:#0D2137;text-transform:uppercase;letter-spacing:0.5px;">Original MRI</p>
              ${report.imageUrl ? `<img src="${report.imageUrl}" style="width:100%;height:200px;object-fit:cover;" crossorigin="anonymous" />` : `<div style="height:200px;display:flex;align-items:center;justify-content:center;color:#355878;font-size:11px;">No image</div>`}
            </div>
            <div style="flex:1;background:#0A1C2E;border-radius:8px;overflow:hidden;text-align:center;border:1px solid #1E3A5F;">
              <p style="margin:0;padding:8px;font-size:9px;color:#6B98BA;background:#0D2137;text-transform:uppercase;letter-spacing:0.5px;">Grad-CAM Heatmap</p>
              ${report.heatmapUrl ? `<img src="${report.heatmapUrl}" style="width:100%;height:200px;object-fit:cover;" />` : `<div style="height:200px;display:flex;align-items:center;justify-content:center;color:#355878;font-size:11px;">Not available</div>`}
            </div>
          </div>
        </div>` : "";

      const div = document.createElement("div");
      div.style.cssText = "position:absolute;left:-9999px;top:-9999px;width:794px;padding:40px 48px;font-family:'Segoe UI',Roboto,Arial,sans-serif;color:#0A2540;background:#fff;";

      div.innerHTML = `
        <!-- Header -->
        <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #0284C7;padding-bottom:16px;margin-bottom:24px;">
          <div>
            <h1 style="margin:0;font-size:22px;font-weight:700;color:#0284C7;letter-spacing:-0.5px;">🧠 NeuroScan AI</h1>
            <p style="margin:4px 0 0;font-size:10px;color:#6B98BA;letter-spacing:1px;text-transform:uppercase;">Diagnostic Report</p>
          </div>
          <div style="text-align:right;">
            <p style="margin:0;font-size:10px;color:#6B98BA;">Report Date</p>
            <p style="margin:2px 0 0;font-size:12px;font-weight:600;color:#0A2540;">${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
            <p style="margin:6px 0 0;font-size:9px;color:#94A3B8;">Report ID: NS-${Date.now().toString(36).toUpperCase()}</p>
          </div>
        </div>

        <!-- Status Banner -->
        <div style="background:${diagColor}10;border:1px solid ${diagColor}30;border-radius:8px;padding:12px 16px;margin-bottom:20px;display:flex;align-items:center;gap:12px;">
          <div style="width:36px;height:36px;background:${diagColor}20;border-radius:8px;display:flex;align-items:center;justify-content:center;">
            <span style="font-size:18px;">${report.primaryDiagnosis === "No Tumor" ? "✓" : "⚠"}</span>
          </div>
          <div>
            <p style="margin:0;font-size:14px;font-weight:700;color:${diagColor};">${report.primaryDiagnosis === "No Tumor" ? "No Tumor Detected" : report.primaryDiagnosis + " Tumor Detected"}</p>
            <p style="margin:2px 0 0;font-size:11px;color:#64748B;">AI Confidence: ${report.confidence}% · Status: ${report.status}</p>
          </div>
        </div>

        <!-- Two-column: Patient + Scan Info -->
        <div style="display:flex;gap:16px;margin-bottom:20px;">
          <div style="flex:1;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:14px 16px;">
            <p style="margin:0 0 10px;font-size:10px;font-weight:700;color:#6B98BA;letter-spacing:1px;text-transform:uppercase;">Patient Information</p>
            <table style="width:100%;border-collapse:collapse;font-size:11px;">
              <tr><td style="padding:4px 0;color:#64748B;width:80px;">Name</td><td style="padding:4px 0;font-weight:600;">${report.patientName}</td></tr>
              <tr><td style="padding:4px 0;color:#64748B;">Patient ID</td><td style="padding:4px 0;font-weight:600;">${report.patientId}</td></tr>
            </table>
          </div>
          <div style="flex:1;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:14px 16px;">
            <p style="margin:0 0 10px;font-size:10px;font-weight:700;color:#6B98BA;letter-spacing:1px;text-transform:uppercase;">Scan Details</p>
            <table style="width:100%;border-collapse:collapse;font-size:11px;">
              <tr><td style="padding:4px 0;color:#64748B;width:80px;">File</td><td style="padding:4px 0;font-weight:600;">${report.fileName}</td></tr>
              <tr><td style="padding:4px 0;color:#64748B;">Format</td><td style="padding:4px 0;font-weight:600;">${report.format}</td></tr>
              <tr><td style="padding:4px 0;color:#64748B;">Image Type</td><td style="padding:4px 0;font-weight:600;">${report.imageType}</td></tr>
              <tr><td style="padding:4px 0;color:#64748B;">Scan Date</td><td style="padding:4px 0;font-weight:600;">${scanDateFormatted}</td></tr>
            </table>
          </div>
        </div>

        <!-- MRI + Heatmap Images -->
        ${imagesHtml}

        <!-- Probability Chart -->
        <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:16px;margin-bottom:20px;">
          <p style="margin:0 0 12px;font-size:10px;font-weight:700;color:#6B98BA;letter-spacing:1px;text-transform:uppercase;">Classification Probabilities</p>
          ${probsHtml}
        </div>

        <!-- Model Info -->
        <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:14px 16px;margin-bottom:20px;">
          <p style="margin:0 0 10px;font-size:10px;font-weight:700;color:#6B98BA;letter-spacing:1px;text-transform:uppercase;">Model Information</p>
          <div style="display:flex;gap:24px;font-size:11px;">
            <div><span style="color:#64748B;">Backbone: </span><strong>${report.model.backbone} ${report.model.version}</strong></div>
            <div><span style="color:#64748B;">Test Accuracy: </span><strong>${report.model.testAccuracy}%</strong></div>
            <div><span style="color:#64748B;">XAI Method: </span><strong>${report.model.xaiMethod}</strong></div>
            <div><span style="color:#64748B;">TTA Passes: </span><strong>${report.model.ttaPasses}</strong></div>
          </div>
        </div>

        <!-- Disclaimer -->
        <div style="border-top:1px solid #E2E8F0;padding-top:14px;">
          <p style="margin:0;font-size:9px;color:#94A3B8;line-height:1.5;">
            <strong style="color:#64748B;">Disclaimer:</strong> This report was generated by NeuroScan AI, an automated diagnostic support tool.
            It does not constitute a clinical diagnosis. All findings must be reviewed and confirmed by a licensed radiologist or
            neurologist before any medical decision is made.
          </p>
          <p style="margin:8px 0 0;font-size:8px;color:#CBD5E1;text-align:center;">© ${new Date().getFullYear()} NeuroScan AI · Confidential Medical Document</p>
        </div>
      `;

      document.body.appendChild(div);
      await html2pdf().set({
        margin: [0.3, 0.2, 0.3, 0.2],
        filename: `My_NeuroScan_Report_${report.scanId}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      }).from(div).save();
      document.body.removeChild(div);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="flex-1 p-8 overflow-auto">
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-[24px] font-bold text-[#0A2540] tracking-[-0.5px]">My Reports</h1>
        <p className="text-[13px] text-[#6B98BA] mt-[3px]">
          {loading ? "Loading…" : `${reports.length} scans · download your PDF reports`}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-[3px] border-[rgba(14,165,233,0.2)] border-t-[#0284C7] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex-1 min-w-0 bg-white/55 backdrop-blur-[20px] border border-white/75 rounded-[16px] shadow-[0_4px_24px_rgba(14,165,233,0.08)] overflow-hidden">
          {/* Card header */}
          <div className="flex items-center justify-between px-[18px] py-[16px] border-b border-[rgba(14,165,233,0.1)] flex-wrap gap-4">
            <div className="flex gap-1.5">
              {statuses.map(s => (
                <button
                  key={s}
                  style={{ backgroundColor: filterStatus === s ? "#0284C7" : "white", color: filterStatus === s ? "white" : "#355878", padding: "6px 12px", border: "none 7px", fontSize: "12px", fontWeight: 600, transition: "all 150ms" ,marginLeft: "8px" }}
                  
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1.5 rounded-[7px] text-[12px] font-semibold transition-all duration-150 ${
                    filterStatus === s ? "bg-[#0284C7] text-white shadow-sm" : "bg-white text-[#355878] border border-[rgba(14,165,233,0.15)] hover:border-[#0284C7]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Search box */}
            <div className="flex items-center gap-[8px] bg-white/60 border border-[rgba(14,165,233,0.18)] rounded-[9px] px-[12px] py-[8px] w-[280px] backdrop-blur-[8px]">
              <svg className="w-[14px] h-[14px] fill-none flex-shrink-0" style={{ stroke: "#6B98BA" }} viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                placeholder="Search by file or diagnosis…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none text-[13px] text-[#0A2540] w-full placeholder:text-[#6B98BA] font-[inherit]"
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-[#6B98BA] hover:text-[#0A2540] transition-colors flex-shrink-0">
                  <svg className="w-[12px] h-[12px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {["Scan File", "Date", "Diagnosis", "Confidence", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-[18px] py-[11px] text-left text-[11.5px] font-semibold text-[#6B98BA] tracking-[0.3px] uppercase bg-[rgba(14,165,233,0.04)] border-b border-[rgba(14,165,233,0.1)]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-[18px] py-[28px] text-center text-[13px] text-[#6B98BA]">
                      {search ? "No reports found matching your search." : "No reports yet."}
                    </td>
                  </tr>
                ) : (
                  filtered.map((report) => {
                    const pillVariant = DIAGNOSIS_PILL_MAP[report.primaryDiagnosis] ?? "gray";
                    const pillClass   = PILL_STYLES[pillVariant] ?? PILL_STYLES.gray;
                    const dotClass    = STATUS_DOT[report.status] ?? STATUS_DOT.Pending;

                    return (
                      <tr key={report.scanId} className="border-b border-[rgba(14,165,233,0.06)] last:border-b-0 hover:bg-white/40 transition-colors duration-150 group">
                        <td className="px-[18px] py-[12px]">
                          <p className="text-[13.5px] text-[#0A2540] font-semibold truncate max-w-[200px]">{report.fileName}</p>
                          <p className="text-[11px] text-[#6B98BA]">{report.imageType} · {report.format}</p>
                        </td>

                        <td className="px-[18px] py-[12px] text-[13.5px] text-[#6B98BA]">
                          {new Date(report.scanDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </td>

                        <td className="px-[18px] py-[12px]">
                          <div className="flex flex-col gap-1">
                            <span className={`w-fit text-[10.5px] font-semibold px-[10px] py-[3px] rounded-full ${pillClass}`}>
                              {report.primaryDiagnosis}
                            </span>
                          </div>
                        </td>

                        <td className="px-[18px] py-[12px]">
                          <span className="text-[13.5px] font-bold text-[#0A2540]">
                            {report.confidence > 0 ? `${report.confidence.toFixed(1)}%` : "—"}
                          </span>
                        </td>

                        <td className="px-[18px] py-[12px]">
                          <span className="inline-flex items-center gap-[5px] text-[11.5px] font-medium text-[#355878]">
                            <span className={`w-[6px] h-[6px] rounded-full flex-shrink-0 ${dotClass}`} />
                            {report.status}
                          </span>
                        </td>

                        <td className="px-[18px] py-[12px] text-right">
                          <div className="flex items-center gap-[6px] justify-end">
                            <button
                              onClick={() => handleDownloadPDF(report)}
                                                             style={{fontSize: "12px",fontWeight: "600" ,color: "#fff", padding: "8px 20px", textDecoration: "none" ,border: "none" }}

                              disabled={downloading === report.scanId}
                              className="text-[12px] text-white font-semibold bg-gradient-to-br from-[#38BDF8] to-[#0284C7] px-[11px] py-[4px] rounded-[6px] hover:shadow-[0_3px_10px_rgba(14,165,233,0.3)] transition-all duration-150 inline-flex items-center gap-[4px] disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                              {downloading === report.scanId ? (
                                <div className="w-[10px] h-[10px] border-2 border-white/40 border-t-white rounded-full animate-spin" />
                              ) : (
                                <svg
                            
                                className="w-[10px] h-[10px] stroke-current fill-none" viewBox="0 0 24 24" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                              )}
                              PDF
                            </button>

                            <a
                              href={`/dashboard/analysis?id=${report.scanId}`}
                              className="text-[12px] text-[#0284C7] font-semibold bg-[rgba(14,165,233,0.08)] border border-[rgba(14,165,233,0.18)] px-[11px] py-[4px] rounded-[6px] hover:bg-[rgba(14,165,233,0.14)] transition-colors duration-150 inline-flex items-center gap-[4px]"
                            >
                              View
                              <svg className="w-[10px] h-[10px] stroke-current fill-none" viewBox="0 0 24 24" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                                <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                              </svg>
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer count */}
          <div className="px-[18px] py-[10px] border-t border-[rgba(14,165,233,0.07)] bg-[rgba(14,165,233,0.02)]">
            <p className="text-[11px] text-[#6B98BA]">Showing {filtered.length} of {reports.length} reports</p>
          </div>
        </div>
      )}
    </div>
  );
}
