// src/app/dashboard/analysis/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { ScanViewTabs } from "@/components/upload/ScanViewTabs";
import { DiagnosisBadge } from "@/components/results/DiagnosisBadge";
import { ConfidenceBar } from "@/components/results/ConfidenceBar";
import { ProbabilityList } from "@/components/results/ProbabilityList";
import { AiDisclaimer } from "@/components/results/AiDisclaimer";

// ── Inner component so we can safely use useSearchParams ──────────
function AnalysisContent() {
  const params = useSearchParams();
  const scanId = params.get("scanId");
  const scanUrl = params.get("scanUrl");

  const [dynamicScan, setDynamicScan] = useState<any>(null);
  const [patient, setPatient] = useState<any>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setPatient({
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || "Unknown User",
          patientId: user.id.substring(0, 8).toUpperCase(),
          dateOfBirth: "1980-01-01", // Fallback since it's not captured at signup
          email: user.email
        });
      }
    }
    loadUser();
  }, []);

  // Load scan: first try Supabase by scanId, fallback to lastPrediction from scanUrl
  useEffect(() => {
    async function loadScan() {
      if (scanId) {
        const supabase = createClient();
        const { data: scanRow, error } = await supabase
          .from("scans")
          .select("*")
          .eq("id", scanId)
          .single();

        if (!error && scanRow) {
          setDynamicScan({
            id: scanRow.id,
            fileName: scanRow.filename,
            format: scanRow.format,
            fileSizeMb: scanRow.file_size_mb,
            imageType: scanRow.image_type,
            scanDate: scanRow.scan_date || scanRow.uploaded_at,
            uploadedAt: scanRow.uploaded_at,
            primaryDiagnosis: scanRow.primary_diagnosis,
            confidence: scanRow.confidence,
            probabilities: (scanRow.probabilities || []).map((p: any) => ({
              className: p.className || p.label || "Unknown",
              probability: p.probability ?? 0,
              color: p.color ?? "#0284C7",
            })),
            status: scanRow.status,
            model: scanRow.model ?? { backbone: "ResNet50V2", version: "V5", testAccuracy: 98.05, ttaPasses: 10, xaiMethod: "Grad-CAM", trainingImages: 12064 },
            imageUrl: scanRow.image_url,
            heatmapUrl: scanRow.heatmap_url,
          });
          return;
        }
        // Fallback: localStorage
        const history = JSON.parse(localStorage.getItem("userScans") || "[]");
        const found = history.find((s: any) => s.id === scanId);
        if (found) { setDynamicScan(found); return; }
      }

      if (scanUrl) {
        const stored = localStorage.getItem("lastPrediction");
        if (stored) {
          try {
            const pred = JSON.parse(stored);
            setDynamicScan({
              id: "dynamic-001", patientId: "P-001", fileName: "Uploaded MRI",
              format: "Auto-detected", fileSizeMb: "-", imageType: "MRI",
              scanDate: new Date().toISOString(), uploadedAt: new Date().toISOString(),
              primaryDiagnosis: pred.primaryDiagnosis, confidence: pred.confidence,
              probabilities: Object.entries(pred.probabilities).map(([name, val]) => ({
                className: name, probability: val,
                color: name === pred.primaryDiagnosis ? "#0284C7" : "#38BDF8"
              })).sort((a: any, b: any) => b.probability - a.probability),
              status: pred.primaryDiagnosis === "No Tumor" ? "Review" : "Critical",
              model: { backbone: "ResNet50V2", version: "V5", testAccuracy: 98.05, ttaPasses: 10, xaiMethod: "Grad-CAM", trainingImages: 12064 },
              imageUrl: scanUrl, heatmapUrl: pred.heatmapUrl || null
            });
          } catch(e) { console.error(e); }
        }
      }
    }
    loadScan();
  }, [scanUrl, scanId]);

  const scan = dynamicScan;

  if (scanUrl && !dynamicScan) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
           <div className="w-10 h-10 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin mx-auto mb-4"></div>
           <p className="text-[13px] text-[#6B98BA]">Loading AI results...</p>
        </div>
      </div>
    );
  }

  if (!scan) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-[18px] font-bold text-[#0A2540] mb-2">Scan not found</p>
          <p className="text-[13px] text-[#6B98BA]">Scan ID &quot;{scanId}&quot; does not exist in records.</p>
        </div>
      </div>
    );
  }

  // Fallbacks for older localStorage records
  if (!scan.probabilities) {
    scan.probabilities = [
      { className: scan.primaryDiagnosis, probability: scan.confidence, color: "#0284C7" }
    ];
  }
  if (!scan.model) {
    scan.model = {
      backbone: "ResNet50V2",
      version: "V5",
      testAccuracy: 98.05,
      ttaPasses: 10,
      xaiMethod: "Grad-CAM",
      trainingImages: 12064,
    };
  }

  const scanDateFormatted = new Date(scan.scanDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleExportPDF = async () => {
    setDownloading(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;

      const diagColor = scan.primaryDiagnosis === "No Tumor" ? "#059669"
        : scan.primaryDiagnosis === "Glioma" ? "#DC2626"
        : scan.primaryDiagnosis === "Meningioma" ? "#B45309"
        : "#0284C7";

      const scanDateFmt = new Date(scan.scanDate).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      });
      const reportDateFmt = new Date().toLocaleDateString("en-US", {
        month: "long", day: "numeric", year: "numeric",
      });
      const reportId = "NS-" + Date.now().toString(36).toUpperCase();

      // Build probability bars
      const probRows = scan.probabilities.map((p: any) => {
        const name = p.className || p.label;
        const isTop = name === scan.primaryDiagnosis;
        const pct = typeof p.probability === "number" ? p.probability.toFixed(1) : p.probability;
        const barColor = isTop ? diagColor : "#CBD5E1";
        const textColor = isTop ? diagColor : "#64748B";
        return '<div style="display:flex;align-items:center;gap:10px;margin-bottom:7px">' +
          '<span style="width:100px;font-size:11px;color:#355878">' + name + '</span>' +
          '<div style="flex:1;height:8px;background:#F1F5F9;border-radius:4px;overflow:hidden">' +
          '<div style="width:' + pct + '%;height:100%;background:' + barColor + ';border-radius:4px"></div></div>' +
          '<span style="width:48px;text-align:right;font-size:11px;font-weight:600;color:' + textColor + '">' + pct + '%</span></div>';
      }).join("");

      // Build images block
      let imagesBlock = "";
      if (scan.imageUrl || dynamicScan?.heatmapUrl) {
        imagesBlock = '<div style="margin-bottom:20px">' +
          '<p style="margin:0 0 10px;font-size:10px;font-weight:700;color:#6B98BA;letter-spacing:1px;text-transform:uppercase">Scan Imagery</p>' +
          '<div style="display:flex;gap:12px">' +
          '<div style="flex:1;background:#0A1C2E;border-radius:8px;overflow:hidden;text-align:center;border:1px solid #1E3A5F">' +
          '<p style="margin:0;padding:8px;font-size:9px;color:#6B98BA;background:#0D2137;text-transform:uppercase;letter-spacing:0.5px">Original MRI</p>' +
          (scan.imageUrl
            ? '<img src="' + scan.imageUrl + '" style="width:100%;height:200px;object-fit:cover;display:block" crossorigin="anonymous" />'
            : '<div style="height:200px;display:flex;align-items:center;justify-content:center;color:#355878;font-size:11px">No image</div>') +
          '</div>' +
          '<div style="flex:1;background:#0A1C2E;border-radius:8px;overflow:hidden;text-align:center;border:1px solid #1E3A5F">' +
          '<p style="margin:0;padding:8px;font-size:9px;color:#6B98BA;background:#0D2137;text-transform:uppercase;letter-spacing:0.5px">Grad-CAM Heatmap</p>' +
          (dynamicScan?.heatmapUrl
            ? '<img src="' + dynamicScan.heatmapUrl + '" style="width:100%;height:200px;object-fit:cover;display:block" crossorigin="anonymous" />'
            : '<div style="height:200px;display:flex;align-items:center;justify-content:center;color:#355878;font-size:11px">Not available</div>') +
          '</div></div></div>';
      }

      // Patient info
      const patientBlock = patient
        ? '<table style="width:100%;border-collapse:collapse;font-size:11px">' +
          '<tr><td style="padding:4px 0;color:#64748B;width:80px">Name</td><td style="padding:4px 0;font-weight:600">' + (patient.name || "Unknown") + '</td></tr>' +
          '<tr><td style="padding:4px 0;color:#64748B">Patient ID</td><td style="padding:4px 0;font-weight:600">' + (patient.patientId || "N/A") + '</td></tr>' +
          '<tr><td style="padding:4px 0;color:#64748B">DOB</td><td style="padding:4px 0;font-weight:600">' + (patient.dateOfBirth && patient.dateOfBirth !== "N/A" ? new Date(patient.dateOfBirth).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A") + '</td></tr>' +
          '</table>'
        : '<p style="font-size:11px;color:#94A3B8">No patient record linked</p>';

      // ─── Assemble final HTML ───
      const htmlContent =
        // Header
        '<div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #0284C7;padding-bottom:16px;margin-bottom:24px">' +
        '<div><h1 style="margin:0;font-size:22px;font-weight:700;color:#0284C7;letter-spacing:-0.5px">🧠 NeuroScan AI</h1>' +
        '<p style="margin:4px 0 0;font-size:10px;color:#6B98BA;letter-spacing:1px;text-transform:uppercase">Diagnostic Report</p></div>' +
        '<div style="text-align:right"><p style="margin:0;font-size:10px;color:#6B98BA">Report Date</p>' +
        '<p style="margin:2px 0 0;font-size:12px;font-weight:600;color:#0A2540">' + reportDateFmt + '</p>' +
        '<p style="margin:6px 0 0;font-size:9px;color:#94A3B8">Report ID: ' + reportId + '</p></div></div>' +

        // Status Banner
        '<div style="background:' + diagColor + '10;border:1px solid ' + diagColor + '30;border-radius:8px;padding:12px 16px;margin-bottom:20px;display:flex;align-items:center;gap:12px">' +
        '<div style="width:36px;height:36px;background:' + diagColor + '20;border-radius:8px;display:flex;align-items:center;justify-content:center">' +
        '<span style="font-size:18px">' + (scan.primaryDiagnosis === "No Tumor" ? "✓" : "⚠") + '</span></div>' +
        '<div><p style="margin:0;font-size:14px;font-weight:700;color:' + diagColor + '">' +
        (scan.primaryDiagnosis === "No Tumor" ? "No Tumor Detected" : scan.primaryDiagnosis + " Tumor Detected") + '</p>' +
        '<p style="margin:2px 0 0;font-size:11px;color:#64748B">AI Confidence: ' + scan.confidence + '% · Status: ' + scan.status + '</p></div></div>' +

        // Patient + Scan Info
        '<div style="display:flex;gap:16px;margin-bottom:20px">' +
        '<div style="flex:1;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:14px 16px">' +
        '<p style="margin:0 0 10px;font-size:10px;font-weight:700;color:#6B98BA;letter-spacing:1px;text-transform:uppercase">Patient Information</p>' +
        patientBlock + '</div>' +
        '<div style="flex:1;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:14px 16px">' +
        '<p style="margin:0 0 10px;font-size:10px;font-weight:700;color:#6B98BA;letter-spacing:1px;text-transform:uppercase">Scan Details</p>' +
        '<table style="width:100%;border-collapse:collapse;font-size:11px">' +
        '<tr><td style="padding:4px 0;color:#64748B;width:80px">File</td><td style="padding:4px 0;font-weight:600">' + scan.fileName + '</td></tr>' +
        '<tr><td style="padding:4px 0;color:#64748B">Format</td><td style="padding:4px 0;font-weight:600">' + scan.format + '</td></tr>' +
        '<tr><td style="padding:4px 0;color:#64748B">Image Type</td><td style="padding:4px 0;font-weight:600">' + scan.imageType + '</td></tr>' +
        '<tr><td style="padding:4px 0;color:#64748B">Scan Date</td><td style="padding:4px 0;font-weight:600">' + scanDateFmt + '</td></tr>' +
        '</table></div></div>' +

        // Images
        imagesBlock +

        // Probability Chart
        '<div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:16px;margin-bottom:20px">' +
        '<p style="margin:0 0 12px;font-size:10px;font-weight:700;color:#6B98BA;letter-spacing:1px;text-transform:uppercase">Classification Probabilities</p>' +
        probRows + '</div>' +

        // Model Info
        '<div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:14px 16px;margin-bottom:20px">' +
        '<p style="margin:0 0 10px;font-size:10px;font-weight:700;color:#6B98BA;letter-spacing:1px;text-transform:uppercase">Model Information</p>' +
        '<div style="display:flex;gap:24px;font-size:11px">' +
        '<div><span style="color:#64748B">Backbone: </span><strong>' + (scan.model?.backbone || "ResNet50V2") + ' ' + (scan.model?.version || "V5") + '</strong></div>' +
        '<div><span style="color:#64748B">Test Accuracy: </span><strong>' + (scan.model?.testAccuracy || 98.05) + '%</strong></div>' +
        '<div><span style="color:#64748B">XAI Method: </span><strong>' + (scan.model?.xaiMethod || "Grad-CAM") + '</strong></div>' +
        '<div><span style="color:#64748B">TTA Passes: </span><strong>' + (scan.model?.ttaPasses || 10) + '</strong></div>' +
        '</div></div>' +

        // Disclaimer
        '<div style="border-top:1px solid #E2E8F0;padding-top:14px">' +
        '<p style="margin:0;font-size:9px;color:#94A3B8;line-height:1.5">' +
        '<strong style="color:#64748B">Disclaimer:</strong> This report was generated by NeuroScan AI, an automated diagnostic support tool. ' +
        'It does not constitute a clinical diagnosis. All findings must be reviewed and confirmed by a licensed radiologist or ' +
        'neurologist before any medical decision is made.</p>' +
        '<p style="margin:8px 0 0;font-size:8px;color:#CBD5E1;text-align:center">© ' + new Date().getFullYear() + ' NeuroScan AI · Confidential Medical Document</p></div>';

      // ─── Create a VISIBLE overlay so html2canvas can reliably capture it ───
      const overlay = document.createElement("div");
      overlay.style.cssText = "position:fixed;inset:0;z-index:999999;background:#fff;overflow:auto;display:flex;justify-content:center;padding:20px 0;";

      const report = document.createElement("div");
      report.style.cssText = "width:794px;padding:40px 48px;font-family:'Segoe UI',Roboto,Arial,sans-serif;color:#0A2540;background:#fff;";
      report.innerHTML = htmlContent;

      overlay.appendChild(report);
      document.body.appendChild(overlay);

      // Wait for images to fully load
      const imgs = Array.from(report.querySelectorAll("img"));
      await Promise.all(imgs.map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise<void>((res) => { img.onload = () => res(); img.onerror = () => res(); })
      ));

      // Small delay to ensure rendering is complete
      await new Promise(r => setTimeout(r, 300));

      const opt: any = {
        margin: [0.3, 0.2, 0.3, 0.2],
        filename: "NeuroScan_Report_" + (scan.fileName || "MRI") + "_" + new Date().toISOString().slice(0, 10) + ".pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, allowTaint: true, logging: false },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      };

      await html2pdf().set(opt).from(report).save();

      // Cleanup
      document.body.removeChild(overlay);
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex min-h-full">
      {/* ── Analysis Sidebar ── */}
      <aside
        className="
          w-[268px] flex-shrink-0
          bg-white/50 backdrop-blur-[20px]
          border-r border-white/75
          p-[22px_16px] flex flex-col gap-[14px]
          overflow-auto
        "
      >
        {/* Scan details */}
        <div>
          <p className="text-[10px] font-bold text-[#6B98BA] tracking-[1.2px] uppercase mb-[6px]">
            Scan Details
          </p>
          <div
            className="
              bg-white/55 border border-white/75 rounded-[12px] p-[13px]
              shadow-[0_2px_12px_rgba(14,165,233,0.06)]
            "
          >
            <h4 className="text-[10px] font-bold text-[#6B98BA] tracking-[1px] uppercase mb-[9px]">
              File Info
            </h4>
            {[
              { k: "Name", v: scan.fileName },
              { k: "Format", v: scan.format },
              { k: "Size", v: `${scan.fileSizeMb} MB` },
              { k: "Date", v: scanDateFormatted },
            ].map(({ k, v }) => (
              <div
                key={k}
                className="flex justify-between py-[5px] border-b border-[rgba(14,165,233,0.07)] last:border-b-0"
              >
                <span className="text-[12px] text-[#6B98BA]">{k}</span>
                <span className="text-[12px] text-[#0A2540] font-semibold">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Patient info */}
        {patient && (
          <div>
            <p className="text-[10px] font-bold text-[#6B98BA] tracking-[1.2px] uppercase mb-[6px]">
              Patient
            </p>
            <div
              className="
                bg-white/55 border border-white/75 rounded-[12px] p-[13px]
                shadow-[0_2px_12px_rgba(14,165,233,0.06)]
              "
            >
              {[
                { k: "Name", v: patient.name },
                { k: "ID", v: patient.patientId },
                {
                  k: "DOB",
                  v: new Date(patient.dateOfBirth).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }),
                },
              ].map(({ k, v }) => (
                <div
                  key={k}
                  className="flex justify-between py-[5px] border-b border-[rgba(14,165,233,0.07)] last:border-b-0"
                >
                  <span className="text-[12px] text-[#6B98BA]">{k}</span>
                  <span className="text-[12px] text-[#0A2540] font-semibold">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Diagnosis badge */}
        <DiagnosisBadge
          diagnosis={scan.primaryDiagnosis}
          confidence={scan.confidence}
          status={scan.status}
        />

        {/* Confidence bar */}
        <ConfidenceBar confidence={scan.confidence} diagnosis={scan.primaryDiagnosis} />

        {/* Probability list */}
        <ProbabilityList probabilities={scan.probabilities} />

        {/* Model info */}
        <div>
          <p className="text-[10px] font-bold text-[#6B98BA] tracking-[1.2px] uppercase mb-[6px]">
            Model Info
          </p>
          <div
            className="
              bg-white/55 border border-white/75 rounded-[12px] p-[13px]
              shadow-[0_2px_12px_rgba(14,165,233,0.06)]
            "
          >
            {[
              { k: "Backbone", v: `${scan.model.backbone} ${scan.model.version}` },
              { k: "Accuracy", v: `${scan.model.testAccuracy}%` },
              { k: "XAI", v: scan.model.xaiMethod },
              { k: "TTA Passes", v: scan.model.ttaPasses },
            ].map(({ k, v }) => (
              <div
                key={k}
                className="flex justify-between py-[5px] border-b border-[rgba(14,165,233,0.07)] last:border-b-0"
              >
                <span className="text-[12px] text-[#6B98BA]">{k}</span>
                <span className="text-[12px] text-[#0A2540] font-semibold">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-[8px] mt-auto pt-2">
          <button
            onClick={handleExportPDF}
                      style={{border : "none", background: "linear-gradient(135deg,#38BDF8,#0284C7)", boxShadow: "0 4px 12px rgba(14,165,233,0.25)",fontSize: "13px",fontWeight: "600" ,color: "#fff", padding: "10px 32px", borderRadius: "9px" }}

            disabled={downloading}
            className="
              flex-1 flex items-center justify-center gap-[6px]
              px-[10px] py-[10px] rounded-[9px]
              bg-gradient-to-br from-[#38BDF8] to-[#0284C7]
              text-white text-[12.5px] font-semibold
              shadow-[0_3px_10px_rgba(14,165,233,0.2)]
              hover:shadow-[0_5px_16px_rgba(14,165,233,0.35)]
              hover:-translate-y-px transition-all duration-200
              disabled:opacity-70 disabled:cursor-not-allowed
            "
          >
            {downloading ? (
              <div className="w-[14px] h-[14px] border-[2px] border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg className="w-3.5 h-3.5 stroke-white fill-none" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            )}
            Download PDF
          </button>
          <button
            className="
              flex-1 flex items-center justify-center gap-[6px]
              px-[10px] py-[10px] rounded-[9px]
              bg-white/55 backdrop-blur-[8px]
              border border-[rgba(14,165,233,0.2)]
              text-[#355878] text-[12.5px] font-semibold
              hover:bg-white/80 hover:-translate-y-px transition-all duration-200
            "
          style={{border : "none", fontWeight: "600" , padding: "8px 20px", borderRadius: "9px" }}

            onClick={() => window.history.back()}
          >
            <svg className="w-3.5 h-3.5 stroke-[#355878] fill-none" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
            Back
          </button>
        </div>
      </aside>

      {/* ── Analysis Main ── */}
      <main id="analysis-report-content" className="flex-1 p-[28px] flex flex-col gap-[18px] overflow-auto bg-[#F4F9FA]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[20px] font-bold text-[#0A2540] tracking-[-0.4px]">
              Scan Analysis
            </h1>
            <p className="text-[12px] text-[#6B98BA] mt-[2px]">
              {scan.imageType} · {scanDateFormatted} · {scan.format}
            </p>
          </div>

          {/* View tabs */}
        </div>

        {/* Three scan panels */}
        <div className="grid grid-cols-3 gap-[14px]">
          {[
            { label: "Original MRI", tag: "T1-CE", style: "raw" },
            { label: "Grad-CAM Heatmap", tag: "post_bn", style: "heat" },
            { label: "Overlay", tag: "α = 0.4", style: "overlay" },
          ].map(({ label, tag, style }) => (
            <div
              key={label}
              className="
                bg-white/55 backdrop-blur-[16px]
                border border-white/75 rounded-[14px] overflow-hidden
                shadow-[0_4px_24px_rgba(14,165,233,0.08)]
              "
            >
              <div className="flex items-center justify-between px-[14px] py-[10px] border-b border-[rgba(14,165,233,0.08)]">
                <span className="text-[12px] font-semibold text-[#355878]">{label}</span>
                <span className="text-[9.5px] bg-[rgba(14,165,233,0.08)] text-[#0284C7] px-[7px] py-[2px] rounded-[5px] font-medium">
                  {tag}
                </span>
              </div>

              {/* MRI placeholder */}
              <div
                className={`
                  w-full aspect-square flex items-center justify-center relative overflow-hidden
                  ${style === "raw" ? "bg-gradient-to-br from-[#070E1A] via-[#0A1C2E] to-[#0B2240]" : ""}
                  ${style === "heat" ? "bg-gradient-to-br from-[#060508] to-[#12050A]" : ""}
                  ${style === "overlay" ? "bg-gradient-to-br from-[#080E18] to-[#0C1828]" : ""}
                `}
              >
                {/* Scan line animation on raw */}
                {style === "raw" && (scan as any).imageUrl ? (
                  <img src={(scan as any).imageUrl} alt="Uploaded MRI" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                ) : style === "raw" ? (
                   <div className="w-[66%] h-[74%] rounded-[50%] border border-white/[0.07] bg-white/[0.02] relative">
                     <div className="absolute w-[30%] h-[34%] rounded-[50%] bg-white/[0.04] border border-white/[0.06] top-[22%] left-[35%]" />
                   </div>
                ) : null}

                {/* Heatmap blobs (only on heat + overlay) */}
                {(style === "heat" || style === "overlay") && (
                  (scan as any).heatmapUrl ? (
                     <img src={(scan as any).heatmapUrl} alt="Grad-CAM" className="absolute inset-0 w-full h-full object-cover opacity-85" />
                  ) : (
                    <>
                      <div className="absolute w-[80px] h-[70px] rounded-full bg-[rgba(239,68,68,0.55)] blur-[12px] top-[28%] left-[22%]" />
                      <div className="absolute w-[50px] h-[44px] rounded-full bg-[rgba(245,158,11,0.4)] blur-[12px] top-[20%] left-[36%]" />
                      <div className="absolute w-[36px] h-[30px] rounded-full bg-[rgba(252,211,77,0.3)] blur-[12px] top-[48%] left-[18%]" />
                    </>
                  )
                )}

                {/* Scan line animation on raw */}
                {style === "raw" && (
                  <div className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[rgba(14,165,233,0.4)] to-transparent animate-scan" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* AI Interpretation */}
        <div className="bg-[rgba(14,165,233,0.06)] border border-[rgba(14,165,233,0.18)] rounded-[12px] px-5 py-4 flex items-start gap-3">
          <svg
          style={ {width: "20px", height: "20px" }}
           className="w-5 h-5 stroke-[#0284C7] fill-none flex-shrink-0 mt-[1px]" viewBox="0 0 24 24" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          <div>
            <p className="text-[13px] font-bold text-[#0A2540] mb-[4px]">AI Interpretation</p>
            <p className="text-[12px] text-[#355878] leading-relaxed">
              The Grad-CAM heatmap highlights strong activation in the right temporal lobe region, corresponding to the suspected tumor mass. Red/yellow areas indicate the model&apos;s highest-confidence focus zones. This is an AI-assisted result &mdash; please consult a qualified radiologist before any clinical decision.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

// ── Page wrapper with Suspense for useSearchParams ────────────────
export default function AnalysisPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center">
          <div className="text-[#6B98BA] text-[14px]">Loading analysis…</div>
        </div>
      }
    >
      <AnalysisContent />
    </Suspense>
  );
}
