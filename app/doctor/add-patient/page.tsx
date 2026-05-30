"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Back from "./back.svg";
import { createClient } from "@/lib/supabase/client";

function FormInput({ label, type, placeholder, value, onChange, id }: {
  label: string; type: string; placeholder: string; value: string; onChange: (v: string) => void; id: string;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label htmlFor={id} style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--ice-text2)", marginBottom: 6, letterSpacing: "0.2px" }}>
        {label}
      </label>
      <input id={id} type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className="ice-input" />
    </div>
  );
}

export default function AddPatientPage() {
  const router = useRouter();
  const [doctorId, setDoctorId] = useState<string>("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("Male");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setDoctorId(user.id);
    }
    getUser();
  }, []);

  const handleSave = async () => {
    setError(null);
    if (!name.trim() || !dob || !email.trim()) {
      setError("Please fill in the patient's full name, email and date of birth.");
      return;
    }
    if (!doctorId) {
      setError("You must be logged in as a doctor to add patients.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();

      // Generate a patient_id like "P-" + 6 digits
      const patientId = "P-" + Date.now().toString().slice(-6);

      const { error: insertError } = await supabase.from("patients").insert({
        name: name.trim(),
        email: email.trim(),
        patient_id: patientId,
        date_of_birth: dob,
        gender,
        assigned_doctor_id: doctorId,
      });

      if (insertError) throw insertError;

      router.push("/doctor");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to create patient. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen" style={{ background: "linear-gradient(160deg,#EBF5FF 0%,#D4ECFB 40%,#E8F4FF 100%)" }}>
      {/* Decorative orbs */}
      <div className="absolute rounded-full pointer-events-none" style={{ width: 400, height: 320, background: "radial-gradient(ellipse,rgba(56,189,248,0.15),transparent 65%)", filter: "blur(40px)", top: -80, right: -60, opacity: 0.5 }} />
      <div className="absolute rounded-full pointer-events-none" style={{ width: 300, height: 240, background: "radial-gradient(ellipse,rgba(14,165,233,0.08),transparent 65%)", filter: "blur(40px)", bottom: 20, left: -40, opacity: 0.5 }} />

      {/* Back link */}
      <div className="relative z-10 flex" style={{ padding: "20px 32px" }}>
        <Link 
          href="/doctor" 
          className="font-semibold transition-all duration-200"
          style={{
            padding: "10px 16px",
            borderRadius: "9px",
            fontSize: "14px",
            background: "linear-gradient(135deg,#38BDF8,#0284C7)",
            color: "#fff",
            textDecoration: "none",
            boxShadow: "0 4px 14px rgba(14,165,233,0.25)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          Back to Dashboard
        </Link>
      </div>

      {/* Centred card */}
      <div className="relative z-10 flex items-center justify-center flex-1 px-5 pb-12">
        <div className="animate-scale-in" style={{ width: "100%", maxWidth: 460 }}>
          <div className="glass" style={{ padding: "44px 40px" }}>
            <h1 className="font-bold text-center" style={{ fontSize: "22px", color: "var(--ice-dark)", letterSpacing: "-0.4px", marginBottom: 5 }}>
              Add New Patient
            </h1>
            <p className="text-center" style={{ fontSize: "13px", color: "var(--ice-text3)", marginBottom: 28 }}>
              Create a patient record to assign MRI scans.
            </p>

            <FormInput id="name" label="Full Name" type="text" placeholder="e.g. Ahmed Karim" value={name} onChange={setName} />
            <FormInput id="email" label="Email Address" type="email" placeholder="e.g. patient@example.com" value={email} onChange={setEmail} />
            <FormInput id="dob" label="Date of Birth" type="date" placeholder="" value={dob} onChange={setDob} />

            <div style={{ marginBottom: 16 }}>
              <label htmlFor="gender" style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--ice-text2)", marginBottom: 6, letterSpacing: "0.2px" }}>Gender</label>
              <select id="gender" value={gender} onChange={(e) => setGender(e.target.value)} className="ice-input">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-[8px] mt-2 mb-1" style={{ background: "var(--red-bg)", border: "1px solid var(--red-border)", padding: "8px 12px", fontSize: "12px", color: "var(--red)" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 13, height: 13, flexShrink: 0 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                {error}
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full font-semibold transition-all duration-200 font-[inherit]"
              style={{
                padding: "12px", borderRadius: "9px", fontSize: "14px",
                background: loading ? "rgba(14,165,233,0.50)" : "linear-gradient(135deg,#38BDF8,#0284C7)",
                color: "#fff", border: "none", cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 4px 14px rgba(14,165,233,0.25)", marginTop: "16px",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              }}
            >
              {loading ? (
                <>
                  <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                  Creating record…
                </>
              ) : "Save Patient"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
