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

export const MOCK_PATIENTS: PatientUser[] = [
  {
    id: "pat-001",
    name: "Ahmed Karim",
    email: "ahmed.karim@example.com",
    role: "patient",
    avatarInitials: "AK",
    avatarGradient: "linear-gradient(135deg,#BAE6FD,#7DD3FC)",
    avatarTextColor: "#0A2540",
    createdAt: "2024-02-14T10:00:00Z",
    dateOfBirth: "1985-03-14",
    patientId: "P-001",
    assignedDoctorId: "doc-001",
  },
  {
    id: "pat-002",
    name: "Sara Ferhat",
    email: "sara.ferhat@example.com",
    role: "patient",
    avatarInitials: "SF",
    avatarGradient: "linear-gradient(135deg,#FDE68A,#FCD34D)",
    avatarTextColor: "#451A03",
    createdAt: "2024-03-05T11:00:00Z",
    dateOfBirth: "1992-07-28",
    patientId: "P-002",
    assignedDoctorId: "doc-001",
  },
  {
    id: "pat-003",
    name: "Mohamed Bey",
    email: "m.bey@example.com",
    role: "patient",
    avatarInitials: "MB",
    avatarGradient: "linear-gradient(135deg,#A7F3D0,#6EE7B7)",
    avatarTextColor: "#022C22",
    createdAt: "2024-04-18T09:00:00Z",
    dateOfBirth: "1978-11-02",
    patientId: "P-003",
    assignedDoctorId: "doc-001",
  },
  {
    id: "pat-004",
    name: "Leila Ouali",
    email: "l.ouali@example.com",
    role: "patient",
    avatarInitials: "LO",
    avatarGradient: "linear-gradient(135deg,#BFDBFE,#93C5FD)",
    avatarTextColor: "#1E3A8A",
    createdAt: "2024-05-30T14:00:00Z",
    dateOfBirth: "2000-01-15",
    patientId: "P-004",
    assignedDoctorId: "doc-002",
  },
  {
    id: "pat-005",
    name: "Hamid Meziane",
    email: "h.meziane@example.com",
    role: "patient",
    avatarInitials: "HM",
    avatarGradient: "linear-gradient(135deg,#FBCFE8,#F9A8D4)",
    avatarTextColor: "#500724",
    createdAt: "2024-06-11T08:30:00Z",
    dateOfBirth: "1967-09-22",
    patientId: "P-005",
    assignedDoctorId: "doc-001",
  },
];

// ─────────────────────────────────────────────────────────────────
// MOCK SCAN RECORDS (3 scans per patient = 15 total)
// ─────────────────────────────────────────────────────────────────

const mkProbs = (
  glioma: number,
  meningioma: number,
  pituitary: number,
  noTumor: number
): ClassProbability[] => [
  { label: "Glioma",      probability: glioma,      color: "#EF4444" },
  { label: "Meningioma",  probability: meningioma,  color: "#F59E0B" },
  { label: "Pituitary",   probability: pituitary,   color: "#3B82F6" },
  { label: "No Tumor",    probability: noTumor,     color: "#10B981" },
];

