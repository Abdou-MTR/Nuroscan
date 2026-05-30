"use client";

/* ═══════════════════════════════════════════════════════════════
   NeuroScan AI — HeroSection
   src/components/landing/HeroSection.tsx
   ═══════════════════════════════════════════════════════════════ */

import Link from "next/link";
import { HERO_STATS } from "@/data/mock";
import { ROUTES } from "@/data/constants";
import { cn } from "@/lib/utils";

// ── Hero MRI Preview Card ──────────────────────────────────────

function HeroMriCard() {
  return (
    <div className="relative">
      {/* Main glass card */}
      <div
        className="glass animate-fade-up"
        style={{ padding: "24px", animationDelay: "0.2s" }}
      >
        {/* Card header */}
        <div className="flex items-center justify-between mb-4">
          <span
            className="text-[13px] font-semibold"
            style={{ color: "var(--ice-dark)" }}
          >
            MRI Analysis
          </span>
          <span
            className="text-[10px] font-medium px-[9px] py-[3px] rounded-full"
            style={{
              background: "var(--blue-bg)",
              color: "var(--ice-accent2)",
              border: "1px solid var(--ice-border)",
            }}
          >
            T1-Weighted CE
          </span>
        </div>

        {/* MRI placeholder */}
        <div
          className="w-full relative overflow-hidden mb-[14px]"
          style={{
            aspectRatio: "1",
            background:
              "linear-gradient(135deg,#0A1E35,#0A2A40,#0E3550)",
            borderRadius: "12px",
          }}
        >
          {/* Oval brain silhouette */}
          <div
            className="absolute"
            style={{
              width: "68%",
              height: "76%",
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.02)",
              top: "12%",
              left: "16%",
            }}
          >
            {/* Inner brain core */}
            <div
              className="absolute"
              style={{
                width: "32%",
                height: "36%",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                top: "22%",
                left: "34%",
              }}
            />
            {/* Tumor blob */}
            <div
              className="absolute rounded-full"
              style={{
                width: "38%",
                height: "34%",
                background: "rgba(239,68,68,0.30)",
                filter: "blur(10px)",
                top: "30%",
                left: "14%",
              }}
            />
          </div>

          {/* Animated scanline */}
          <div className="mri-scanline" />

          {/* Corner label */}
          <div
            className="absolute bottom-2 left-2 text-[9px] font-semibold tracking-wider"
            style={{ color: "rgba(255,255,255,0.30)" }}
          >
            NEUROSCAN · AI
          </div>
        </div>

        {/* Result row */}
        <div className="flex items-center justify-between">
          <span className="text-[12px]" style={{ color: "var(--ice-text3)" }}>
            Primary diagnosis
          </span>
          <span
            className="text-[13px] font-semibold"
            style={{ color: "var(--red)" }}
          >
            Glioma
          </span>
        </div>

        {/* Confidence bar */}
        <div className="flex items-center gap-2.5 mt-2">
          <div
            className="flex-1 h-[5px] rounded-full overflow-hidden"
            style={{ background: "rgba(14,165,233,0.12)" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: "96%",
                background: "linear-gradient(90deg,#38BDF8,#EF4444)",
              }}
            />
          </div>
          <span
            className="text-[12px] font-semibold"
            style={{ color: "var(--ice-dark)" }}
          >
            96.3%
          </span>
        </div>
      </div>

      {/* Floating probability card */}
      <div
        className="glass-sm absolute animate-float"
        style={{
          bottom: "-20px",
          right: "-20px",
          padding: "14px 16px",
          minWidth: "160px",
          animationDelay: "0.4s",
        }}
      >
        <div
          className="text-[10px] font-medium mb-[6px]"
          style={{ color: "var(--ice-text3)" }}
        >
          Class probabilities
        </div>
        {[
          { label: "Glioma",     pct: 96, color: "#EF4444" },
          { label: "Meningioma", pct: 2,  color: "#F59E0B" },
          { label: "Pituitary",  pct: 1,  color: "#3B82F6" },
          { label: "No Tumor",   pct: 1,  color: "#10B981" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2 mb-[5px] last:mb-0">
            <span
              className="text-[11px] w-[72px] shrink-0"
              style={{ color: "var(--ice-text2)" }}
            >
              {item.label}
            </span>
            <div
              className="flex-1 h-[4px] rounded-full overflow-hidden"
              style={{ background: "rgba(14,165,233,0.10)" }}
            >
              <div
                className="h-full rounded-full"
                style={{ width: `${item.pct}%`, background: item.color }}
              />
            </div>
            <span
              className="text-[10px] w-[24px] text-right"
              style={{ color: "var(--ice-text3)" }}
            >
              {item.pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ paddingBottom: "80px" }}
    >
      {/* Decorative orbs */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 500,
          height: 400,
          background:
            "radial-gradient(ellipse,rgba(56,189,248,0.20),transparent 65%)",
          filter: "blur(40px)",
          opacity: 0.5,
          top: -100,
          right: -80,
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 350,
          height: 280,
          background:
            "radial-gradient(ellipse,rgba(14,165,233,0.10),transparent 65%)",
          filter: "blur(40px)",
          opacity: 0.5,
          bottom: 50,
          left: -50,
        }}
      />

      {/* Ice crystals */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 200,
          height: 200,
          background: "rgba(255,255,255,0.35)",
          border: "1px solid rgba(255,255,255,0.6)",
          top: -60,
          right: 100,
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 120,
          height: 120,
          background: "rgba(255,255,255,0.35)",
          border: "1px solid rgba(255,255,255,0.6)",
          bottom: 80,
          left: 60,
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 80,
          height: 80,
          background: "rgba(255,255,255,0.35)",
          border: "1px solid rgba(255,255,255,0.6)",
          top: 200,
          left: 200,
        }}
      />

      {/* Hero content */}
      <div
        className="relative z-10 mx-auto"
        style={{ maxWidth: 1100, padding: "80px 40px 0" }}
      >
        {/* Two-column hero row */}
        <div
          className="grid gap-[60px] items-center mb-[60px]"
          style={{ gridTemplateColumns: "1fr 420px" }}
        >
          {/* ── Left column ── */}
          <div className="flex flex-col gap-[22px]">
            {/* Tag badge */}
            <div
              className="inline-flex items-center gap-[7px] w-fit animate-fade-up"
              style={{
                background: "rgba(255,255,255,0.60)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(14,165,233,0.20)",
                color: "var(--ice-accent2)",
                fontSize: "12px",
                fontWeight: 500,
                padding: "6px 14px",
                borderRadius: "99px",
              }}
            >
              <span
                className="w-[6px] h-[6px] rounded-full flex-shrink-0"
                style={{ background: "var(--ice-accent)" }}
              />
              AI-Powered Brain Tumor Detection · 98.05% Accuracy
            </div>

            {/* Headline */}
            <h1
              className="animate-fade-up"
              style={{
                fontSize: "52px",
                fontWeight: 700,
                color: "var(--ice-dark)",
                lineHeight: 1.1,
                letterSpacing: "-1.5px",
                animationDelay: "0.05s",
              }}
            >
              Detect brain tumors
              <br />
              with{" "}
              <span
                style={{
                  background: "linear-gradient(135deg,#38BDF8,#0284C7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                clinical-grade
              </span>
              <br />
              AI precision
            </h1>

            {/* Subtitle */}
            <p
              className="animate-fade-up"
              style={{
                fontSize: "16px",
                color: "var(--ice-text2)",
                lineHeight: 1.7,
                maxWidth: "480px",
                fontWeight: 400,
                animationDelay: "0.10s",
              }}
            >
              Upload an MRI scan and receive an instant AI diagnosis with
              Grad-CAM heatmap visualization and a downloadable PDF report in
              under 3 seconds.
            </p>

            {/* CTA buttons */}
            <div
              className="flex gap-3 animate-fade-up"
              style={{ animationDelay: "0.15s" }}
            >
              <Link
                href={ROUTES.PATIENT_UPLOAD}
                className={cn(
                  "no-underline inline-flex items-center",
                  "font-semibold transition-all duration-200"
                )}
                style={{
                  padding: "14px 26px",
                  borderRadius: "10px",
                  fontSize: "14.5px",
                  background: "linear-gradient(135deg,#38BDF8,#0284C7)",
                  color: "#fff",
                  boxShadow: "0 6px 20px rgba(14,165,233,0.30)",
                  border: "none",
                }}
              >
                Upload MRI scan →
              </Link>
            
            </div>

            {/* Stats strip */}
            <div
              className="flex gap-8 animate-fade-up"
              style={{ animationDelay: "0.20s" }}
            >
              {HERO_STATS.map((stat) => (
                <div key={stat.label}>
                  <div
                    className="font-bold"
                    style={{
                      marginBottom: 2, 
                      marginRight: 4,
                      fontSize: "26px",
                      color: "var(--ice-dark)",
                      letterSpacing: "-0.5px",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{ fontSize: "12px", color: "var(--ice-text3)", 
                      marginTop: 2,
                      marginRight: 18,}}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right column: MRI preview ── */}
          <HeroMriCard />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
