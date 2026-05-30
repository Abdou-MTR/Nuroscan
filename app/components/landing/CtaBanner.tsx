/* ═══════════════════════════════════════════════════════════════
   NeuroScan AI — CtaBanner
   src/components/landing/CtaBanner.tsx
   ═══════════════════════════════════════════════════════════════ */

import Link from "next/link";
import { ROUTES, APP_ACCURACY } from "@/data/constants";

// ── Stat pill ─────────────────────────────────────────────────

function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <div
      className="flex flex-col items-center px-6 py-3 rounded-[12px]"
      style={{
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.15)",
        marginBottom: 12, marginRight: 12  ,
        padding: "14px 30px",
      }}
    >
      <span
        className="font-bold"
        style={{ fontSize: "22px", color: "#fff", letterSpacing: "-0.4px" }}
      >
        {value}
      </span>
      <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)", marginTop: 1 }}>
        {label}
      </span>
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────

export function CtaBanner() {
  return (
    <section
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "60px 40px 80px",
      }}
    >
      <div
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg,#0A2540,#1A4A7A)",
          borderRadius: "20px",
          padding: "52px 56px",
          boxShadow: "0 20px 60px rgba(10,37,64,0.18)",
        }}
      >
        {/* Decorative orb */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 340,
            height: 280,
            background:
              "radial-gradient(ellipse,rgba(56,189,248,0.18),transparent 65%)",
            filter: "blur(40px)",
            top: -60,
            right: -40,
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 200,
            height: 160,
            background:
              "radial-gradient(ellipse,rgba(14,165,233,0.12),transparent 65%)",
            filter: "blur(40px)",
            bottom: -20,
            left: -20,
          }}
        />

        {/* Ice crystal accents */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 120,
            height: 120,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            top: -30,
            left: "20%",
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 70,
            height: 70,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            bottom: -15,
            right: "25%",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center gap-6">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2"
            style={{
              background: "rgba(56,189,248,0.15)",
              border: "1px solid rgba(56,189,248,0.30)",
              color: "#7DD3FC",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "1.5px",
              padding: "5px 14px",
              borderRadius: "99px",
              textTransform: "uppercase",
            }}
          >
            <span
              className="w-[5px] h-[5px] rounded-full flex-shrink-0"
              style={{ background: "#38BDF8" }}
            />
            Clinical-Grade AI · ResNet50V2 V5
          </div>

          {/* Headline */}
          <h2
            className="font-bold"
            style={{
              fontSize: "36px",
              color: "#fff",
              letterSpacing: "-0.8px",
              lineHeight: 1.15,
              maxWidth: 560,
            }}
          >
            Ready to analyse your first MRI scan?
          </h2>

          {/* Sub */}
          <p
            style={{
              fontSize: "15px",
              color: "rgba(255,255,255,0.60)",
              lineHeight: 1.7,
              maxWidth: 460, 
              marginBottom: 12,
            }}
          >
            Join patients and clinicians using NeuroScan AI for fast, transparent
            brain tumor classification with {APP_ACCURACY}% TTA accuracy.
          </p>

          {/* Stats strip */}
          <div className="flex items-center gap-3 flex-wrap justify-center"
          style={{ marginBottom: 12 }}>
            
            <StatPill value="98.05%" label="TTA Accuracy"  />
            <StatPill value="12,064" label="Training images"  />
            <StatPill value="4"      label="Tumor classes" />
            <StatPill value="<10s"    label="Per scan" />
          </div>

          {/* CTA buttons */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <Link
              href={ROUTES.LOGIN}
              className="no-underline font-semibold transition-all duration-200 inline-flex items-center"
              style={{ marginBottom: 12, marginRight: 12  ,
                padding: "14px 30px",
                borderRadius: "10px",
                fontSize: "14.5px",
                background: "linear-gradient(135deg,#38BDF8,#0284C7)",
                color: "#fff",
                boxShadow: "0 6px 20px rgba(56,189,248,0.30)",
              }}
            >
              Get started free →
            </Link>
            <Link
              href={ROUTES.LOGIN}
              className="no-underline font-semibold transition-all duration-200 inline-flex items-center"
              style={{
                marginBottom: 12, marginRight: 12  ,
                padding: "14px 30px",
                borderRadius: "10px",
                fontSize: "14.5px",
                background: "rgba(255,255,255,0.10)",
                color: "rgba(255,255,255,0.80)",
                border: "1px solid rgba(255,255,255,0.20)",
                backdropFilter: "blur(8px)",
              }}
            >
              Doctor portal
            </Link>
          </div>

          {/* Disclaimer */}
          <p
            style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.30)",
              marginTop: 8,
            }}
          >
            For informational use only · Not a substitute for professional medical diagnosis
          </p>
        </div>
      </div>
    </section>
  );
}

export default CtaBanner;
