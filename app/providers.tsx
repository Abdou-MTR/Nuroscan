"use client";

/* ═══════════════════════════════════════════════════════════════
   NeuroScan AI — Client Providers
   src/app/providers.tsx

   Wraps the app with HeroUI's NextUIProvider so all HeroUI
   components (Button, Table, Modal, etc.) receive their theme
   context. Kept as a separate "use client" boundary so the root
   layout stays a Server Component.
   ═══════════════════════════════════════════════════════════════ */

import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/navigation";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const router = useRouter();

  return (
    <NextUIProvider navigate={router.push}>
      {children}
    </NextUIProvider>
  );
}
