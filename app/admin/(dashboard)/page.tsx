"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { fetchAllUsers, deleteUser } from "./actions";

export default function AdminPage() {
  const [profile, setProfile] = useState({
    name: "System Admin",
    email: "admin@neuroscan.ai",
    role: "System Administrator",
    department: "IT & Security",
  });
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    usersDelta: 0,
    activeSessions: 1,
    activeDelta: 0,
    systemAlerts: 0,
  });

  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      const supabase = createClient();
      
      const name = "System Admin";
      
      setProfile({
        name,
        email: "admin@neuroscan.ai",
        role: "System Administrator",
        department: "IT & Security",
      });

      // Fetch all users (doctors and patients) for user management using server action
      const usersData = await fetchAllUsers();

      if (usersData) {
        const now = new Date();
        const thisMonth = usersData.filter((p: any) => {
          const d = new Date(p.created_at);
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }).length;

        setStats({
          totalUsers: usersData.length,
          usersDelta: thisMonth,
          activeSessions: Math.floor(Math.random() * 5) + 1, // Mock value
          activeDelta: 2,
          systemAlerts: 0,
        });

        setPatients(usersData);
      }

      setLoading(false);
    }
    
    loadAdminData();
  }, []);

  const handleDeleteUser = async (patientId: string, fullName: string) => {
    if (!window.confirm(`Are you sure you want to delete user ${fullName}? This action cannot be undone.`)) {
      return;
    }

    const { success, error } = await deleteUser(patientId);
    
    if (!success) {
      alert("Failed to delete user: " + error);
    } else {
      setPatients((prev) => prev.filter(p => p.id !== patientId));
      setStats((prev) => ({
        ...prev,
        totalUsers: prev.totalUsers - 1,
      }));
    }
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2) || "SA";
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "from-[#f87171] to-[#dc2626]", // red
      "from-[#fbbf24] to-[#d97706]", // yellow
      "from-[#34d399] to-[#059669]", // green
      "from-[#818cf8] to-[#4f46e5]", // purple
      "from-[#38bdf8] to-[#0284c7]", // blue
    ];
    let sum = 0;
    for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
    return colors[sum % colors.length];
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-[#ddeeff] min-h-screen">
        <div className="w-8 h-8 border-[3px] border-[#daeaf6] border-t-[#1a9bdc] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 p-[36px_40px_48px] overflow-auto bg-[#ddeeff] min-h-screen text-[#1a2b3c] font-sans relative">
      
   
      

      {/* Header */}
      <div className="flex items-start justify-between mb-[32px]">
        <div>
          <h1 className="text-[26px] font-bold text-[#1a2b3c] tracking-[-0.4px]">Admin Portal</h1>
          <p className="text-[13.5px] text-[#8ca8be] mt-[3px]">Manage users and system data securely</p>
        </div>
 
      </div>

      <div className="grid grid-cols-[320px_1fr] gap-[24px] items-start animate-[fadeUp_0.45s_cubic-bezier(0.22,0.9,0.36,1)_both]">
        
        {/* Left Column: Admin Profile Card */}
        <div className="bg-white rounded-[16px] border border-[#daeaf6] shadow-[0_2px_16px_rgba(26,155,220,0.08)] hover:shadow-[0_8px_32px_rgba(26,155,220,0.16)] transition-shadow duration-200 overflow-hidden">
          
          <div className="bg-gradient-to-br from-[#1a9bdc] to-[#0e6fa8] pt-[32px] px-[28px] pb-[24px] flex flex-col items-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%27120%27%20height=%27120%27%20viewBox=%270%200%20120%20120%27%20xmlns=%27http://www.w3.org/2000/svg%27%3E%3Ccircle%20cx=%2760%27%20cy=%2760%27%20r=%2755%27%20fill=%27none%27%20stroke=%27rgba(255,255,255,0.06)%27%20stroke-width=%2720%27/%3E%3Ccircle%20cx=%2760%27%20cy=%2760%27%20r=%2735%27%20fill=%27none%27%20stroke=%27rgba(255,255,255,0.04)%27%20stroke-width=%2714%27/%3E%3C/svg%3E')] bg-center bg-cover"></div>
            
            <div
                        style={{fontWeight: "600" ,color: "#fff", textDecoration: "none" ,}}

             className="w-[88px] h-[88px] rounded-full bg-gradient-to-br from-[#f59e0b] to-[#d97706] flex items-center justify-center text-white text-[32px] font-bold border-[3px] border-[rgba(255,255,255,0.4)] mb-[14px] relative z-10 shadow-lg">
               {getInitials(profile.name)}
            </div>
            
            <h2 
                                    style={{fontWeight: "600" ,color: "#fff", textDecoration: "none" ,}}

            className="relative z-10 text-[19px] font-bold text-white text-center tracking-[-0.3px]">{profile.name}</h2>
            
            <div
                                    style={{fontWeight: "300" ,color: "#fff", textDecoration: "none" ,}}
 className="relative z-10 mt-[8px] bg-[rgba(255,255,255,0.2)] border border-[rgba(255,255,255,0.3)] text-white text-[12px] font-medium px-[14px] py-[4px] rounded-[20px] backdrop-blur-[4px]">
              {profile.role}
            </div>
          </div>

          <div className="px-[28px] py-[24px]">
            <div className="flex items-start gap-[12px] py-[12px] border-b border-[#daeaf6]">
              <div className="w-[34px] h-[34px] rounded-[9px] bg-[#e8f5fd] flex items-center justify-center text-[#1a9bdc] shrink-0">
                <svg className="w-[16px] h-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="8" r="4"/><path strokeLinecap="round" strokeLinejoin="round" d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              </div>
              <div>
                <p className="text-[11px] text-[#8ca8be] font-medium uppercase tracking-[0.06em] mb-[2px]">Admin Name</p>
                <p className="text-[14px] font-medium text-[#1a2b3c]">{profile.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-[12px] py-[12px] border-b border-[#daeaf6]">
              <div className="w-[34px] h-[34px] rounded-[9px] bg-[#e8f5fd] flex items-center justify-center text-[#1a9bdc] shrink-0">
                <svg className="w-[16px] h-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
              <div>
                <p className="text-[11px] text-[#8ca8be] font-medium uppercase tracking-[0.06em] mb-[2px]">Department</p>
                <p className="text-[14px] font-medium text-[#1a2b3c]">{profile.department}</p>
              </div>
            </div>

            <div className="flex items-start gap-[12px] py-[12px]">
              <div className="w-[34px] h-[34px] rounded-[9px] bg-[#e8f5fd] flex items-center justify-center text-[#1a9bdc] shrink-0">
                <svg className="w-[16px] h-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline strokeLinecap="round" strokeLinejoin="round" points="22,6 12,13 2,6"/></svg>
              </div>
              <div>
                <p className="text-[11px] text-[#8ca8be] font-medium uppercase tracking-[0.06em] mb-[2px]">Email</p>
                <p className="text-[14px] font-medium text-[#1a2b3c]">{profile.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-[20px]">
          
          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-[16px]">
            
            <div className="bg-white border border-[#daeaf6] rounded-[14px] p-[22px_20px] shadow-[0_2px_16px_rgba(26,155,220,0.08)] hover:shadow-[0_8px_32px_rgba(26,155,220,0.16)] hover:-translate-y-[2px] transition-all duration-200 relative overflow-hidden animate-[fadeUp_0.45s_cubic-bezier(0.22,0.9,0.36,1)_both]" style={{ animationDelay: '0.05s' }}>
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#1a9bdc] to-[#0e6fa8]"></div>
              <div className="text-[12px] font-medium text-[#8ca8be] mb-[8px] uppercase tracking-[0.07em]">Total Users</div>
              <div className="text-[34px] font-bold text-[#1a2b3c] tracking-[-1px] leading-none">{stats.totalUsers}</div>
              <div className="text-[12px] text-[#8ca8be] mt-[6px] flex items-center gap-[4px]">
                <span className="text-[#22c55e] font-semibold">↑ {stats.usersDelta}</span> this month
              </div>
            </div>
            
            <div className="bg-white border border-[#daeaf6] rounded-[14px] p-[22px_20px] shadow-[0_2px_16px_rgba(26,155,220,0.08)] hover:shadow-[0_8px_32px_rgba(26,155,220,0.16)] hover:-translate-y-[2px] transition-all duration-200 relative overflow-hidden animate-[fadeUp_0.45s_cubic-bezier(0.22,0.9,0.36,1)_both]" style={{ animationDelay: '0.1s' }}>
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#22c55e] to-[#16a34a]"></div>
              <div className="text-[12px] font-medium text-[#8ca8be] mb-[8px] uppercase tracking-[0.07em]">Active Sessions</div>
              <div className="text-[34px] font-bold text-[#1a2b3c] tracking-[-1px] leading-none">{stats.activeSessions}</div>
              <div className="text-[12px] text-[#8ca8be] mt-[6px] flex items-center gap-[4px]">
                <span className="text-[#22c55e] font-semibold">↑ {stats.activeDelta}</span> since yesterday
              </div>
            </div>

            <div className="bg-white border border-[#daeaf6] rounded-[14px] p-[22px_20px] shadow-[0_2px_16px_rgba(26,155,220,0.08)] hover:shadow-[0_8px_32px_rgba(26,155,220,0.16)] hover:-translate-y-[2px] transition-all duration-200 relative overflow-hidden animate-[fadeUp_0.45s_cubic-bezier(0.22,0.9,0.36,1)_both]" style={{ animationDelay: '0.15s' }}>
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#ef4444] to-[#b91c1c]"></div>
              <div className="text-[12px] font-medium text-[#8ca8be] mb-[8px] uppercase tracking-[0.07em]">System Alerts</div>
              <div className="text-[34px] font-bold text-[#1a2b3c] tracking-[-1px] leading-none">{stats.systemAlerts}</div>
              <div className="text-[12px] text-[#8ca8be] mt-[6px] flex items-center gap-[4px]">
                <span className="text-[#22c55e] font-semibold">✓</span> All systems operational
              </div>
            </div>
            
          </div>

          {/* Table */}
          <div className="bg-white rounded-[16px] border border-[#daeaf6] shadow-[0_2px_16px_rgba(26,155,220,0.08)] hover:shadow-[0_8px_32px_rgba(26,155,220,0.16)] transition-shadow duration-200 overflow-hidden animate-[fadeUp_0.45s_cubic-bezier(0.22,0.9,0.36,1)_both]" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between px-[24px] pt-[20px]">
              <span className="text-[15px] font-bold text-[#1a2b3c]">Users Management</span>
              <button onClick={() => alert('Refreshing user list...')}
              
                        className="text-[12px] font-semibold px-8 py-4 rounded-full tracking-[0.5px]"
        style={{
          padding: "8px 12px",
          background: "rgba(14,165,233,0.08)",
          color: "var(--ice-accent)",
          border: "1px solid rgba(14,165,233,0.18)",
        }}>
                Refresh Data
              </button>
            </div>
            
            <table className="w-full border-collapse mt-[12px]">
              <thead>
                <tr>
                  <th className="text-left text-[11px] font-semibold text-[#8ca8be] uppercase tracking-[0.08em] px-[24px] py-[8px] border-b border-[#daeaf6]">User</th>
                  <th className="text-left text-[11px] font-semibold text-[#8ca8be] uppercase tracking-[0.08em] px-[24px] py-[8px] border-b border-[#daeaf6]">Registration Date</th>
                  <th className="text-left text-[11px] font-semibold text-[#8ca8be] uppercase tracking-[0.08em] px-[24px] py-[8px] border-b border-[#daeaf6]">Role</th>
                  <th className="text-left text-[11px] font-semibold text-[#8ca8be] uppercase tracking-[0.08em] px-[24px] py-[8px] border-b border-[#daeaf6]">Status</th>
                  <th className="text-right text-[11px] font-semibold text-[#8ca8be] uppercase tracking-[0.08em] px-[24px] py-[8px] border-b border-[#daeaf6]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-[24px] py-[24px] text-center text-[#8ca8be] text-[13.5px]">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  patients.map((user) => (
                    <tr key={user.id} className="hover:bg-[#e8f5fd] transition-colors group">
                      <td className="px-[24px] py-[13px] border-b border-[#daeaf6] group-last:border-b-0">
                        <div className="flex items-center gap-[10px]">
                          <div className={`w-[32px] h-[32px] rounded-full bg-gradient-to-br ${getAvatarColor(user.full_name || "Unknown User")} flex items-center justify-center text-[12px] font-bold text-white shrink-0`}>
                            {(user.full_name || "Unknown User").split(" ").map((n: string) => n[0]).join("").toUpperCase().substring(0, 2)}
                          </div>
                          <div>
                            <div className="font-semibold text-[13.5px] text-[#1a2b3c]">{user.full_name || "Unknown User"}</div>
                            <div className="text-[11px] text-[#8ca8be]">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-[24px] py-[13px] border-b border-[#daeaf6] group-last:border-b-0 text-[13.5px] text-[#1a2b3c]">
                        {new Date(user.created_at || new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-[24px] py-[13px] border-b border-[#daeaf6] group-last:border-b-0">
                        <span className={`inline-block text-[11.5px] font-semibold px-[10px] py-[3px] rounded-[20px] ${user.role === 'doctor' ? 'bg-[#dcfce7] text-[#166534]' : 'bg-[#e0e7ff] text-[#3730a3]'}`}>
                          {user.role === 'doctor' ? 'Doctor' : 'Patient'}
                        </span>
                      </td>
                      <td className="px-[24px] py-[13px] border-b border-[#daeaf6] group-last:border-b-0">
                        <span className="inline-flex items-center gap-[6px] text-[13px] text-[#1a2b3c]">
                          <span className="w-[7px] h-[7px] rounded-full shrink-0 bg-[#22c55e]"></span>
                          Active
                        </span>
                      </td>
                      <td className="px-[24px] py-[13px] border-b border-[#daeaf6] group-last:border-b-0 text-right">
                        <button
                          onClick={() => handleDeleteUser(user.id, user.full_name)}
              className="text-[12px] danger font-semibold px-8 py-4 rounded-full tracking-[0.5px]"
        style={{
          padding: "8px 12px",
          background: "#ef4444e4",
          color: "#fff",
          border: "1px solid #EF4444",
          cursor: "pointer",
        }}                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}
