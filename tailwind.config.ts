import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ─── Typography ────────────────────────────────────────────────
      fontFamily: {
        sans: ["Space Grotesk", "system-ui", "sans-serif"],
        grotesk: ["Space Grotesk", "sans-serif"],
      },

      // ─── Arctic Ice Color Palette ──────────────────────────────────
      colors: {
        ice: {
          // Background range
          "bg-from": "#EBF5FF",
          "bg-mid": "#D4ECFB",
          "bg-to": "#E8F4FF",
          "body": "#C5DCF0",

          // Core brand tones
          dark: "#0A2540",
          mid: "#1A5276",
          accent: "#0EA5E9",
          accent2: "#0284C7",

          // Text hierarchy
          text: "#0A2540",
          text2: "#355878",
          text3: "#6B98BA",

          // Surface / Glass
          border: "rgba(14,165,233,0.18)",
          card: "rgba(255,255,255,0.60)",
          card2: "rgba(255,255,255,0.45)",
          glass: "rgba(255,255,255,0.55)",

          // Sky accent helpers (scanline gradient)
          sky: "#38BDF8",
        },

        // Semantic status colors
        diagnosis: {
          red: "#EF4444",
          "red-bg": "rgba(239,68,68,0.08)",
          "red-border": "rgba(239,68,68,0.18)",

          green: "#10B981",
          "green-bg": "rgba(16,185,129,0.08)",
          "green-border": "rgba(16,185,129,0.20)",

          amber: "#F59E0B",
          "amber-bg": "rgba(245,158,11,0.08)",
          "amber-border": "rgba(245,158,11,0.20)",

          blue: "#0EA5E9",
          "blue-bg": "rgba(14,165,233,0.08)",
          "blue-border": "rgba(14,165,233,0.18)",
        },

        // MRI dark backgrounds
        mri: {
          900: "#070E1A",
          800: "#0A1C2E",
          700: "#0A1E35",
          600: "#0A2A40",
          500: "#0B2240",
          400: "#0C1828",
          heat: "#12050A",
          "heat-dark": "#080408",
          overlay: "#080E18",
          "overlay-mid": "#0C1625",
        },
      },

      // ─── Background Gradients ──────────────────────────────────────
      backgroundImage: {
        // Page backgrounds
        "ice-bg": "linear-gradient(160deg,#EBF5FF 0%,#D4ECFB 40%,#E8F4FF 100%)",
        "ice-report":
          "linear-gradient(160deg,#C8E4F6 0%,#B8D8EE 100%)",

        // Brand gradients
        "ice-brand": "linear-gradient(135deg,#38BDF8,#0284C7)",
        "ice-brand-135": "linear-gradient(135deg,#38BDF8,#0284C7)",

        // Hero text gradient (clip)
        "ice-text-gradient": "linear-gradient(135deg,#38BDF8,#0284C7)",

        // Confidence bar
        "conf-bar": "linear-gradient(90deg,#38BDF8,#EF4444)",

        // MRI scan panels
        "mri-dark":
          "linear-gradient(135deg,#0A1E35,#0A2A40,#0E3550)",
        "mri-heat": "linear-gradient(135deg,#060508,#12050A)",
        "mri-overlay": "linear-gradient(135deg,#080E18,#0C1828)",
        "mri-panel": "linear-gradient(135deg,#070E1A,#0A1C2E,#0B2240)",

        // Report header
        "report-header": "linear-gradient(135deg,#0A2540,#1A4A7A)",

        // Orb decorations (radial)
        "orb-blue":
          "radial-gradient(ellipse,rgba(56,189,248,0.20),transparent 65%)",
        "orb-accent":
          "radial-gradient(ellipse,rgba(14,165,233,0.10),transparent 65%)",

        // Scanline
        "scanline-h":
          "linear-gradient(90deg,transparent,rgba(14,165,233,0.40),transparent)",
      },

      // ─── Box Shadows ───────────────────────────────────────────────
      boxShadow: {
        "ice-nav": "0 1px 20px rgba(14,165,233,0.08)",
        "ice-card": "0 4px 24px rgba(14,165,233,0.08)",
        "ice-sm": "0 2px 12px rgba(14,165,233,0.06)",
        "ice-btn": "0 4px 12px rgba(14,165,233,0.25)",
        "ice-btn-lg": "0 6px 18px rgba(14,165,233,0.35)",
        "ice-hero-btn": "0 6px 20px rgba(14,165,233,0.30)",
        "ice-hero-btn-hover": "0 10px 28px rgba(14,165,233,0.40)",
        "ice-logo": "0 4px 12px rgba(14,165,233,0.30)",
        "ice-auth": "0 6px 16px rgba(14,165,233,0.30)",
        "ice-auth-focus": "0 0 0 3px rgba(14,165,233,0.10)",
        "ice-report": "0 20px 60px rgba(10,37,64,0.12)",
        "ice-brand-sm": "0 3px 10px rgba(14,165,233,0.20)",
        "ice-tab": "0 2px 8px rgba(14,165,233,0.10)",
        "ice-vtab": "0 2px 8px rgba(14,165,233,0.12)",
      },

      // ─── Border Radius ─────────────────────────────────────────────
      borderRadius: {
        "ice-card": "16px",
        "ice-card-sm": "12px",
        "ice-btn": "8px",
        "ice-btn-lg": "10px",
        "ice-input": "9px",
        "ice-logo": "9px",
        "ice-sidebar-icon": "7px",
        "ice-report": "22px",
      },

      // ─── Backdrop Blur ─────────────────────────────────────────────
      backdropBlur: {
        "ice-nav": "20px",
        "ice-glass": "20px",
        "ice-glass-sm": "16px",
        "ice-sidebar": "20px",
        "ice-card": "12px",
        "ice-btn": "8px",
        "ice-report": "24px",
        xs: "4px",
      },

      // ─── Blur ──────────────────────────────────────────────────────
      blur: {
        "orb": "40px",
        "heat-blob": "12px",
        "heat-blob-lg": "13px",
        "overlay-blob": "10px",
        "overlay-blob-sm": "8px",
      },

      // ─── Spacing / Sizing extensions ───────────────────────────────
      width: {
        "sidebar": "224px",
        "analysis-sidebar": "268px",
        "auth-card": "460px",
      },
      height: {
        "nav": "62px",
      },
      minHeight: {
        "dash": "calc(100vh - 62px)",
      },

      // ─── Letter Spacing ────────────────────────────────────────────
      letterSpacing: {
        "ice-tight": "-1.5px",
        "ice-badge": "1.5px",
        "ice-section": "1.5px",
        "ice-label": "0.2px",
        "ice-mono": "0.5px",
      },

      // ─── Font Sizes (custom scale matching design) ─────────────────
      fontSize: {
        "2xs": ["9px", { lineHeight: "1.4" }],
        "icon-label": ["9.5px", { lineHeight: "1.4" }],
        "badge": ["10px", { lineHeight: "1.4" }],
        "badge-lg": ["10.5px", { lineHeight: "1.4" }],
        "nav-link": ["14px", { lineHeight: "1.5" }],
      },

      // ─── Keyframe Animations ───────────────────────────────────────
      keyframes: {
        // MRI scanline — continuous vertical sweep
        scan: {
          "0%": { top: "0%" },
          "100%": { top: "100%" },
        },
        // Subtle float for hero card decorations
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        // Fade up entrance
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        // Pulse glow for status dots
        "pulse-glow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        // Shimmer for loading states
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },

      animation: {
        // MRI scanline — 3s linear infinite (from design)
        scan: "scan 3s linear infinite",
        // Hero card float
        float: "float 4s ease-in-out infinite",
        // Entrance
        "fade-up": "fade-up 0.4s ease-out both",
        // Status dot pulse
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        // Shimmer
        shimmer: "shimmer 1.8s linear infinite",
      },

      // ─── Grid Template Columns ─────────────────────────────────────
      gridTemplateColumns: {
        "hero": "1fr 420px",
        "features": "repeat(4,1fr)",
        "dash-content": "1fr 320px",
        "doctor": "1fr 260px",
        "report-scans": "repeat(3,1fr)",
        "report-meta": "1fr 1fr",
        "scan-panels": "repeat(3,1fr)",
        "stats-4": "repeat(4,1fr)",
      },

      // ─── Opacity ───────────────────────────────────────────────────
      opacity: {
        "15": "0.15",
        "35": "0.35",
        "45": "0.45",
        "55": "0.55",
        "65": "0.65",
        "85": "0.85",
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: "#0EA5E9",
              foreground: "#FFFFFF",
              50: "#EBF5FF",
              100: "#D4ECFB",
              200: "#BAE6FD",
              300: "#7DD3FC",
              400: "#38BDF8",
              500: "#0EA5E9",
              600: "#0284C7",
              700: "#0369A1",
              800: "#075985",
              900: "#0A2540",
            },
            danger: {
              DEFAULT: "#EF4444",
              foreground: "#FFFFFF",
            },
            success: {
              DEFAULT: "#10B981",
              foreground: "#FFFFFF",
            },
            warning: {
              DEFAULT: "#F59E0B",
              foreground: "#FFFFFF",
            },
            background: "#C5DCF0",
            foreground: "#0A2540",
          },
        },
      },
    }),
  ],
};

export default config;
