/* ═══════════════════════════════════════════════════════════════
   NeuroScan AI — Application Constants
   src/data/constants.ts
   ═══════════════════════════════════════════════════════════════ */

import type {
  DiagnosisClass,
  PillVariant,
  ScanStatus,
  SidebarNavItem,
} from "@/types";

// ─────────────────────────────────────────────────────────────────
// APP METADATA
// ─────────────────────────────────────────────────────────────────

export const APP_NAME = "NeuroScan AI" as const;
export const APP_TAGLINE = "Clinical-grade AI brain tumor detection" as const;
export const APP_ACCURACY = 98.05 as const;
export const APP_TRAINING_IMAGES = 12_064 as const;
export const APP_ANALYSIS_TIME = "<3s" as const;
export const APP_VERSION = "1.0.0" as const;

// ─────────────────────────────────────────────────────────────────
// AI MODEL CONSTANTS
// ─────────────────────────────────────────────────────────────────

export const MODEL_BACKBONE = "ResNet50V2" as const;
export const MODEL_VERSION = "V5" as const;
export const MODEL_TTA_PASSES = 10 as const;
export const MODEL_XAI_METHOD = "Grad-CAM" as const;
export const MODEL_TARGET_LAYER = "post_bn" as const;
export const MODEL_OVERLAY_ALPHA = 0.4 as const;

// ─────────────────────────────────────────────────────────────────
// DIAGNOSIS CLASSES
// ─────────────────────────────────────────────────────────────────

export const DIAGNOSIS_CLASSES: DiagnosisClass[] = [
  "Glioma",
  "Meningioma",
  "Pituitary",
  "No Tumor",
];

/** Hex colours for each class (used in probability bars and report) */
export const DIAGNOSIS_COLORS: Record<DiagnosisClass, string> = {
  Glioma:       "#EF4444",
  Meningioma:   "#F59E0B",
  Pituitary:    "#3B82F6",
  "No Tumor":   "#10B981",
};

/** Pill variant for each class */
export const DIAGNOSIS_PILL_VARIANT: Record<DiagnosisClass, PillVariant> = {
  Glioma:       "red",
  Meningioma:   "amber",
  Pituitary:    "blue",
  "No Tumor":   "green",
};

/** Human-readable description for each diagnosis */
export const DIAGNOSIS_DESCRIPTIONS: Record<DiagnosisClass, string> = {
  Glioma:
    "Gliomas are tumors that arise from glial cells in the brain or spinal cord. They are the most common type of primary brain tumor.",
  Meningioma:
    "Meningiomas are typically slow-growing tumors that form on the membranes surrounding the brain and spinal cord.",
  Pituitary:
    "Pituitary tumors develop in the pituitary gland at the base of the brain. Most are benign and non-cancerous.",
  "No Tumor":
    "No tumor detected. The AI model found no significant indication of a brain tumor in this MRI scan.",
};

// ─────────────────────────────────────────────────────────────────
// SCAN STATUS
// ─────────────────────────────────────────────────────────────────

/** All possible scan status values */
export const SCAN_STATUSES: ScanStatus[] = [
  "Critical",
  "Review",
  "Normal",
  "Pending",
];

/** Status label → dot CSS class */
export const STATUS_DOT_CLASS: Record<ScanStatus, string> = {
  Critical: "s-dot-red",
  Review:   "s-dot-amber",
  Normal:   "s-dot-green",
  Pending:  "s-dot-amber",
};

/** Status label → text colour (CSS var or hex) */
export const STATUS_TEXT_COLOR: Record<ScanStatus, string> = {
  Critical: "var(--red)",
  Review:   "var(--amber)",
  Normal:   "var(--green)",
  Pending:  "var(--amber)",
};

/** Confidence threshold (%) above which a scan is considered high-confidence */
export const HIGH_CONFIDENCE_THRESHOLD = 90 as const;

/** Confidence threshold for Critical auto-flag */
export const CRITICAL_CONFIDENCE_THRESHOLD = 85 as const;

// ─────────────────────────────────────────────────────────────────
// UPLOAD CONSTRAINTS
// ─────────────────────────────────────────────────────────────────

export const UPLOAD_MAX_SIZE_MB = 10 as const;
export const UPLOAD_ACCEPTED_FORMATS = ["image/jpeg", "image/png"] as const;
export const UPLOAD_ACCEPTED_EXTENSIONS = [".jpg", ".jpeg", ".png"] as const;
export const UPLOAD_FORMAT_LABELS = ["JPG", "PNG", "Max 10MB"] as const;

// ─────────────────────────────────────────────────────────────────
// NAVIGATION — Patient Sidebar
// ─────────────────────────────────────────────────────────────────

