/* ═══════════════════════════════════════════════════════════════
   NeuroScan AI — GlassCard
   src/components/shared/GlassCard.tsx

   The foundational glassmorphism card used throughout every screen.
   Two size variants: "default" (glass) and "sm" (glass-sm).
   Fully typed, forwards all standard div props.
   ═══════════════════════════════════════════════════════════════ */

import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────

type GlassVariant = "default" | "sm";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  /** "default" → .glass (20px blur, white 55%)
   *  "sm"      → .glass-sm (16px blur, white 55%, radius 12px) */
  variant?: GlassVariant;
  /** Additional class names merged via cn() */
  className?: string;
  children?: ReactNode;
  /** Apply hover lift transform */
  hoverable?: boolean;
  /** Override the default padding (default: none — callers set padding) */
  noPadding?: boolean;
}

// ── Variant class maps ─────────────────────────────────────────

const variantClasses: Record<GlassVariant, string> = {
  default: "glass",   // defined in globals.css @layer components
  sm:      "glass-sm",
};

// ── Component ─────────────────────────────────────────────────

export function GlassCard({
  variant = "default",
  className,
  children,
  hoverable = false,
  noPadding = false,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        variantClasses[variant],
        hoverable &&
          "transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-ice-card",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ── Sub-component: GlassCard.Header ───────────────────────────

interface GlassCardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  action?: ReactNode;
  className?: string;
}

function GlassCardHeader({
  title,
  action,
  className,
  ...props
}: GlassCardHeaderProps) {
  return (
    <div
      className={cn(
        "card-hdr",   // globals.css: padding 16px 18px, border-bottom
        className
      )}
      {...props}
    >
      <span
        className="text-[13.5px] font-semibold"
        style={{ color: "var(--ice-dark)" }}
      >
        {title}
      </span>
      {action && <div>{action}</div>}
    </div>
  );
}

GlassCard.Header = GlassCardHeader;

export default GlassCard;