export const MOCK_SCANS: ScanRecord[] = [
  // ── P-001 Ahmed Karim ──────────────────────────────────────────
  {
    id: "scan-001",
    patientId: "P-001",
    fileName: "MRI_Dec15_001",
    format: "JPG",
    fileSizeMb: 2.4,
    imageType: "T1-CE",
    scanDate: "2024-12-15",
    uploadedAt: "2024-12-15T09:32:00Z",
    primaryDiagnosis: "Glioma",
    confidence: 96.3,
    probabilities: mkProbs(96.3, 2.1, 0.9, 0.7),
    status: "Critical",
    model: DEFAULT_MODEL,
    gradCam: { targetLayer: "post_bn", overlayAlpha: 0.4 },
    reportGenerated: true,
    reportUrl: "/reports/scan-001.pdf",
  },
  {
    id: "scan-002",
    patientId: "P-001",
    fileName: "MRI_Nov28_003",
    format: "PNG",
    fileSizeMb: 3.1,
    imageType: "T1-weighted CE",
    scanDate: "2024-11-28",
    uploadedAt: "2024-11-28T14:10:00Z",
    primaryDiagnosis: "Glioma",
    confidence: 94.1,
    probabilities: mkProbs(94.1, 3.4, 1.2, 1.3),
    status: "Critical",
    model: DEFAULT_MODEL,
    gradCam: { targetLayer: "post_bn", overlayAlpha: 0.4 },
    reportGenerated: true,
    reportUrl: "/reports/scan-002.pdf",
  },
  {
    id: "scan-003",
    patientId: "P-001",
    fileName: "MRI_Oct10_002",
    format: "JPG",
    fileSizeMb: 1.8,
    imageType: "T2-FLAIR",
    scanDate: "2024-10-10",
    uploadedAt: "2024-10-10T11:05:00Z",
    primaryDiagnosis: "No Tumor",
    confidence: 97.8,
    probabilities: mkProbs(0.8, 0.6, 0.8, 97.8),
    status: "Normal",
    model: DEFAULT_MODEL,
    gradCam: { targetLayer: "post_bn", overlayAlpha: 0.4 },
    reportGenerated: true,
    reportUrl: "/reports/scan-003.pdf",
  },

  // ── P-002 Sara Ferhat ─────────────────────────────────────────
  {
    id: "scan-004",
    patientId: "P-002",
    fileName: "MRI_Dec12_001",
    format: "JPG",
    fileSizeMb: 2.9,
    imageType: "T1-CE",
    scanDate: "2024-12-12",
    uploadedAt: "2024-12-12T10:45:00Z",
    primaryDiagnosis: "Meningioma",
    confidence: 91.2,
    probabilities: mkProbs(4.1, 91.2, 3.2, 1.5),
    status: "Review",
    model: DEFAULT_MODEL,
    gradCam: { targetLayer: "post_bn", overlayAlpha: 0.4 },
    reportGenerated: true,
    reportUrl: "/reports/scan-004.pdf",
  },
  {
    id: "scan-005",
    patientId: "P-002",
    fileName: "MRI_Oct30_002",
    format: "PNG",
    fileSizeMb: 2.2,
    imageType: "T1",
    scanDate: "2024-10-30",
    uploadedAt: "2024-10-30T08:20:00Z",
    primaryDiagnosis: "Meningioma",
    confidence: 88.6,
    probabilities: mkProbs(5.6, 88.6, 4.1, 1.7),
    status: "Review",
    model: DEFAULT_MODEL,
    gradCam: { targetLayer: "post_bn", overlayAlpha: 0.4 },
    reportGenerated: false,
  },
  {
    id: "scan-006",
    patientId: "P-002",
    fileName: "MRI_Sep05_001",
    format: "JPG",
    fileSizeMb: 1.6,
    imageType: "T2",
    scanDate: "2024-09-05",
    uploadedAt: "2024-09-05T13:00:00Z",
    primaryDiagnosis: "No Tumor",
    confidence: 95.4,
    probabilities: mkProbs(1.2, 1.8, 1.6, 95.4),
    status: "Normal",
    model: DEFAULT_MODEL,
    gradCam: { targetLayer: "post_bn", overlayAlpha: 0.4 },
    reportGenerated: true,
    reportUrl: "/reports/scan-006.pdf",
  },

  // ── P-003 Mohamed Bey ─────────────────────────────────────────
  {
    id: "scan-007",
    patientId: "P-003",
    fileName: "MRI_Dec10_001",
    format: "JPG",
    fileSizeMb: 2.0,
    imageType: "T1-CE",
    scanDate: "2024-12-10",
    uploadedAt: "2024-12-10T15:30:00Z",
    primaryDiagnosis: "No Tumor",
    confidence: 99.1,
    probabilities: mkProbs(0.3, 0.2, 0.4, 99.1),
    status: "Normal",
    model: DEFAULT_MODEL,
    gradCam: { targetLayer: "post_bn", overlayAlpha: 0.4 },
    reportGenerated: true,
    reportUrl: "/reports/scan-007.pdf",
  },
  {
    id: "scan-008",
    patientId: "P-003",
    fileName: "MRI_Oct22_002",
    format: "PNG",
    fileSizeMb: 3.4,
    imageType: "FLAIR",
    scanDate: "2024-10-22",
    uploadedAt: "2024-10-22T09:15:00Z",
    primaryDiagnosis: "No Tumor",
    confidence: 98.3,
    probabilities: mkProbs(0.6, 0.5, 0.6, 98.3),
    status: "Normal",
    model: DEFAULT_MODEL,
    gradCam: { targetLayer: "post_bn", overlayAlpha: 0.4 },
    reportGenerated: true,
    reportUrl: "/reports/scan-008.pdf",
  },
  {
    id: "scan-009",
    patientId: "P-003",
    fileName: "MRI_Jul18_001",
    format: "JPG",
    fileSizeMb: 1.9,
    imageType: "T1",
    scanDate: "2024-07-18",
    uploadedAt: "2024-07-18T12:00:00Z",
    primaryDiagnosis: "No Tumor",
    confidence: 97.2,
    probabilities: mkProbs(0.9, 1.1, 0.8, 97.2),
    status: "Normal",
    model: DEFAULT_MODEL,
    gradCam: { targetLayer: "post_bn", overlayAlpha: 0.4 },
    reportGenerated: false,
  },

  // ── P-004 Leila Ouali ─────────────────────────────────────────
  {
    id: "scan-010",
    patientId: "P-004",
    fileName: "MRI_Dec08_001",
    format: "PNG",
    fileSizeMb: 2.7,
    imageType: "T1-CE",
    scanDate: "2024-12-08",
    uploadedAt: "2024-12-08T10:00:00Z",
    primaryDiagnosis: "Pituitary",
    confidence: 88.5,
    probabilities: mkProbs(3.8, 4.2, 88.5, 3.5),
    status: "Review",
    model: DEFAULT_MODEL,
    gradCam: { targetLayer: "post_bn", overlayAlpha: 0.4 },
    reportGenerated: true,
    reportUrl: "/reports/scan-010.pdf",
  },
  {
    id: "scan-011",
    patientId: "P-004",
    fileName: "MRI_Nov14_002",
    format: "JPG",
    fileSizeMb: 2.3,
    imageType: "T2",
    scanDate: "2024-11-14",
    uploadedAt: "2024-11-14T14:20:00Z",
    primaryDiagnosis: "Pituitary",
    confidence: 85.9,
    probabilities: mkProbs(5.1, 4.8, 85.9, 4.2),
    status: "Review",
    model: DEFAULT_MODEL,
    gradCam: { targetLayer: "post_bn", overlayAlpha: 0.4 },
    reportGenerated: false,
  },
  {
    id: "scan-012",
    patientId: "P-004",
    fileName: "MRI_Aug03_001",
    format: "JPG",
    fileSizeMb: 1.5,
    imageType: "T1",
    scanDate: "2024-08-03",
    uploadedAt: "2024-08-03T11:10:00Z",
    primaryDiagnosis: "No Tumor",
    confidence: 93.6,
    probabilities: mkProbs(2.1, 2.6, 1.7, 93.6),
    status: "Normal",
    model: DEFAULT_MODEL,
    gradCam: { targetLayer: "post_bn", overlayAlpha: 0.4 },
    reportGenerated: true,
    reportUrl: "/reports/scan-012.pdf",
  },

  // ── P-005 Hamid Meziane ───────────────────────────────────────
  {
    id: "scan-013",
    patientId: "P-005",
    fileName: "MRI_Dec05_001",
    format: "JPG",
    fileSizeMb: 3.2,
    imageType: "T1-CE",
    scanDate: "2024-12-05",
    uploadedAt: "2024-12-05T08:50:00Z",
    primaryDiagnosis: "Glioma",
    confidence: 94.7,
    probabilities: mkProbs(94.7, 2.8, 1.4, 1.1),
    status: "Critical",
    model: DEFAULT_MODEL,
    gradCam: { targetLayer: "post_bn", overlayAlpha: 0.4 },
    reportGenerated: true,
    reportUrl: "/reports/scan-013.pdf",
  },
  {
    id: "scan-014",
    patientId: "P-005",
    fileName: "MRI_Oct18_002",
    format: "PNG",
    fileSizeMb: 2.6,
    imageType: "T2-FLAIR",
    scanDate: "2024-10-18",
    uploadedAt: "2024-10-18T13:40:00Z",
    primaryDiagnosis: "Glioma",
    confidence: 92.3,
    probabilities: mkProbs(92.3, 3.5, 2.1, 2.1),
    status: "Critical",
    model: DEFAULT_MODEL,
    gradCam: { targetLayer: "post_bn", overlayAlpha: 0.4 },
    reportGenerated: true,
    reportUrl: "/reports/scan-014.pdf",
  },
  {
    id: "scan-015",
    patientId: "P-005",
    fileName: "MRI_Sep02_001",
    format: "JPG",
    fileSizeMb: 2.1,
    imageType: "T1",
    scanDate: "2024-09-02",
    uploadedAt: "2024-09-02T09:30:00Z",
    primaryDiagnosis: "Meningioma",
    confidence: 79.4,
    probabilities: mkProbs(7.2, 79.4, 8.6, 4.8),
    status: "Review",
    model: DEFAULT_MODEL,
    gradCam: { targetLayer: "post_bn", overlayAlpha: 0.4 },
    reportGenerated: false,
  },
];

