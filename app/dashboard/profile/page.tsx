"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

export default function PatientProfilePage() {
  const [profile, setProfile] = useState({
    name: "Patient",
    email: "No email provided",
    role: "Patient",
    gender: "",
    dateOfBirth: "",
  });
  
  const [stats, setStats] = useState({
    scans: 0,
    scansDelta: 0,
    evaluated: 0,
    evaluatedDelta: 0,
    pending: 0,
  });

  const [recentScans, setRecentScans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit profile state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", gender: "", dateOfBirth: "" });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const openEditModal = () => {
    console.log('Opening edit modal');
    setEditForm({ name: profile.name, gender: profile.gender, dateOfBirth: profile.dateOfBirth });
    setSaveMsg(null);
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveMsg(null);
    try {
      const supabase = createClient();
      
      // Get current user ID to update profiles table
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: editForm.name.trim(),
          gender: editForm.gender,
          date_of_birth: editForm.dateOfBirth,
        },
      });
      if (authError) throw authError;

      // Update public profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: editForm.name.trim(),
          gender: editForm.gender,
          date_of_birth: editForm.dateOfBirth,
        })
        .eq('id', user.id);
        
      if (profileError) throw profileError;
      setProfile((prev) => ({ ...prev, name: editForm.name.trim(), gender: editForm.gender, dateOfBirth: editForm.dateOfBirth }));
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

      // Fetch extended profile data from the public profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      console.log('Patient profile fetch result:', { profileData, profileError, userMeta: user.user_metadata });
      
      if (profileError) {
        console.error('Error fetching profile:', profileError);
      }

      const meta = user.user_metadata || {};
      const name = profileData?.full_name || meta.full_name || user.email?.split('@')[0] || 'Patient';
      const email = profileData?.email || user.email || 'No email provided';
      const role = profileData?.role || meta.role || 'Patient';
      const gender = profileData?.gender || meta.gender || '';
      const dateOfBirth = profileData?.date_of_birth || meta.date_of_birth || '';
      setProfile({ name, email, role, gender, dateOfBirth });

      // Fetch patient scans
      const { data: scansData } = await supabase
        .from("scans")
        .select("*")
        .eq("uploader_id", user.id)
        .order("uploaded_at", { ascending: false });

      let scansCount = 0;
      let scansThisMonth = 0;
      let evaluatedCount = 0;
      let evaluatedThisMonth = 0;
      let pendingCount = 0;
      
      if (scansData) {
        scansCount = scansData.length;
        const now = new Date();
        
        scansData.forEach((s: any) => {
          const d = new Date(s.uploaded_at);
          const isThisMonth = d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
          
          if (isThisMonth) scansThisMonth++;

          const isPending = s.status === "Review" || s.status === "Pending";
          if (isPending) {
            pendingCount++;
          } else {
            evaluatedCount++;
            if (isThisMonth) evaluatedThisMonth++;
          }
        });
        
        setRecentScans(scansData.slice(0, 10));
      }

      setStats({
        scans: scansCount,
        scansDelta: scansThisMonth,
        evaluated: evaluatedCount,
        evaluatedDelta: evaluatedThisMonth,
        pending: pendingCount,
      });

      setLoading(false);
    }
    
    loadProfile();
  }, []);

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2) || "PT";
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
          <p className="text-[13.5px] text-[#8ca8be] mt-[3px]">Manage your personal and account information</p>
        </div>
       
      </div>

      <div className="grid grid-cols-[320px_1fr] gap-[24px] items-start animate-[fadeUp_0.45s_cubic-bezier(0.22,0.9,0.36,1)_both]">
        
        {/* Left Column: Profile Card */}
        <div className="bg-white rounded-[16px] border border-[#daeaf6] shadow-[0_2px_16px_rgba(26,155,220,0.08)] hover:shadow-[0_8px_32px_rgba(26,155,220,0.16)] transition-shadow duration-200 overflow-hidden">
          
          <div className="bg-gradient-to-br from-[#1a9bdc] to-[#0e6fa8] pt-[32px] px-[28px] pb-[24px] flex flex-col items-center relative overflow-hidden">
            {/* SVG Background Pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%27120%27%20height=%27120%27%20viewBox=%270%200%20120%20120%27%20xmlns=%27http://www.w3.org/2000/svg%27%3E%3Ccircle%20cx=%2760%27%20cy=%2760%27%20r=%2755%27%20fill=%27none%27%20stroke=%27rgba(255,255,255,0.06)%27%20stroke-width=%2720%27/%3E%3Ccircle%20cx=%2760%27%20cy=%2760%27%20r=%2735%27%20fill=%27none%27%20stroke=%27rgba(255,255,255,0.04)%27%20stroke-width=%2714%27/%3E%3C/svg%3E')] bg-center bg-cover"></div>
            
            <div className="w-[88px] h-[88px] rounded-full bg-[rgba(255,255,255,0.2)] flex items-center justify-center text-white text-[32px] font-bold border-[3px] border-[rgba(255,255,255,0.4)] mb-[14px] relative z-10 backdrop-blur-[4px]
            "style={{fontWeight: "600" ,color: "#fff", textDecoration: "none" ,}}
                        >
               {getInitials(profile.name)}
            </div>
            
            <h2 style={{fontWeight: "600" ,color: "#fff", textDecoration: "none" ,}} 
            className="relative z-10 text-[19px] font-bold text-white text-center tracking-[-0.3px]">{profile.name}</h2>
            
            <div 
            style={{fontWeight: "600" ,color: "#fff", textDecoration: "none" ,}}className="relative z-10 mt-[8px] bg-[rgba(255,255,255,0.2)] border border-[rgba(255,255,255,0.3)] text-white text-[12px] font-medium px-[14px] py-[4px] rounded-[20px] backdrop-blur-[4px]">
              {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
            </div>
            
            <div className="relative z-10 mt-[10px] flex items-center gap-[5px] bg-[rgba(34,197,94,0.2)] border border-[rgba(34,197,94,0.4)] text-[#d1fae5] text-[11px] font-medium px-[10px] py-[3px] rounded-[20px]">
              <svg className="w-[11px] h-[11px]" viewBox="0 0 24 24" fill="currentColor"><path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
              Registered {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
            </div>
          </div>

          <div className="px-[28px] py-[24px]" style={{backgroundColor: "#f9f9f9"}}>
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
                <svg className="w-[16px] h-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
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

            <div className="flex items-start gap-[12px] py-[12px] border-b border-[#daeaf6]">
              <div className="w-[34px] h-[34px] rounded-[9px] bg-[#e8f5fd] flex items-center justify-center text-[#1a9bdc] shrink-0">
                <svg className="w-[16px] h-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <div>
                <p className="text-[11px] text-[#8ca8be] font-medium uppercase tracking-[0.06em] mb-[2px]">Date of Birth</p>
                <p className="text-[14px] font-medium text-[#1a2b3c]">{profile.dateOfBirth || "Not Specified"}</p>
              </div>
            </div>

       
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-[20px]">
          
          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-[16px]">
            
            <div className="bg-white border border-[#daeaf6] rounded-[14px] p-[22px_20px] shadow-[0_2px_16px_rgba(26,155,220,0.08)] hover:shadow-[0_8px_32px_rgba(26,155,220,0.16)] hover:-translate-y-[2px] transition-all duration-200 relative overflow-hidden animate-[fadeUp_0.45s_cubic-bezier(0.22,0.9,0.36,1)_both]" style={{ animationDelay: '0.05s' ,backgroundColor: "#f9f9f9"}}>
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#1a9bdc] to-[#0e6fa8]"></div>
              <div className="text-[12px] font-medium text-[#8ca8be] mb-[8px] uppercase tracking-[0.07em]">Total Scans</div>
              <div className="text-[34px] font-bold text-[#1a2b3c] tracking-[-1px] leading-none">{stats.scans}</div>
              <div className="text-[12px] text-[#8ca8be] mt-[6px] flex items-center gap-[4px]">
                <span className="text-[#22c55e] font-semibold">↑ {stats.scansDelta}</span> this month
              </div>
            </div>
            
            <div className="bg-white border border-[#daeaf6] rounded-[14px] p-[22px_20px] shadow-[0_2px_16px_rgba(26,155,220,0.08)] hover:shadow-[0_8px_32px_rgba(26,155,220,0.16)] hover:-translate-y-[2px] transition-all duration-200 relative overflow-hidden animate-[fadeUp_0.45s_cubic-bezier(0.22,0.9,0.36,1)_both]" style={{ animationDelay: '0.1s',backgroundColor: "#f9f9f9" }}>
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#22c55e] to-[#16a34a]"></div>
              <div className="text-[12px] font-medium text-[#8ca8be] mb-[8px] uppercase tracking-[0.07em]">Reports Evaluated</div>
              <div className="text-[34px] font-bold text-[#1a2b3c] tracking-[-1px] leading-none">{stats.evaluated}</div>
              <div className="text-[12px] text-[#8ca8be] mt-[6px] flex items-center gap-[4px]">
                <span className="text-[#22c55e] font-semibold">↑ {stats.evaluatedDelta}</span> this month
              </div>
            </div>

            <div className="bg-white border border-[#daeaf6] rounded-[14px] p-[22px_20px] shadow-[0_2px_16px_rgba(26,155,220,0.08)] hover:shadow-[0_8px_32px_rgba(26,155,220,0.16)] hover:-translate-y-[2px] transition-all duration-200 relative overflow-hidden animate-[fadeUp_0.45s_cubic-bezier(0.22,0.9,0.36,1)_both]" style={{ animationDelay: '0.15s',backgroundColor: "#f9f9f9" }}>
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
          style={{ animationDelay: '0.2s' ,backgroundColor: "#f9f9f9", border: "1px solid #daeaf6", borderRadius: "16px", boxShadow: "0 2px 16px rgba(26,155,220,0.08)", transition: "box-shadow 0.3s ease", overflow: "hidden" }}>
            <div className="flex items-center justify-between px-[24px] pt-[20px]">
              <span className="text-[15px] font-bold text-[#1a2b3c]"
              style={{fontWeight: "600" , textDecoration: "none" ,}}>Recent Scans</span>
              <Link href="/dashboard" className="text-[12.5px] font-medium text-[#1a9bdc] hover:underline decoration-[#1a9bdc] transition-all">
                View all →
              </Link>
            </div>
            
            <table className="w-full border-collapse mt-[12px]">
              <thead>
                <tr>
                  <th className="text-left text-[11px] font-semibold text-[#8ca8be] uppercase tracking-[0.08em] px-[24px] py-[8px] border-b border-[#daeaf6]">Scan Name</th>
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
                      No recent scans available.
                    </td>
                  </tr>
                ) : (
                  recentScans.map((scan) => (
                    <tr key={scan.id} className="hover:bg-[#e8f5fd] transition-colors group">
                      <td className="px-[24px] py-[13px] border-b border-[#daeaf6] group-last:border-b-0">
                        <div className="font-semibold text-[13.5px] text-[#1a2b3c]">{scan.filename || "MRI Scan"}</div>
                        <div className="text-[11px] text-[#8ca8be]">{scan.format || "MRI"} • {scan.file_size_mb || "0.0"}MB</div>
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
                            {(scan.confidence as number)?.toFixed(1) || 0}%
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

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(10,37,64,0.45)", backdropFilter: "blur(4px)" }}>
          <div className="bg-white rounded-[18px] shadow-[0_16px_48px_rgba(26,155,220,0.18)] w-full max-w-[440px] mx-4 animate-[fadeUp_0.25s_ease] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-br from-[#1a9bdc] to-[#0e6fa8] px-[28px] py-[20px] flex items-center justify-between">
              <h3 className="text-[17px] font-bold text-white tracking-[-0.3px]">Edit Profile</h3>
              <button onClick={() => setIsEditing(false)} className="w-[28px] h-[28px] rounded-full bg-[rgba(255,255,255,0.2)] flex items-center justify-center text-white hover:bg-[rgba(255,255,255,0.3)] transition-colors cursor-pointer border-none">
                <svg className="w-[14px] h-[14px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-[28px] py-[24px] flex flex-col gap-[18px]">
              {/* Full Name */}
              <div>
                <label className="block text-[12px] font-semibold text-[#8ca8be] uppercase tracking-[0.06em] mb-[6px]">Full Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-[14px] py-[10px] rounded-[10px] border border-[#daeaf6] text-[14px] text-[#1a2b3c] outline-none focus:border-[#1a9bdc] focus:shadow-[0_0_0_3px_rgba(26,155,220,0.12)] transition-all"
                  placeholder="Your Name"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-[12px] font-semibold text-[#8ca8be] uppercase tracking-[0.06em] mb-[6px]">Gender</label>
                <select
                  value={editForm.gender}
                  onChange={(e) => setEditForm((f) => ({ ...f, gender: e.target.value }))}
                  className="w-full px-[14px] py-[10px] rounded-[10px] border border-[#daeaf6] text-[14px] text-[#1a2b3c] outline-none focus:border-[#1a9bdc] focus:shadow-[0_0_0_3px_rgba(26,155,220,0.12)] transition-all bg-white cursor-pointer"
                >
                  <option value="Not Specified">Not Specified</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-[12px] font-semibold text-[#8ca8be] uppercase tracking-[0.06em] mb-[6px]">Date of Birth</label>
                <input
                  type="date"
                  value={editForm.dateOfBirth !== "Not Specified" ? editForm.dateOfBirth : ""}
                  onChange={(e) => setEditForm((f) => ({ ...f, dateOfBirth: e.target.value }))}
                  className="w-full px-[14px] py-[10px] rounded-[10px] border border-[#daeaf6] text-[14px] text-[#1a2b3c] outline-none focus:border-[#1a9bdc] focus:shadow-[0_0_0_3px_rgba(26,155,220,0.12)] transition-all"
                />
              </div>

              {/* Save Message */}
              {saveMsg && (
                <div className={`text-[13px] font-medium text-center py-[8px] rounded-[8px] ${saveMsg.includes("success") ? "bg-[#d1fae5] text-[#065f46]" : "bg-[#fde8e8] text-[#c53030]"}`}>
                  {saveMsg}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-[28px] pb-[24px] flex items-center justify-end gap-[10px]">
              <button
                onClick={() => setIsEditing(false)}
                className="px-[18px] py-[9px] rounded-[9px] text-[13px] font-semibold text-[#4a6275] bg-[#f0f5fa] hover:bg-[#e2ebf3] transition-colors cursor-pointer border-none"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="px-[22px] py-[9px] rounded-[9px] text-[13px] font-semibold text-white bg-[#1a9bdc] hover:bg-[#1480bb] transition-all cursor-pointer border-none disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
