/* ═══════════════════════════════════════════════════════════════
   NeuroScan AI — Core TypeScript Definitions
   src/types/index.ts
   ═══════════════════════════════════════════════════════════════ */

// ─────────────────────────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────────────────────────

/** User roles mapped to separate portal routing */
export type UserRole = "patient" | "doctor" | "admin";

/** Four supported tumor classification classes */
export type DiagnosisClass =
  | "Glioma"
  | "Meningioma"
  | "Pituitary"
  | "No Tumor";

/** Review / clinical status for a scan or patient record */
export type ScanStatus = "Critical" | "Review" | "Normal" | "Pending";

/** Pill colour variants tied to diagnosis or status */
export type PillVariant = "red" | "green" | "amber" | "blue";

/** MRI image type codes */
export type MriImageType =
  | "T1-CE"
  | "T1-weighted CE"
  | "T2-FLAIR"
  | "T1"
  | "T2"
  | "FLAIR";

/** Analysis view mode for scan panels */
export type ScanViewMode = "Grad-CAM" | "Overlay" | "Raw scan";

/** Supported upload file formats */
export type ScanFileFormat = "JPG" | "PNG" | "DICOM" | "NIfTI";

// ─────────────────────────────────────────────────────────────────
// UTILITY MAPS
// ─────────────────────────────────────────────────────────────────

/** Map each DiagnosisClass to its PillVariant */
export const DIAGNOSIS_PILL_MAP: Record<DiagnosisClass, PillVariant> = {
  Glioma: "red",
  Meningioma: "amber",
  Pituitary: "blue",
  "No Tumor": "green",
};

/** Map each ScanStatus to its dot colour class */
export const STATUS_DOT_MAP: Record<ScanStatus, string> = {
  Critical: "s-dot-red",
  Review: "s-dot-amber",
  Normal: "s-dot-green",
  Pending: "s-dot-amber",
};

// ─────────────────────────────────────────────────────────────────
// USER / AUTH
// ─────────────────────────────────────────────────────────────────

/** Authenticated user profile (shared fields) */
export interface BaseUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarInitials: string;
  /** Tailwind/CSS gradient string for the avatar background */
  avatarGradient: string;
  /** Tailwind/CSS color string for the avatar text */
  avatarTextColor: string;
  createdAt: string; // ISO 8601
}

/** Patient-specific user profile */
export interface PatientUser extends BaseUser {
  role: "patient";
  dateOfBirth: string; // ISO 8601
  patientId: string;   // e.g. "P-001"
  assignedDoctorId: string;
}

/** Doctor / clinician profile */
export interface DoctorUser extends BaseUser {
  role: "doctor";
  specialty: string;      // e.g. "Radiologist"
  licenseNumber: string;
  hospitalAffiliation: string;
}

/** Admin / system profile */
export interface AdminUser extends BaseUser {
  role: "admin";
}

export type AppUser = PatientUser | DoctorUser | AdminUser;

// ─────────────────────────────────────────────────────────────────
// SCAN ANALYSIS
// ─────────────────────────────────────────────────────────────────

/** Individual class probability from the AI model */
export interface ClassProbability {
  label: DiagnosisClass;
  /** 0–100, percentage */
  probability: number;
  /** Hex color used for the probability bar */
  color: string;
}

/** Grad-CAM heatmap metadata */
export interface GradCamMetadata {
  /** Layer name used for Grad-CAM extraction */
  targetLayer: string;
  /** Overlay alpha blending value (0–1) */
  overlayAlpha: number;
}

/** AI model inference metadata */
export interface ModelMetadata {
  backbone: string;          // e.g. "ResNet50V2"
  version: string;           // e.g. "V5"
  testAccuracy: number;      // 0–100, e.g. 98.05
  ttaPasses: number;         // test-time augmentation passes
  xaiMethod: string;         // e.g. "Grad-CAM"
  trainingImages: number;    // e.g. 12064
}

