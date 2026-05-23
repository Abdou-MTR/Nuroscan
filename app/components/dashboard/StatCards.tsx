// src/components/dashboard/StatCards.tsx
"use client";

import type { PatientStatCard } from "@/types";

interface StatCardsProps {
  cards: PatientStatCard[];
}

export function StatCards({ cards }: StatCardsProps) {
  return (
    <div className="grid grid-cols-4 gap-[14px] mb-[22px]">
      {cards.map((card) => (
        <StatCard key={card.label} card={card} />
      ))}
    </div>
  );
}

function StatCard({ card }: { card: PatientStatCard }) {
  return (
    <div
      className="
        bg-white/55 backdrop-blur-[20px]
        border border-white/75 rounded-[16px]
        px-[20px] py-[18px]
        shadow-[0_4px_24px_rgba(14,165,233,0.08)]
      "
    >
      {/* Label */}
      <p className="text-[11.5px] font-semibold text-[#6B98BA] tracking-[0.2px] mb-[8px] uppercase">
        {card.label}
      </p>

      {/* Value */}
      <p
        className="text-[26px] font-bold tracking-[-0.5px] leading-none"
        style={{ color: card.valueColor ?? "#0A2540" }}
      >
        {card.value}
      </p>

      {/* Sub-text row */}
      <div className="flex items-center gap-[4px] mt-[6px]">
        {card.delta && (
          <span className="text-[11px] font-semibold text-[#10B981]">{card.delta}</span>
        )}
        <span className="text-[11px] text-[#6B98BA]">{card.subText}</span>
      </div>
    </div>
  );
}
