"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { PatientsTable } from "../PatientsTable";
import { color } from "framer-motion";

interface PatientRow {
  id: string;
  patientName: string;
  patientId: string;
  scanId: string | null;
  scanDate: string;
  scanType: string;
  primaryDiagnosis: string;
  confidence: number;
  status: string;
  assignedDoctorId: string;
}

export default function PatientsPage() {
  const [rows, setRows] = useState<PatientRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      // Fetch all patients for this doctor with their latest scan
      const { data: patients, error } = await supabase
        .from("patients")
        .select(`
          id,
          name,
          patient_id,
          date_of_birth,
          gender,
          assigned_doctor_id,
          scans (
            id,
            primary_diagnosis,
            confidence,
            status,
            scan_date,
            image_type,
            uploaded_at
          )
        `)
        .eq("assigned_doctor_id", user.id)
        .order("created_at", { ascending: false });

      if (error) { console.error("Error loading patients:", error); setLoading(false); return; }

      const mapped: PatientRow[] = (patients || []).map((p: any) => {
        const patScans: any[] = p.scans || [];
        const latest = patScans.sort((a: any, b: any) =>
          new Date(b.uploaded_at || b.scan_date).getTime() - new Date(a.uploaded_at || a.scan_date).getTime()
        )[0];

        return {
          id: p.id,
          patientName: p.name,
          patientId: p.patient_id || p.id,
          scanId: latest?.id ?? null,
          scanDate: latest?.uploaded_at || latest?.scan_date || new Date().toISOString(),
          scanType: latest?.image_type || "MRI",
          primaryDiagnosis: latest?.primary_diagnosis ?? "Pending",
          confidence: latest?.confidence ?? 0,
          status: latest?.status ?? "Pending",
          assignedDoctorId: p.assigned_doctor_id,
        };
      });

      setRows(mapped);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="flex-1 p-8 overflow-auto">
      {/* Header */}
      <div className="mb-7 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-[#0A2540] tracking-[-0.5px]">My Patients</h1>
          <p className="text-[13px] text-[#6B98BA] mt-[3px]">
            {loading ? "Loading…" : `${rows.length} patients · Search, filter and manage records`}
          </p>
        </div>
        <Link
          href="/doctor/add-patient"
          className="no-underline flex items-center gap-2 px-8 py-2.5 rounded-[9px] text-white text-[13px] font-semibold transition-all duration-200 hover:-translate-y-px"
          style={{ background: "linear-gradient(135deg,#38BDF8,#0284C7)", boxShadow: "0 4px 12px rgba(14,165,233,0.25)",fontSize: "13px",fontWeight: "600" ,color: "#fff", padding: "10px 32px", borderRadius: "9px" }}
        >
          +  Add Patient
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-[3px] border-[rgba(14,165,233,0.2)] border-t-[#0284C7] rounded-full animate-spin" />
        </div>
      ) : rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-full bg-[rgba(14,165,233,0.08)] flex items-center justify-center mb-4">
            <svg className="w-8 h-8 stroke-[#6B98BA] fill-none" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round">
              <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <p className="text-[16px] font-semibold text-[#0A2540] mb-1">No patients yet</p>
          <p className="text-[13px] text-[#6B98BA] mb-5">Add your first patient to get started.</p>
          <Link
            href="/doctor/add-patient"
                      style={{ marginTop: "12px", textDecoration: "none",
                        background: "linear-gradient(135deg,#38BDF8,#0284C7)", boxShadow: "0 4px 12px rgba(14,165,233,0.25)",fontSize: "13px",fontWeight: "600" ,color: "#fff", padding: "10px 32px", borderRadius: "9px" }}

            className="no-underline px-5 py-2.5 rounded-[9px] text-white text-[13px] font-semibold"
          >
            Add Patient
          </Link>
        </div>
      ) : (
        <PatientsTable rows={rows} />
      )}
    </div>
  );
}