/** A single MRI scan record with AI results */
export interface ScanRecord {
  id: string;
  patientId: string;
  /** Display filename, e.g. "MRI_Dec15_001" */
  fileName: string;
  format: ScanFileFormat;
  /** File size in MB */
  fileSizeMb: number;
  imageType: MriImageType;
  /** ISO 8601 date string */
  scanDate: string;
  /** ISO 8601 date string — when the file was uploaded */
  uploadedAt: string;

  // ── AI Results ──
  primaryDiagnosis: DiagnosisClass;
  /** 0–100 */
  confidence: number;
  probabilities: ClassProbability[];
  status: ScanStatus;

  // ── Metadata ──
  model: ModelMetadata;
  gradCam: GradCamMetadata;

  // ── Report ──
  /** Whether a PDF report has been generated for this scan */
  reportGenerated: boolean;
  reportUrl?: string;
}

// ─────────────────────────────────────────────────────────────────
// PATIENT TABLE (Doctor Portal)
// ─────────────────────────────────────────────────────────────────

/** Row model for the doctor's patient data table */
export interface PatientTableRow {
  patientId: string;      // e.g. "P-001"
  name: string;
  initials: string;
  /** Tailwind/CSS gradient string for avatar */
  avatarGradient: string;
  avatarTextColor: string;
  lastScanDate: string;   // e.g. "Dec 15, 2024"
  lastDiagnosis: DiagnosisClass;
  confidence: number;     // 0–100
  status: ScanStatus;
  /** Number of total scans on record */
  totalScans: number;
  assignedDoctorId: string;
}

// ─────────────────────────────────────────────────────────────────
// DASHBOARD METRICS
// ─────────────────────────────────────────────────────────────────

/** A single stat card item for the patient dashboard */
export interface PatientStatCard {
  label: string;
  value: string | number;
  subText: string;
  /** Optional colour override for the value text */
  valueColor?: string;
  /** Optional positive delta label e.g. "↑ 2 this month" */
  delta?: string;
}

/** A single stat card item for the doctor dashboard */
export interface DoctorStatCard {
  label: string;
  value: string | number;
  /** Optional colour override for the value text */
  valueColor?: string;
}

/** Diagnosis breakdown entry for the doctor's stats panel */
export interface DiagnosisBreakdownItem {
  label: DiagnosisClass;
  count: number;
  /** Percentage of total (0–100) */
  percentage: number;
  /** Hex colour for the label */
  color: string;
}

/** Aggregated doctor dashboard summary */
export interface DoctorDashboardSummary {
  totalPatients: number;
  scansThisMonth: number;
  pendingReview: number;
  breakdown: DiagnosisBreakdownItem[];
}

// ─────────────────────────────────────────────────────────────────
// LANDING PAGE
// ─────────────────────────────────────────────────────────────────

/** A hero stats number + label pair */
export interface HeroStat {
  value: string;
  label: string;
}

/** A feature card item for the landing features strip */
export interface FeatureCard {
  title: string;
  description: string;
  /** SVG path data string */
  iconPath: string;
}

/** "How it works" step */
export interface HowItWorksStep {
  stepNumber: number;
  title: string;
  description: string;
}

// ─────────────────────────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────────────────────────

/** A single sidebar navigation item */
export interface SidebarNavItem {
  label: string;
  href: string;
  /** SVG path data */
  iconPath: string;
  /** Whether this item is active */
  active?: boolean;
}

// ─────────────────────────────────────────────────────────────────
// REPORT (PDF)
// ─────────────────────────────────────────────────────────────────

/** Data required to render / generate the PDF report */
export interface ReportData {
  patient: {
    name: string;
    patientId: string;
    dateOfBirth: string;
    scanDate: string;
  };
  scan: ScanRecord;
  generatedAt: string; // ISO 8601
}

// ─────────────────────────────────────────────────────────────────
// API / ASYNC STATE
// ─────────────────────────────────────────────────────────────────

/** Generic async loading state wrapper */
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/** Upload progress state */
export interface UploadState {
  file: File | null;
  progress: number;    // 0–100
  status: "idle" | "uploading" | "processing" | "done" | "error";
  errorMessage?: string;
  result?: ScanRecord;
}
