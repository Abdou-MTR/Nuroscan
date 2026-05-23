// src/components/results/ProbabilityList.tsx
"use client";

import type { ClassProbability } from "@/types";

interface ProbabilityListProps {
  probabilities: ClassProbability[];
}

export function ProbabilityList({ probabilities }: ProbabilityListProps) {
  // Sort highest → lowest for display
  const sorted = [...probabilities].sort((a, b) => b.probability - a.probability);

  return (
    <div
      className="
        bg-white/55 border border-white/75 rounded-[12px] p-[13px]
        shadow-[0_2px_12px_rgba(14,165,233,0.06)]
      "
    >
      <p className="text-[10px] font-bold text-[#6B98BA] tracking-[1.2px] uppercase mb-[10px]">
        Class Probabilities
      </p>

      <div className="flex flex-col gap-[8px]">
        {sorted.map((item) => (
          <ProbRow key={item.label} item={item} isTop={item === sorted[0]} />
        ))}
      </div>
    </div>
  );
}

function ProbRow({ item, isTop }: { item: ClassProbability; isTop: boolean }) {
  return (
    <div className="flex items-center gap-[9px]">
      {/* Label */}
      <span
        className={`
          text-[12px] w-[82px] flex-shrink-0 font-medium
          ${isTop ? "text-[#0A2540] font-semibold" : "text-[#355878]"}
        `}
      >
        {item.label}
      </span>

      {/* Bar */}
      <div className="flex-1 h-[5px] bg-[rgba(14,165,233,0.1)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${item.probability}%`,
            background: item.color,
            opacity: isTop ? 1 : 0.65,
          }}
        />
      </div>

      {/* Percentage */}
      <span
        className={`
          text-[11px] w-[32px] text-right font-semibold flex-shrink-0
          ${isTop ? "text-[#0A2540]" : "text-[#6B98BA]"}
        `}
      >
        {item.probability.toFixed(1)}%
      </span>
    </div>
  );
}