// ─────────────────────────────────────────────────────────────────
// DOCTOR PORTAL — Patient Table Rows
// ─────────────────────────────────────────────────────────────────

/** Pre-joined rows for the doctor's patient table (Screen 5) */
export const MOCK_PATIENT_TABLE_ROWS: PatientTableRow[] = [
  {
    patientId: "P-001",
    name: "Ahmed Karim",
    initials: "AK",
    avatarGradient: "linear-gradient(135deg,#BAE6FD,#7DD3FC)",
    avatarTextColor: "#0A2540",
    lastScanDate: "Dec 15, 2024",
    lastDiagnosis: "Glioma",
    confidence: 96.3,
    status: "Critical",
    totalScans: 3,
    assignedDoctorId: "doc-001",
  },
  {
    patientId: "P-002",
    name: "Sara Ferhat",
    initials: "SF",
    avatarGradient: "linear-gradient(135deg,#FDE68A,#FCD34D)",
    avatarTextColor: "#451A03",
    lastScanDate: "Dec 12, 2024",
    lastDiagnosis: "Meningioma",
    confidence: 91.2,
    status: "Review",
    totalScans: 3,
    assignedDoctorId: "doc-001",
  },
  {
    patientId: "P-003",
    name: "Mohamed Bey",
    initials: "MB",
    avatarGradient: "linear-gradient(135deg,#A7F3D0,#6EE7B7)",
    avatarTextColor: "#022C22",
    lastScanDate: "Dec 10, 2024",
    lastDiagnosis: "No Tumor",
    confidence: 99.1,
    status: "Normal",
    totalScans: 3,
    assignedDoctorId: "doc-001",
  },
  {
    patientId: "P-004",
    name: "Leila Ouali",
    initials: "LO",
    avatarGradient: "linear-gradient(135deg,#BFDBFE,#93C5FD)",
    avatarTextColor: "#1E3A8A",
    lastScanDate: "Dec 8, 2024",
    lastDiagnosis: "Pituitary",
    confidence: 88.5,
    status: "Review",
    totalScans: 3,
    assignedDoctorId: "doc-002",
  },
  {
    patientId: "P-005",
    name: "Hamid Meziane",
    initials: "HM",
    avatarGradient: "linear-gradient(135deg,#FBCFE8,#F9A8D4)",
    avatarTextColor: "#500724",
    lastScanDate: "Dec 5, 2024",
    lastDiagnosis: "Glioma",
    confidence: 94.7,
    status: "Critical",
    totalScans: 3,
    assignedDoctorId: "doc-001",
  },
];

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
  { value: "<3s",    label: "Analysis time" },
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

