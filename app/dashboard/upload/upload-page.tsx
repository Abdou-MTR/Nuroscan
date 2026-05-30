// app/dashboard/upload/upload-page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DropZone } from "@/components/upload/DropZone";
import type { UploadState } from "@/types";
import { createClient } from "@/utils/supabase/client";

export default function UploadPage() {
  const router = useRouter();
  const [uploadState, setUploadState] = useState<UploadState>({ file: null, progress: 0, status: "idle" });
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    }
    getUser();
  }, []);

  async function handleFileAccepted(url: string) {
    setUploadState({ file: new File([], "scan.jpg"), progress: 100, status: "processing" });

    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: url })
      });

      if (!response.ok) throw new Error("AI Prediction failed");

      const predictionData = await response.json();

      const probabilities = Object.entries(predictionData.probabilities || {}).map(([name, val]) => ({
        className: name,
        probability: val,
        color: name === predictionData.primaryDiagnosis ? "#0284C7" : "#38BDF8"
      })).sort((a: any, b: any) => b.probability - a.probability);

      const model = {
        backbone: "ResNet50V2", version: "V5", testAccuracy: 98.05,
        ttaPasses: 10, xaiMethod: "Grad-CAM", trainingImages: 12064,
      };

      const status = predictionData.primaryDiagnosis === "No Tumor" ? "Review" : "Critical";
      const now = new Date().toISOString();

      // Save scan to Supabase linked to the logged-in patient
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const currentUserId = user?.id || null;
      const { data: scanData, error: scanError } = await supabase.from("scans").insert({
        patient_id: null, // patient uploads don't have a separate patient row yet
        filename: "Uploaded_MRI_" + Date.now().toString().slice(-4) + ".jpg",
        format: "JPG",
        file_size_mb: 2.1,
        image_type: "MRI",
        scan_date: now,
        uploaded_at: now,
        primary_diagnosis: predictionData.primaryDiagnosis,
        confidence: predictionData.confidence,
        probabilities,
        status,
        model,
        image_url: url,
        heatmap_url: predictionData.heatmapUrl || null,
        uploader_id: currentUserId,
      }).select("id").single();

      if (scanError) {
        console.error("Error saving scan to DB:", scanError);
        // Fallback: localStorage
        const history = JSON.parse(localStorage.getItem("userScans") || "[]");
        const newScan = {
          id: "scan-" + Date.now(),
          fileName: "Uploaded_MRI_" + Date.now().toString().slice(-4) + ".jpg",
          format: "JPG", fileSizeMb: "2.1", imageType: "MRI",
          scanDate: now, uploadedAt: now,
          primaryDiagnosis: predictionData.primaryDiagnosis,
          confidence: predictionData.confidence,
          probabilities, status, model,
          imageUrl: url, heatmapUrl: predictionData.heatmapUrl || null
        };
        history.unshift(newScan);
        localStorage.setItem("userScans", JSON.stringify(history));
        localStorage.setItem("lastPrediction", JSON.stringify(predictionData));
        setUploadState((s) => ({ ...s, status: "done" }));
        router.push(`/dashboard/analysis?scanUrl=${encodeURIComponent(url)}`);
        return;
      }

      setUploadState((s) => ({ ...s, status: "done" }));
      router.push(`/dashboard/analysis?scanId=${scanData.id}`);
    } catch (err) {
      console.error(err);
      alert("There was an error communicating with the AI model server.");
      setUploadState({ file: null, progress: 0, status: "idle" });
    }
  }

  return (
    <div className="flex-1 p-8 overflow-auto">
      {/* Page Header */}
      <div className="mb-7 flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-[#0A2540] tracking-[-0.5px]">Upload MRI Scan</h1>
          <p className="text-[13px] text-[#6B98BA] mt-[3px]">Upload a brain MRI image for AI-powered tumor classification</p>
        </div>
        <button
          className="font-semibold transition-all duration-200"
          style={{
            padding: "10px 16px",
            borderRadius: "9px",
            fontSize: "14px",
            background: "linear-gradient(135deg,#38BDF8,#0284C7)",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(14,165,233,0.25)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
          onClick={() => router.push("/dashboard")}
        >
          <svg className="w-4 h-4 stroke-[#fff] fill-none" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
          </svg>
          Back to Dashboard
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-[1fr_280px] gap-[18px] relative">
        {uploadState.status === "processing" && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center rounded-xl border border-sky-100 shadow-sm">
            <div className="w-10 h-10 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-sky-800 font-medium tracking-wide">AI is analyzing the scan...</p>
          </div>
        )}

        <DropZone onUploadComplete={handleFileAccepted} />

        <div className="flex flex-col gap-[14px]">
          <div className="bg-white/55 backdrop-blur-[16px] border border-white/75 rounded-[14px] p-[16px] shadow-[0_2px_12px_rgba(14,165,233,0.06)]">
            <h3 className="text-[11px] font-bold text-[#6B98BA] tracking-[1.2px] uppercase mb-3">How it works</h3>
            <ol className="flex flex-col gap-[10px]">
              {[
                { n: "1", text: "Upload a JPG, PNG, DICOM, or NIfTI MRI image." },
                { n: "2", text: "The AI model runs 10 test-time augmentation passes." },
                { n: "3", text: "Grad-CAM heatmap highlights suspect regions." },
                { n: "4", text: "Review the full probability breakdown & download a PDF report." },
              ].map((step) => (
                <li key={step.n} className="flex items-start gap-[10px]">
                  <span className="w-[20px] h-[20px] rounded-full flex-shrink-0 bg-gradient-to-br from-[#38BDF8] to-[#0284C7] text-white text-[10px] font-bold flex items-center justify-center mt-[1px]">
                    {step.n}
                  </span>
                  <span className="text-[12px] text-[#355878] leading-relaxed">{step.text}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-white/55 backdrop-blur-[16px] border border-white/75 rounded-[14px] p-[16px] shadow-[0_2px_12px_rgba(14,165,233,0.06)]">
            <h3 className="text-[11px] font-bold text-[#6B98BA] tracking-[1.2px] uppercase mb-3">Accepted Formats</h3>
            <div className="grid grid-cols-2 gap-[7px]">
              {([{ fmt: "JPG", note: "JPEG images" }, { fmt: "PNG", note: "Lossless PNG" }, { fmt: "DICOM", note: ".dcm files" }, { fmt: "NIfTI", note: ".nii / .nii.gz" }] as const).map(({ fmt, note }) => (
                <div key={fmt} className="bg-white/65 border border-[rgba(14,165,233,0.15)] rounded-[8px] px-[10px] py-[8px]">
                  <div className="text-[12px] font-bold text-[#0A2540]">{fmt}</div>
                  <div className="text-[10.5px] text-[#6B98BA]">{note}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[rgba(14,165,233,0.06)] border border-[rgba(14,165,233,0.18)] rounded-[12px] p-[13px]">
            <p className="text-[11px] text-[#355878] leading-relaxed">
              <span className="font-semibold text-[#0284C7]">Note: </span>
              Results are AI-assisted and for informational purposes only. Always consult a qualified radiologist for clinical decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