export const PATIENT_NAV_ITEMS: SidebarNavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    iconPath:
      "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75",
  },
  {
    label: "Upload MRI",
    href: "/dashboard/upload",
    iconPath:
      "M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5",
  },
  {
    label: "My Reports",
    href: "/dashboard/reports",
    iconPath:
      "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z",
  },
];

export const PATIENT_ACCOUNT_NAV_ITEMS: SidebarNavItem[] = [
  {
    label: "Profile",
    href: "/dashboard/profile",
    iconPath:
      "M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z",
  },

];

// ─────────────────────────────────────────────────────────────────
// NAVIGATION — Doctor Sidebar
// ─────────────────────────────────────────────────────────────────

export const DOCTOR_NAV_ITEMS: SidebarNavItem[] = [
  {
    label: "Overview",
    href: "/doctor",
    iconPath:
      "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12",
  },
  {
    label: "Patients",
    href: "/doctor/patients",
    iconPath:
      "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z",
  },
  {
    label: "All Reports",
    href: "/doctor/reports",
    iconPath:
      "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12",
  },
];

export const DOCTOR_ACCOUNT_NAV_ITEMS: SidebarNavItem[] = [
  {
    label: "Profile",
    href: "/doctor/profile",
    iconPath:
      "M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0",
  },
];

// ─────────────────────────────────────────────────────────────────
// NAVIGATION — Admin Sidebar
// ─────────────────────────────────────────────────────────────────

export const ADMIN_NAV_ITEMS: SidebarNavItem[] = [
  {
    label: "Users Management",
    href: "/admin",
    iconPath:
      "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
  },
];

export const ADMIN_ACCOUNT_NAV_ITEMS: SidebarNavItem[] = [
 
];

// ─────────────────────────────────────────────────────────────────
// PUBLIC LANDING NAV LINKS
// ─────────────────────────────────────────────────────────────────

export const PUBLIC_NAV_LINKS = [
  { label: "Home",         href: "/" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "About",        href: "/#about" },
  { label: "Contact",      href: "/#contact" },
] as const;

// ─────────────────────────────────────────────────────────────────
// ROUTE CONSTANTS
// ─────────────────────────────────────────────────────────────────

export const ROUTES = {
  HOME:               "/",
  LOGIN:              "/login",
  PATIENT_DASHBOARD:  "/dashboard",
  PATIENT_UPLOAD:     "/dashboard/upload",
  PATIENT_ANALYSIS:   "/dashboard/analysis",
  PATIENT_REPORTS:    "/dashboard/reports",
  PATIENT_PROFILE:    "/dashboard/profile",
  DOCTOR_OVERVIEW:    "/doctor",
  DOCTOR_PATIENTS:    "/doctor/patients",
  DOCTOR_REPORTS:     "/doctor/reports",
  DOCTOR_PROFILE:     "/doctor/profile",
} as const;

// ─────────────────────────────────────────────────────────────────
// ANIMATION DURATIONS (ms)
// ─────────────────────────────────────────────────────────────────

export const ANIMATION = {
  SCAN_DURATION:      3000,   // mri-scanline loop
  FLOAT_DURATION:     4000,   // hero card float
  FADE_UP_DURATION:   400,
  SHIMMER_DURATION:   1800,
  BAR_FILL_DURATION:  600,    // probability bar transition
  HOVER_TRANSITION:   200,
  SIDEBAR_TRANSITION: 150,
} as const;

// ─────────────────────────────────────────────────────────────────
// GLASSMORPHISM TOKENS (for inline style fallbacks)
// ─────────────────────────────────────────────────────────────────

export const GLASS = {
  background:         "rgba(255,255,255,0.55)",
  backgroundSm:       "rgba(255,255,255,0.55)",
  border:             "rgba(255,255,255,0.75)",
  borderSm:           "rgba(255,255,255,0.70)",
  blur:               "blur(20px)",
  blurSm:             "blur(16px)",
  shadow:             "0 4px 24px rgba(14,165,233,0.08)",
  shadowSm:           "0 2px 12px rgba(14,165,233,0.06)",
} as const;

// ─────────────────────────────────────────────────────────────────
// DISCLAIMER TEXT
// ─────────────────────────────────────────────────────────────────

export const AI_DISCLAIMER =
  "This is an AI-assisted result — please consult a qualified radiologist before any clinical decision." as const;

export const REPORT_DISCLAIMER =
  "NeuroScan AI · For informational use only · Not a substitute for professional medical diagnosis" as const;

export const GRADCAM_INTERPRETATION =
  "The Grad-CAM heatmap highlights strong activation in the suspected tumor region. Red/yellow areas indicate the model's highest-confidence focus zones. This is an AI-assisted result — please consult a qualified radiologist before any clinical decision." as const;
