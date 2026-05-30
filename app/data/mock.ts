/* ═══════════════════════════════════════════════════════════════
   NeuroScan AI — Mock Data & Application Constants
   src/data/mock.ts
   ═══════════════════════════════════════════════════════════════ */

import type {
  PatientUser,
  DoctorUser,
  ScanRecord,
  PatientTableRow,
  DoctorDashboardSummary,
  HeroStat,
  FeatureCard,
  HowItWorksStep,
  ClassProbability,
  ModelMetadata,
} from "@/types";

// ─────────────────────────────────────────────────────────────────
// SHARED MODEL METADATA (ResNet50V2 V5 — used across all scans)
// ─────────────────────────────────────────────────────────────────

const DEFAULT_MODEL: ModelMetadata = {
  backbone: "ResNet50V2",
  version: "V5",
  testAccuracy: 98.05,
  ttaPasses: 10,
  xaiMethod: "Grad-CAM",
  trainingImages: 12064,
};

// ─────────────────────────────────────────────────────────────────
// MOCK DOCTORS (2 clinicians)
// ─────────────────────────────────────────────────────────────────

export const MOCK_DOCTORS: DoctorUser[] = [
  {
    id: "doc-001",
    name: "Dr. Rachid Benali",
    email: "r.benali@neuroscan.ai",
    role: "doctor",
    avatarInitials: "RB",
    avatarGradient: "linear-gradient(135deg,#DDD6FE,#A78BFA)",
    avatarTextColor: "#2E1065",
    createdAt: "2023-01-10T08:00:00Z",
    specialty: "Radiologist",
    licenseNumber: "RAD-DZ-2018-0042",
    hospitalAffiliation: "Algiers University Hospital — Neurology Dept.",
  },
  {
    id: "doc-002",
    name: "Dr. Amina Chérif",
    email: "a.cherif@neuroscan.ai",
    role: "doctor",
    avatarInitials: "AC",
    avatarGradient: "linear-gradient(135deg,#BAE6FD,#38BDF8)",
    avatarTextColor: "#0A2540",
    createdAt: "2023-03-22T09:30:00Z",
    specialty: "Neuroradiologist",
    licenseNumber: "NRD-DZ-2020-0117",
    hospitalAffiliation: "Constantine Medical Center — Imaging Unit",
  },
];

// ─────────────────────────────────────────────────────────────────
// MOCK PATIENTS (5 full profiles)
// ─────────────────────────────────────────────────────────────────

export const MOCK_PATIENTS: PatientUser[] = [];

// ─────────────────────────────────────────────────────────────────
// DOCTOR DASHBOARD SUMMARY
// ─────────────────────────────────────────────────────────────────

export const MOCK_DOCTOR_SUMMARY: DoctorDashboardSummary = {
  totalPatients: 18,
  scansThisMonth: 24,
  pendingReview: 3,
  breakdown: [
    { label: "Glioma",      count: 6, percentage: 33, color: "#EF4444" },
    { label: "Meningioma",  count: 4, percentage: 22, color: "#F59E0B" },
    { label: "Pituitary",   count: 3, percentage: 17, color: "#0EA5E9" },
    { label: "No Tumor",    count: 5, percentage: 28, color: "#10B981" },
  ],
};

// ─────────────────────────────────────────────────────────────────
// LANDING PAGE DATA
// ─────────────────────────────────────────────────────────────────

export const HERO_STATS: HeroStat[] = [
  { value: "98.05%", label: "Test accuracy (TTA)" },
  { value: "12,064", label: "Training images" },
  { value: "4",      label: "Tumor classes" },
  { value: "<10s",    label: "Analysis time" },
];

export const FEATURE_CARDS: FeatureCard[] = [
  {
    title: "ResNet50V2 Model",
    description:
      "Trained on 12,064 MRI images with 98.05% TTA accuracy across 4 tumor classes.",
    iconPath:
      "M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3",
  },
  {
    title: "Grad-CAM XAI",
    description:
      "Visual explanation of AI decisions via heatmap overlay on the MRI scan.",
    iconPath:
      "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  },
  {
    title: "PDF Reports",
    description:
      "Download a complete medical-grade PDF report with all scan images and results.",
    iconPath:
      "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z",
  },
  {
    title: "Patient & Doctor Roles",
    description:
      "Separate dashboards for patients uploading scans and doctors reviewing results.",
    iconPath:
      "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z",
  },
];

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    stepNumber: 1,
    title: "Upload your MRI",
    description:
      "Drag-and-drop a JPG or PNG MRI image. T1-weighted contrast-enhanced images yield the best results.",
  },
  {
    stepNumber: 2,
    title: "AI Analysis",
    description:
      "Our ResNet50V2 model runs 10 test-time augmentation passes to maximise classification confidence.",
  },
  {
    stepNumber: 3,
    title: "Review Results",
    description:
      "View the Grad-CAM heatmap highlighting suspect regions, then inspect the full class probability breakdown.",
  },
  {
    stepNumber: 4,
    title: "Download Report",
    description:
      "Generate and download a complete PDF medical imaging report suitable for sharing with a specialist.",
  },
];

