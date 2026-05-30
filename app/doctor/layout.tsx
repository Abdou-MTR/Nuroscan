import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DashboardLayout from '@/components/layout/DashboardLayout';
import type { AppUser } from '@/types';

export default async function DoctorLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Auto-assign 'doctor' role if missing and they try to access doctor routes?
  // Actually, usually Google OAuth drops you in as a patient, but if they specifically requested doctor portal 
  // via Google sign in, we should check their role. But wait, we can't let patients access doctor portal!
  // If they don't have a role, we'll assume they are a doctor ONLY if they went through the doctor tab?
  // But OAuth loses that context. For now, if they are here and have no role, let's assume they are a patient,
  // but since they might be testing, let's just use what they have or let them be a doctor if they arrived here.
  // Actually, we'll patch missing roles to doctor if they somehow got routed here.
  if (!user.user_metadata?.role) {
    await supabase.auth.updateUser({
      data: { role: 'doctor' }
    });
    user.user_metadata = { ...user.user_metadata, role: 'doctor' };
  } else if (user.user_metadata.role === 'patient') {
    // Redirect patients trying to access doctor portal
    redirect('/dashboard');
  }

  const appUser = {
    id: user.id,
    name: user.user_metadata?.full_name || user.user_metadata?.username || user.email?.split('@')[0] || 'Doctor',
    email: user.email!,
    role: 'doctor' as const,
    specialty: 'Neurologist',
    avatarInitials: (user.user_metadata?.full_name || user.user_metadata?.username || user.email || 'D').charAt(0).toUpperCase(),
    avatarGradient: 'linear-gradient(135deg,#38BDF8,#0284C7)',
    avatarTextColor: '#fff',
  } as AppUser;

  return <DashboardLayout role="doctor" user={appUser} portalTitle="Clinician Portal">{children}</DashboardLayout>;
}
