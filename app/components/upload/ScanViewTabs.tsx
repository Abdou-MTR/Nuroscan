// src/components/upload/ScanViewTabs.tsx
"use client";

import { useState } from "react";
import type { ScanViewMode } from "@/types";

const TABS: ScanViewMode[] = ["Grad-CAM", "Overlay", "Raw scan"];

interface ScanViewTabsProps {
  /** Controlled value — if omitted the component manages its own state */
  value?: ScanViewMode;
  onChange?: (mode: ScanViewMode) => void;
  /** Optional default selection (uncontrolled). Defaults to "Grad-CAM". */
  defaultValue?: ScanViewMode;
}

export function ScanViewTabs({
  value,
  onChange,
  defaultValue = "Grad-CAM",
}: ScanViewTabsProps) {
  const [internal, setInternal] = useState<ScanViewMode>(defaultValue);

  const active = value ?? internal;

  function select(tab: ScanViewMode) {
    if (!value) setInternal(tab);
    onChange?.(tab);
  }

  return (
    <div
      className="
        inline-flex items-center
        bg-white/50 backdrop-blur-[8px]
        border border-[rgba(14,165,233,0.15)]
        rounded-[9px] p-[3px] gap-[2px]
      "
      role="tablist"
      aria-label="Scan view mode"
    >
      {TABS.map((tab) => {
        const isActive = active === tab;
        return (
          <button
            key={tab}
            role="tab"
            aria-selected={isActive}
            onClick={() => select(tab)}
            className={`
              px-[15px] py-[6px] rounded-[7px]
              text-[12.5px] font-medium
              transition-all duration-200 cursor-pointer
              ${
                isActive
                  ? "bg-white/85 text-[#0A2540] shadow-[0_2px_8px_rgba(14,165,233,0.1)]"
                  : "text-[#6B98BA] hover:text-[#355878] hover:bg-white/30"
              }
            `}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
