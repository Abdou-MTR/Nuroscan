/* ═══════════════════════════════════════════════════════════════
   NeuroScan AI — Root Layout
   src/app/layout.tsx
   ═══════════════════════════════════════════════════════════════ */

import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

// ── Space Grotesk via next/font/google ─────────────────────────
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

// ── App Metadata ───────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: "NeuroScan AI — Clinical-Grade Brain Tumor Detection",
    template: "%s | NeuroScan AI",
  },
  description:
    "Upload an MRI scan and receive an instant AI diagnosis with Grad-CAM heatmap visualization and a downloadable PDF report in under 3 seconds. ResNet50V2 · 98.05% accuracy.",
  keywords: [
    "brain tumor detection",
    "MRI analysis",
    "AI radiology",
    "Grad-CAM",
    "NeuroScan",
    "medical imaging",
    "ResNet50V2",
  ],
  authors: [{ name: "NeuroScan AI" }],
  creator: "NeuroScan AI",
  metadataBase: new URL("https://neuroscan.ai"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://neuroscan.ai",
    siteName: "NeuroScan AI",
    title: "NeuroScan AI — Clinical-Grade Brain Tumor Detection",
    description:
      "AI-powered MRI analysis with 98.05% accuracy. Grad-CAM heatmaps, PDF reports, and role-based portals for patients and clinicians.",
  },
  twitter: {
    card: "summary_large_image",
    title: "NeuroScan AI",
    description: "AI-powered MRI brain tumor detection · 98.05% accuracy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0EA5E9",
  width: "device-width",
  initialScale: 1,
};

// ── Root Layout ────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={spaceGrotesk.variable} suppressHydrationWarning>
      <body className={`${spaceGrotesk.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
