/* ═══════════════════════════════════════════════════════════════
   NeuroScan AI — HowItWorksSteps
   src/components/landing/HowItWorksSteps.tsx
   ═══════════════════════════════════════════════════════════════ */

import { HOW_IT_WORKS_STEPS } from "@/data/mock";

// ── Step icon paths ────────────────────────────────────────────

const STEP_ICON_PATHS: string[] = [
  // 1 — Upload
  "M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5",
  // 2 — AI Analysis
  "M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3",
  // 3 — View Results
  "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  // 4 — Download Report
  "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z",
];

// ── Connector arrow between steps ─────────────────────────────

function StepConnector() {
  return (
    <div
      className="flex-shrink-0 flex items-center justify-center"
      style={{ width: 32, paddingTop: 20 }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="rgba(14,165,233,0.35)"
        strokeWidth={1.5}
        style={{ width: 18, height: 18 }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 4.5l7.5 7.5-7.5 7.5"
        />
      </svg>
    </div>
  );
}

// ── Single step card ───────────────────────────────────────────

function StepCard({
  stepNumber,
  title,
  description,
  iconPath,
  delay,
}: {
  stepNumber: number;
  title: string;
  description: string;
  iconPath: string;
  delay: string;
}) {
  return (
    <div
      className="glass flex-1 animate-fade-up"
      style={{ padding: "22px 20px", animationDelay: delay }}
    >
      {/* Step number + icon row */}
      <div className="flex items-center gap-3 mb-[14px]">
        {/* Step number badge */}
        <div
          className="flex-shrink-0 flex items-center justify-center font-bold text-white"
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#38BDF8,#0284C7)",
            fontSize: "12px",
            boxShadow: "0 3px 8px rgba(14,165,233,0.25)",
          }}
        >
          {stepNumber}
        </div>

        {/* Icon circle */}
        <div
          className="flex items-center justify-center"
          style={{
            width: 36,
            height: 36,
            background: "var(--blue-bg)",
            borderRadius: 9,
            border: "1px solid rgba(14,165,233,0.12)",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            fill="none"
            stroke="var(--ice-accent2)"
            style={{ width: 17, height: 17 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
          </svg>
        </div>
      </div>

      {/* Title */}
      <div
        className="font-semibold mb-[6px]"
        style={{ fontSize: "14px", color: "var(--ice-dark)" }}
      >
        {title}
      </div>

      {/* Description */}
      <div
        style={{
          fontSize: "12.5px",
          color: "var(--ice-text2)",
          lineHeight: 1.65,
        }}
      >
        {description}
      </div>
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────

export function HowItWorksSteps() {
  return (
    <section
      id="how-it-works"
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "60px 40px 0",
      }}
    >
      {/* Section header */}
      <div className="text-center mb-[36px]">
        <div
          className="inline-flex items-center gap-2 mb-3"
          style={{
            background: "rgba(14,165,233,0.08)",
            border: "1px solid rgba(14,165,233,0.18)",
            color: "var(--ice-accent2)",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "1.5px",
            padding: "5px 14px",
            borderRadius: "99px",
            textTransform: "uppercase",
          }}
        >
          How It Works
        </div>
        <h2
          className="font-bold"
          style={{
            fontSize: "30px",
            color: "var(--ice-dark)",
            letterSpacing: "-0.6px",
            lineHeight: 1.2,
          }}
        >
          From upload to diagnosis in seconds
        </h2>
        <p
          style={{
            fontSize: "14px",
            color: "var(--ice-text2)",
            marginTop: "10px",
            maxWidth: "480px",
            margin: "10px auto 0",
            lineHeight: 1.65,
          }}
        >
          Four simple steps powered by ResNet50V2 with test-time augmentation
          and Grad-CAM explainability.
        </p>
      </div>

      {/* Steps row with connectors */}
      <div className="flex items-stretch gap-0">
        {HOW_IT_WORKS_STEPS.map((step, i) => (
          <div key={step.stepNumber} className="flex items-stretch flex-1 gap-0">
            <StepCard
              stepNumber={step.stepNumber}
              title={step.title}
              description={step.description}
              iconPath={STEP_ICON_PATHS[i]}
              delay={`${0.08 * i}s`}
            />
            {i < HOW_IT_WORKS_STEPS.length - 1 && <StepConnector />}
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorksSteps;
