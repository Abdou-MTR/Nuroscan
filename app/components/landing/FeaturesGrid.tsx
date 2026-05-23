/* ═══════════════════════════════════════════════════════════════
   NeuroScan AI — FeaturesGrid
   src/components/landing/FeaturesGrid.tsx
   ═══════════════════════════════════════════════════════════════ */

import { FEATURE_CARDS } from "@/data/mock";

// ── Feature icon paths (matching design exactly) ───────────────

const ICON_PATHS: Record<string, string> = {
  "ResNet50V2 Model":
    "M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3",
  "Grad-CAM XAI":
    "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  "PDF Reports":
    "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z",
  "Patient & Doctor Roles":
    "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z",
};

// ── Individual feature card ────────────────────────────────────

function FeatureCard({
  title,
  description,
  delay,
}: {
  title: string;
  description: string;
  delay: string;
}) {
  const iconPath = ICON_PATHS[title];

  return (
    <div
      className="glass animate-fade-up"
      style={{ padding: "20px 18px", animationDelay: delay }}
    >
      {/* Icon background */}
      <div
        className="flex items-center justify-center mb-3"
        style={{
          width: 40,
          height: 40,
          background: "var(--blue-bg)",
          borderRadius: 10,
          border: "1px solid rgba(14,165,233,0.12)",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          fill="none"
          stroke="var(--ice-accent2)"
          style={{ width: 20, height: 20 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
        </svg>
      </div>

      {/* Title */}
      <div
        className="font-semibold mb-[5px]"
        style={{ fontSize: "14px", color: "var(--ice-dark)" }}
      >
        {title}
      </div>

      {/* Description */}
      <div
        style={{ fontSize: "12.5px", color: "var(--ice-text2)", lineHeight: 1.6 }}
      >
        {description}
      </div>
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────

export function FeaturesGrid() {
  return (
    <div
      className="mx-auto"
      style={{
        maxWidth: 1100,
        padding: "0 40px",
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: "16px",
      }}
    >
      {FEATURE_CARDS.map((card, i) => (
        <FeatureCard
          key={card.title}
          title={card.title}
          description={card.description}
          delay={`${0.10 + i * 0.07}s`}
        />
      ))}
    </div>
  );
}

export default FeaturesGrid;
