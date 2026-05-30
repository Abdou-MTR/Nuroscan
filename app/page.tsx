/* ═══════════════════════════════════════════════════════════════
   NeuroScan AI — Landing Page
   src/app/page.tsx
   ═══════════════════════════════════════════════════════════════ */

import type { Metadata } from "next";
import { AppNavbar }       from "@/components/layout/AppNavbar";
import { HeroSection }     from "@/components/landing/HeroSection";
import { FeaturesGrid }    from "@/components/landing/FeaturesGrid";
import { HowItWorksSteps } from "@/components/landing/HowItWorksSteps";
import { CtaBanner }       from "@/components/landing/CtaBanner";
import { ContactSection }  from "@/components/landing/ContactSection";

export const metadata: Metadata = {
  title: "NeuroScan AI — Clinical-Grade Brain Tumor Detection",
  description:
    "Upload an MRI scan and receive an instant AI diagnosis with Grad-CAM heatmap visualization and a downloadable PDF report in under 3 seconds. ResNet50V2 · 98.05% accuracy.",
};

// ── Footer ─────────────────────────────────────────────────────

function LandingFooter() {


  return (
    <footer
      style={{
        borderTop: "1px solid rgba(14,165,233,0.10)",
        background: "rgba(255,255,255,0.40)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div
        className="mx-auto flex items-center justify-between flex-wrap gap-4"
        style={{  padding: "20px 40px" }}
      >
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center font-bold text-white"
            style={{
                  color: "#fff",
          background: "linear-gradient(135deg,#38BDF8,#0284C7)",
          boxShadow: "0 4px 12px rgba(14,165,233,0.30)",
              width: 26,
              height: 26,
              borderRadius: 6,
             marginRight: "6px",
              fontSize: "10px",
            }}
          >
            N
          </div>
          <span
            className="font-semibold"
            style={{ fontSize: "13px", color: "var(--ice-dark)"   , fontWeight: "600" ,marginRight: "8px" }}
          >
            NeuroScan 
          </span>
          <span
        className="text-[9px] font-semibold px-8 py-1 rounded-full tracking-[0.5px]"
        style={{
          padding: "8px 8px",
          background: "rgba(14,165,233,0.08)",
          color: "var(--ice-accent)",
          border: "1px solid rgba(14,165,233,0.18)",
        }}
      >
        AI
      </span>
        </div>

        {/* Disclaimer */}
        <p style={{ fontSize: "11px", color: "var(--ice-text3)" }}>
          For informational use only · Not a substitute for professional medical
          diagnosis
        </p>

        {/* Copyright */}
        <p style={{ fontSize: "11px", color: "var(--ice-text3)" }}>
          © {new Date().getFullYear()} NeuroScan AI
        </p>
      </div>
    </footer>
  );
}

// ── Divider ────────────────────────────────────────────────────

function SectionDivider() {
  return (
    <div
      style={{
        height: 1,
        background:
          "linear-gradient(90deg,transparent,rgba(14,165,233,0.20),transparent)",
        margin: "0",
      }}
    />
  );
}

// ── Page ───────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div
      style={{
        background: "linear-gradient(160deg,#EBF5FF 0%,#D4ECFB 40%,#E8F4FF 100%)",
        minHeight: "100vh",
      }}
    >
      {/* Sticky navigation */}
      <AppNavbar />

      {/* Hero + floating MRI card */}
      <HeroSection />

      {/* Features cards strip — sits directly below hero */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px" }}>
        <FeaturesGrid />
      </div>

      <SectionDivider />

      {/* How it works numbered steps */}
      <HowItWorksSteps />

      <SectionDivider />

      {/* CTA banner with gradient dark card */}
      <CtaBanner />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
