/* ═══════════════════════════════════════════════════════════════
   NeuroScan AI — Class Name Utility
   src/lib/utils.ts
   ═══════════════════════════════════════════════════════════════ */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind class strings safely, resolving conflicts.
 * Uses clsx for conditional logic + tailwind-merge for deduplication.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