// ─────────────────────────────────────────────────────────────────
// HELPER UTILITIES
// ─────────────────────────────────────────────────────────────────

/** Return all scans belonging to a patient ID, sorted newest first */
export function getScansForPatient(patientId: string): ScanRecord[] {
  return MOCK_SCANS
    .filter((s) => s.patientId === patientId)
    .sort(
      (a, b) =>
        new Date(b.scanDate).getTime() - new Date(a.scanDate).getTime()
    );
}

/** Return the most recent scan for a patient */
export function getLatestScan(patientId: string): ScanRecord | undefined {
  return getScansForPatient(patientId)[0];
}

/** Return the patient user record by ID */
export function getPatientById(patientId: string): PatientUser | undefined {
  return MOCK_PATIENTS.find((p) => p.patientId === patientId);
}

/** Return a scan record by its ID */
export function getScanById(scanId: string): ScanRecord | undefined {
  return MOCK_SCANS.find((s) => s.id === scanId);
}

/** Return patient stat cards for the patient dashboard */
export function buildPatientStatCards(patientId: string) {
  const scans = getScansForPatient(patientId);
  const latest = scans[0];
  const reportsDownloaded = scans.filter((s) => s.reportGenerated).length;

  const daysSinceLast = latest
    ? Math.floor(
        (Date.now() - new Date(latest.scanDate).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  return [
    {
      label: "Total Scans",
      value: scans.length,
      subText: "↑ 2 this month",
      delta: "↑ 2",
    },
    {
      label: "Last Scan",
      value: daysSinceLast !== null ? `${daysSinceLast}d ago` : "—",
      subText: latest
        ? new Date(latest.scanDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "No scans yet",
    },
    {
      label: "Latest Diagnosis",
      value: latest?.primaryDiagnosis ?? "—",
      subText: latest ? `${latest.confidence}% confidence` : "",
      valueColor:
        latest?.primaryDiagnosis === "No Tumor" ? "#10B981" : "#EF4444",
    },
    {
      label: "Reports",
      value: reportsDownloaded,
      subText: "Downloaded",
    },
  ];
}
