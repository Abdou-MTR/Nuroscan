"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

export default function DoctorProfilePage() {
  const [profile, setProfile] = useState({
    name: "Loading...",
    email: "loading...",
    role: "Doctor",
    gender: "",
    dateOfBirth: "",
    speciality: "",
  });
  
  const [stats, setStats] = useState({
    patients: 0,
    patientsDelta: 0,
    evaluated: 0,
    evaluatedDelta: 0,
    pending: 0,
  });

  const [recentScans, setRecentScans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Edit profile state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", gender: "", speciality: "", dateOfBirth: "" });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const openEditModal = () => {
    setEditForm({ name: profile.name, gender: profile.gender, speciality: profile.speciality, dateOfBirth: profile.dateOfBirth });
    setSaveMsg(null);
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveMsg(null);
    try {
      const supabase = createClient();
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: editForm.name.trim(),
          gender: editForm.gender,
          speciality: editForm.speciality,
          date_of_birth: editForm.dateOfBirth,
        },
      });
      if (authError) throw authError;

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: editForm.name.trim(),
          gender: editForm.gender,
          speciality: editForm.speciality,
          date_of_birth: editForm.dateOfBirth,
        })
        .eq('id', user.id);
        
      if (profileError) throw profileError;

      setProfile((prev) => ({ ...prev, name: editForm.name.trim(), gender: editForm.gender, speciality: editForm.speciality, dateOfBirth: editForm.dateOfBirth }));
      setSaveMsg("Profile updated successfully!");
      setTimeout(() => setIsEditing(false), 800);
    } catch (err: any) {
      setSaveMsg(err.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      console.log('Doctor profile fetch result:', { profileData, profileError, userMeta: user.user_metadata });
      
      if (profileError) {
        console.error('Error fetching profile:', profileError);
      }

      const meta = user.user_metadata || {};
      const name = profileData?.full_name || meta.full_name || user.email?.split('@')[0] || 'Doctor';
      const email = profileData?.email || user.email || 'No email provided';
      const role = profileData?.role || meta.role || 'Doctor';
      const gender = profileData?.gender || meta.gender || '';
      const dateOfBirth = profileData?.date_of_birth || meta.date_of_birth || '';
      const speciality = profileData?.speciality || meta.speciality || '';
      setProfile({ name, email, role, gender, dateOfBirth, speciality });

      const { data: patientsData } = await supabase
        .from("patients")
        .select("id, created_at, name, patient_id")
        .eq("assigned_doctor_id", user.id);

      let patientsCount = 0;
      let patientsThisMonth = 0;
      const patientMap: Record<string, { full_name: string; patient_id: string }> = {};

      if (patientsData) {
        patientsCount = patientsData.length;
        const now = new Date();
        patientsThisMonth = patientsData.filter((p: any) => {
          const d = new Date(p.created_at);
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }).length;
        patientsData.forEach((p: any) => {
          patientMap[p.id] = { full_name: p.name, patient_id: p.patient_id };
        });
      }

      const patientIds = Object.keys(patientMap);
      let evaluatedCount = 0;
      let evaluatedThisMonth = 0;
      let pendingCount = 0;

      if (patientIds.length > 0) {
        const { data: scansData } = await supabase
          .from("scans")
          .select("*")
          .in("patient_id", patientIds)
          .order("uploaded_at", { ascending: false });

        if (scansData) {
          const now = new Date();
          scansData.forEach((s: any) => {
            const isPending = s.status === "Review" || s.status === "Pending";
            if (isPending) {
              pendingCount++;
            } else {
              evaluatedCount++;
              const d = new Date(s.uploaded_at);
              if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
                evaluatedThisMonth++;
              }
            }
          });

          const enriched = scansData.slice(0, 10).map((s: any) => ({
            ...s,
            patients: patientMap[s.patient_id] || { full_name: "Unknown", patient_id: "N/A" },
          }));
          setRecentScans(enriched);
        }
      }

      setStats({
        patients: patientsCount,
        patientsDelta: patientsThisMonth,
        evaluated: evaluatedCount,
        evaluatedDelta: evaluatedThisMonth,
        pending: pendingCount,
      });

      setLoading(false);
    }
    
    loadProfile();
  }, []);

  const getInitials = (name: string) => {
    return name.replace("Dr. ", "").split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2) || "DR";
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "from-[#f87171] to-[#dc2626]",
      "from-[#fbbf24] to-[#d97706]",
      "from-[#34d399] to-[#059669]",
      "from-[#818cf8] to-[#4f46e5]",
    ];
    let sum = 0;
    for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
    return colors[sum % colors.length];
  };

  const getPillStyle = (diagnosis: string) => {
    switch(diagnosis) {
      case "Glioma": return "bg-[#fde8e8] text-[#c53030]";
      case "Meningioma": return "bg-[#fef3c7] text-[#92400e]";
      case "Pituitary": return "bg-[#e0e7ff] text-[#3730a3]";
      case "No Tumor": return "bg-[#d1fae5] text-[#065f46]";
      default: return "bg-[#fde8e8] text-[#c53030]";
    }
  };

  const getStatusDot = (status: string) => {
    switch(status) {
      case "Critical": return "bg-[#ef4444]";
      case "Review": case "Pending": return "bg-[#f59e0b]";
      case "Normal": return "bg-[#22c55e]";
      default: return "bg-[#8ca8be]";
    }
  };

  const getConfidenceFill = (status: string) => {
    switch(status) {
      case "Critical": return "bg-[#ef4444]";
      case "Review": case "Pending": return "bg-[#f59e0b]";
      case "Normal": return "bg-[#22c55e]";
      default: return "bg-[#6366f1]";
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-[#ddeeff]">
        <div className="w-8 h-8 border-[3px] border-[#daeaf6] border-t-[#1a9bdc] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 p-[36px_40px_48px] overflow-auto bg-[#ddeeff] min-h-screen text-[#1a2b3c] font-sans">

      {/* Header */}
      <div className="flex items-start justify-between mb-[32px]">
        <div>
          <h1 className="text-[26px] font-bold text-[#1a2b3c] tracking-[-0.4px]">My Profile</h1>
          <p className="text-[13.5px] text-[#8ca8be] mt-[3px]">Manage your personal and professional information</p>
        </div>
        <div className="flex items-center gap-[10px]">
          <button
            type="button"
                                       style={{fontSize: "12px",fontWeight: "600" ,color: "#fff", padding: "10px 22px", textDecoration: "none" ,border: "none"  ,display: "inline-block" }}

            onClick={openEditModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-[#38BDF8] to-[#0284C7] text-white text-sm font-semibold rounded-[8px] hover:shadow-[0_4px_12px_rgba(14,165,233,0.25)] transition-all cursor-pointer border-none"
          >
            Edit Profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[320px_1fr] gap-[24px] items-start animate-[fadeUp_0.45s_cubic-bezier(0.22,0.9,0.36,1)_both]">
        
        {/* Left Column: Profile Card */}
        <div className="bg-white rounded-[16px] border border-[#daeaf6] shadow-[0_2px_16px_rgba(26,155,220,0.08)] hover:shadow-[0_8px_32px_rgba(26,155,220,0.16)] transition-shadow duration-200 overflow-hidden">
          
          <div className="bg-gradient-to-br from-[#1a9bdc] to-[#0e6fa8] pt-[32px] px-[28px] pb-[24px] flex flex-col items-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%27120%27%20height=%27120%27%20viewBox=%270%200%20120%20120%27%20xmlns=%27http://www.w3.org/2000/svg%27%3E%3Ccircle%20cx=%2760%27%20cy=%2760%27%20r=%2755%27%20fill=%27none%27%20stroke=%27rgba(255,255,255,0.06)%27%20stroke-width=%2720%27/%3E%3Ccircle%20cx=%2760%27%20cy=%2760%27%20r=%2735%27%20fill=%27none%27%20stroke=%27rgba(255,255,255,0.04)%27%20stroke-width=%2714%27/%3E%3C/svg%3E')] bg-center bg-cover"></div>
            
            <div className="w-[88px] h-[88px] rounded-full bg-[rgba(255,255,255,0.2)] flex items-center justify-center text-white text-[32px] font-bold border-[3px] border-[rgba(255,255,255,0.4)] mb-[14px] relative z-10 backdrop-blur-[4px]"
              style={{ fontWeight: "600", color: "#fff", textDecoration: "none" }}>
              {getInitials(profile.name)}
            </div>
            
            <h2 style={{ fontWeight: "600", color: "#fff", textDecoration: "none" }}
              className="relative z-10 text-[19px] font-bold text-white text-center tracking-[-0.3px]">{profile.name}</h2>
            
            <div style={{ fontWeight: "600", color: "#fff", textDecoration: "none" }}
              className="relative z-10 mt-[8px] bg-[rgba(255,255,255,0.2)] border border-[rgba(255,255,255,0.3)] text-white text-[12px] font-medium px-[14px] py-[4px] rounded-[20px] backdrop-blur-[4px]">
              {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
            </div>
            
            <div className="relative z-10 mt-[10px] flex items-center gap-[5px] bg-[rgba(34,197,94,0.2)] border border-[rgba(34,197,94,0.4)] text-[#d1fae5] text-[11px] font-medium px-[10px] py-[3px] rounded-[20px]">
              <svg className="w-[11px] h-[11px]" viewBox="0 0 24 24" fill="currentColor"><path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
              Verified {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
            </div>
          </div>

          <div className="px-[28px] py-[24px]" style={{ backgroundColor: "#f9f9f9" }}>
            <div className="flex items-start gap-[12px] py-[12px] border-b border-[#daeaf6]">
              <div className="w-[34px] h-[34px] rounded-[9px] bg-[#e8f5fd] flex items-center justify-center text-[#1a9bdc] shrink-0">
                <svg className="w-[16px] h-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="8" r="4"/><path strokeLinecap="round" strokeLinejoin="round" d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              </div>
              <div>
                <p className="text-[11px] text-[#8ca8be] font-medium uppercase tracking-[0.06em] mb-[2px]">Full Name</p>
                <p className="text-[14px] font-medium text-[#1a2b3c]">{profile.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-[12px] py-[12px] border-b border-[#daeaf6]">
              <div className="w-[34px] h-[34px] rounded-[9px] bg-[#e8f5fd] flex items-center justify-center text-[#1a9bdc] shrink-0">
                <svg className="w-[16px] h-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
              <div>
                <p className="text-[11px] text-[#8ca8be] font-medium uppercase tracking-[0.06em] mb-[2px]">Specialty</p>
                <p className="text-[14px] font-medium text-[#1a2b3c]">{profile.speciality || "Not Specified"}</p>
              </div>
            </div>

            <div className="flex items-start gap-[12px] py-[12px] border-b border-[#daeaf6]">
              <div className="w-[34px] h-[34px] rounded-[9px] bg-[#e8f5fd] flex items-center justify-center text-[#1a9bdc] shrink-0">
                <svg className="w-[16px] h-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline strokeLinecap="round" strokeLinejoin="round" points="22,6 12,13 2,6"/></svg>
              </div>
              <div>
                <p className="text-[11px] text-[#8ca8be] font-medium uppercase tracking-[0.06em] mb-[2px]">Email</p>
                <p className="text-[14px] font-medium text-[#1a2b3c]">{profile.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-[12px] py-[12px] border-b border-[#daeaf6]">
              <div className="w-[34px] h-[34px] rounded-[9px] bg-[#e8f5fd] flex items-center justify-center text-[#1a9bdc] shrink-0">
                <svg className="w-[16px] h-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
              </div>
              <div>
                <p className="text-[11px] text-[#8ca8be] font-medium uppercase tracking-[0.06em] mb-[2px]">Gender</p>
                <p className="text-[14px] font-medium text-[#1a2b3c]">{profile.gender || "Not Specified"}</p>
              </div>
            </div>

            <div className="flex items-start gap-[12px] py-[12px]">
              <div className="w-[34px] h-[34px] rounded-[9px] bg-[#e8f5fd] flex items-center justify-center text-[#1a9bdc] shrink-0">
                <svg className="w-[16px] h-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <div>
                <p className="text-[11px] text-[#8ca8be] font-medium uppercase tracking-[0.06em] mb-[2px]">Date of Birth</p>
                <p className="text-[14px] font-medium text-[#1a2b3c]">{profile.dateOfBirth || "Not Specified"}</p>
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-[#daeaf6] m-0"></div>
          
          <div className="px-[24px] py-[20px]" style={{ backgroundColor: "#f9f9f9" }}>
            <div className="text-[12px] font-semibold text-[#8ca8be] uppercase tracking-[0.08em] mb-[12px]">Areas of Expertise</div>
            <div className="flex flex-wrap gap-[8px]">
              <span className="bg-[#e8f5fd] text-[#1a9bdc] text-[12px] font-medium px-[13px] py-[5px] rounded-[20px] border border-[rgba(26,155,220,0.2)]">Brain Tumor</span>
              <span className="bg-[#e8f5fd] text-[#1a9bdc] text-[12px] font-medium px-[13px] py-[5px] rounded-[20px] border border-[rgba(26,155,220,0.2)]">MRI Analysis</span>
              <span className="bg-[#e8f5fd] text-[#1a9bdc] text-[12px] font-medium px-[13px] py-[5px] rounded-[20px] border border-[rgba(26,155,220,0.2)]">Glioma</span>
              <span className="bg-[#e8f5fd] text-[#1a9bdc] text-[12px] font-medium px-[13px] py-[5px] rounded-[20px] border border-[rgba(26,155,220,0.2)]">Grad-CAM XAI</span>
              <span className="bg-[#e8f5fd] text-[#1a9bdc] text-[12px] font-medium px-[13px] py-[5px] rounded-[20px] border border-[rgba(26,155,220,0.2)]">Meningioma</span>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-[20px]">
          
          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-[16px]">
            
            <div className="bg-white border border-[#daeaf6] rounded-[14px] p-[22px_20px] shadow-[0_2px_16px_rgba(26,155,220,0.08)] hover:shadow-[0_8px_32px_rgba(26,155,220,0.16)] hover:-translate-y-[2px] transition-all duration-200 relative overflow-hidden animate-[fadeUp_0.45s_cubic-bezier(0.22,0.9,0.36,1)_both]" style={{ animationDelay: '0.05s', backgroundColor: "#f9f9f9" }}>
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#1a9bdc] to-[#0e6fa8]"></div>
              <div className="text-[12px] font-medium text-[#8ca8be] mb-[8px] uppercase tracking-[0.07em]">Total Patients</div>
              <div className="text-[34px] font-bold text-[#1a2b3c] tracking-[-1px] leading-none">{stats.patients}</div>
              <div className="text-[12px] text-[#8ca8be] mt-[6px] flex items-center gap-[4px]">
                <span className="text-[#22c55e] font-semibold">↑ {stats.patientsDelta}</span> this month
              </div>
            </div>
            
            <div className="bg-white border border-[#daeaf6] rounded-[14px] p-[22px_20px] shadow-[0_2px_16px_rgba(26,155,220,0.08)] hover:shadow-[0_8px_32px_rgba(26,155,220,0.16)] hover:-translate-y-[2px] transition-all duration-200 relative overflow-hidden animate-[fadeUp_0.45s_cubic-bezier(0.22,0.9,0.36,1)_both]" style={{ animationDelay: '0.1s', backgroundColor: "#f9f9f9" }}>
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#22c55e] to-[#16a34a]"></div>
              <div className="text-[12px] font-medium text-[#8ca8be] mb-[8px] uppercase tracking-[0.07em]">Reports Evaluated</div>
              <div className="text-[34px] font-bold text-[#1a2b3c] tracking-[-1px] leading-none">{stats.evaluated}</div>
              <div className="text-[12px] text-[#8ca8be] mt-[6px] flex items-center gap-[4px]">
                <span className="text-[#22c55e] font-semibold">↑ {stats.evaluatedDelta}</span> this month
              </div>
            </div>

            <div className="bg-white border border-[#daeaf6] rounded-[14px] p-[22px_20px] shadow-[0_2px_16px_rgba(26,155,220,0.08)] hover:shadow-[0_8px_32px_rgba(26,155,220,0.16)] hover:-translate-y-[2px] transition-all duration-200 relative overflow-hidden animate-[fadeUp_0.45s_cubic-bezier(0.22,0.9,0.36,1)_both]" style={{ animationDelay: '0.15s', backgroundColor: "#f9f9f9" }}>
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#f59e0b] to-[#d97706]"></div>
              <div className="text-[12px] font-medium text-[#8ca8be] mb-[8px] uppercase tracking-[0.07em]">Pending Review</div>
              <div className="text-[34px] font-bold text-[#1a2b3c] tracking-[-1px] leading-none">{stats.pending}</div>
              <div className="text-[12px] text-[#8ca8be] mt-[6px] flex items-center gap-[4px]">
                <span className="text-[#f59e0b] font-semibold">!</span> requires action
              </div>
            </div>
            
          </div>

          {/* Table */}
          <div className="bg-white rounded-[16px] border border-[#daeaf6] shadow-[0_2px_16px_rgba(26,155,220,0.08)] hover:shadow-[0_8px_32px_rgba(26,155,220,0.16)] transition-shadow duration-200 overflow-hidden animate-[fadeUp_0.45s_cubic-bezier(0.22,0.9,0.36,1)_both]"
            style={{ animationDelay: '0.2s', backgroundColor: "#f9f9f9", border: "1px solid #daeaf6", borderRadius: "16px", boxShadow: "0 2px 16px rgba(26,155,220,0.08)", transition: "box-shadow 0.3s ease", overflow: "hidden" }}>
            <div className="flex items-center justify-between px-[24px] pt-[20px]">
              <span className="text-[15px] font-bold text-[#1a2b3c]" style={{ fontWeight: "600", textDecoration: "none" }}>Recent Reports Evaluated</span>
              <Link href="/doctor/reports" className="text-[12.5px] font-medium text-[#1a9bdc] hover:underline decoration-[#1a9bdc] transition-all">
                View all →
              </Link>
            </div>
            
            <table className="w-full border-collapse mt-[12px]">
              <thead>
                <tr>
                  <th className="text-left text-[11px] font-semibold text-[#8ca8be] uppercase tracking-[0.08em] px-[24px] py-[8px] border-b border-[#daeaf6]">Patient</th>
                  <th className="text-left text-[11px] font-semibold text-[#8ca8be] uppercase tracking-[0.08em] px-[24px] py-[8px] border-b border-[#daeaf6]">Date</th>
                  <th className="text-left text-[11px] font-semibold text-[#8ca8be] uppercase tracking-[0.08em] px-[24px] py-[8px] border-b border-[#daeaf6]">Diagnosis</th>
                  <th className="text-left text-[11px] font-semibold text-[#8ca8be] uppercase tracking-[0.08em] px-[24px] py-[8px] border-b border-[#daeaf6]">Confidence</th>
                  <th className="text-left text-[11px] font-semibold text-[#8ca8be] uppercase tracking-[0.08em] px-[24px] py-[8px] border-b border-[#daeaf6]">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentScans.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-[24px] py-[24px] text-center text-[#8ca8be] text-[13.5px]">
                      No recent reports available.
                    </td>
                  </tr>
                ) : (
                  recentScans.map((scan) => (
                    <tr key={scan.id} className="hover:bg-[#e8f5fd] transition-colors group">
                      <td className="px-[24px] py-[13px] border-b border-[#daeaf6] group-last:border-b-0">
                        <div className="flex items-center gap-[10px]">
                          <div className={`w-[32px] h-[32px] rounded-full bg-gradient-to-br ${getAvatarColor(scan.patients.full_name)} flex items-center justify-center text-[12px] font-bold text-white shrink-0`}>
                            {scan.patients.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().substring(0, 2)}
                          </div>
                          <div>
                            <div className="font-semibold text-[13.5px] text-[#1a2b3c]">{scan.patients.full_name}</div>
                            <div className="text-[11px] text-[#8ca8be]">{scan.patients.patient_id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-[24px] py-[13px] border-b border-[#daeaf6] group-last:border-b-0 text-[13.5px] text-[#1a2b3c]">
                        {new Date(scan.uploaded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-[24px] py-[13px] border-b border-[#daeaf6] group-last:border-b-0">
                        <span className={`inline-block text-[11.5px] font-semibold px-[10px] py-[3px] rounded-[20px] ${getPillStyle(scan.primary_diagnosis)}`}>
                          {scan.primary_diagnosis}
                        </span>
                      </td>
                      <td className="px-[24px] py-[13px] border-b border-[#daeaf6] group-last:border-b-0">
                        <div className="flex items-center gap-[10px]">
                          <div className="flex-1 h-[4px] bg-[#daeaf6] rounded-[2px] overflow-hidden min-w-[60px]">
                            <div className={`h-full rounded-[2px] ${getConfidenceFill(scan.status)}`} style={{ width: `${scan.confidence}%` }}></div>
                          </div>
                          <span className="text-[12px] font-semibold text-[#1a2b3c] min-w-[38px] text-right">
                            {(scan.confidence as number).toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-[24px] py-[13px] border-b border-[#daeaf6] group-last:border-b-0">
                        <span className="inline-flex items-center gap-[6px] text-[13px] text-[#1a2b3c]">
                          <span className={`w-[7px] h-[7px] rounded-full shrink-0 ${getStatusDot(scan.status)}`}></span>
                          {scan.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>

      {/* Edit Profile Modal — portal with mounted guard */}
      {mounted && isEditing && createPortal(
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(10,37,64,0.45)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setIsEditing(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "18px",
              boxShadow: "0 16px 48px rgba(26,155,220,0.18)",
              width: "100%",
              maxWidth: "440px",
              margin: "0 16px",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              background: "linear-gradient(135deg, #1a9bdc, #0e6fa8)",
              padding: "20px 28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#fff", margin: 0, letterSpacing: "-0.3px" }}>Edit Profile</h3>
              <button
                onClick={() => setIsEditing(false)}
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.2)",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "18px" }}>

              {/* Full Name */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#8ca8be", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>Full Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Dr. Abderrahmane Metiri"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid #daeaf6",
                    fontSize: "14px",
                    color: "#1a2b3c",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Gender */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#8ca8be", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>Gender</label>
                <select
                  value={editForm.gender}
                  onChange={(e) => setEditForm((f) => ({ ...f, gender: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid #daeaf6",
                    fontSize: "14px",
                    color: "#1a2b3c",
                    outline: "none",
                    background: "#fff",
                    cursor: "pointer",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              {/* Speciality */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#8ca8be", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>Speciality</label>
                <input
                  type="text"
                  value={editForm.speciality}
                  onChange={(e) => setEditForm((f) => ({ ...f, speciality: e.target.value }))}
                  placeholder="Neuroradiology & Oncology"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid #daeaf6",
                    fontSize: "14px",
                    color: "#1a2b3c",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#8ca8be", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>Date of Birth</label>
                <input
                  type="date"
                  value={editForm.dateOfBirth || ""}
                  onChange={(e) => setEditForm((f) => ({ ...f, dateOfBirth: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid #daeaf6",
                    fontSize: "14px",
                    color: "#1a2b3c",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Save Message */}
              {saveMsg && (
                <div style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  textAlign: "center",
                  padding: "8px",
                  borderRadius: "8px",
                  background: saveMsg.includes("success") ? "#d1fae5" : "#fde8e8",
                  color: saveMsg.includes("success") ? "#065f46" : "#c53030",
                }}>
                  {saveMsg}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ padding: "0 28px 24px", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "10px" }}>
              <button
                onClick={() => setIsEditing(false)}
                style={{
                  padding: "9px 18px",
                  borderRadius: "9px",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#4a6275",
                  background: "#f0f5fa",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                style={{
                  padding: "9px 22px",
                  borderRadius: "9px",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#fff",
                  background: "#1a9bdc",
                  border: "none",
                  cursor: saving ? "not-allowed" : "pointer",
                  opacity: saving ? 0.6 : 1,
                }}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}