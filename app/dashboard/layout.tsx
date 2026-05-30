import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DashboardLayout from '@/components/layout/DashboardLayout';
import type { AppUser } from '@/types';

export default async function PatientLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Auto-assign 'patient' role if missing (e.g. Google OAuth login)
  if (!user.user_metadata?.role) {
    await supabase.auth.updateUser({
      data: { role: 'patient' }
    });
    user.user_metadata = { ...user.user_metadata, role: 'patient' };
  } else if (user.user_metadata.role === 'doctor') {
    // Redirect doctors trying to access patient dashboard
    redirect('/doctor');
  }

  const appUser = {
    id: user.id,
    name: user.user_metadata?.full_name || user.user_metadata?.username || user.email?.split('@')[0] || 'Patient',
    email: user.email!,
    role: 'patient' as const,
    avatarInitials: (user.user_metadata?.full_name || user.user_metadata?.username || user.email || 'P').charAt(0).toUpperCase(),
    avatarGradient: 'linear-gradient(135deg,#38BDF8,#0284C7)',
    avatarTextColor: '#fff',
  } as AppUser;

  return <DashboardLayout role="patient" user={appUser}>{children}</DashboardLayout>;
}
