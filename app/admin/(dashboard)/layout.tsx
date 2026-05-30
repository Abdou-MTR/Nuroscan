import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import DashboardLayout from '@/components/layout/DashboardLayout';
import type { AppUser } from '@/types';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const isAdmin = cookieStore.get('admin_auth_token')?.value === 'true';

  if (!isAdmin) {
    redirect('/admin/login');
  }

  const appUser = {
    id: 'system-admin-id',
    name: 'System Admin',
    email: process.env.ADMIN_EMAIL || 'admin@neuroscan.ai',
    role: 'admin' as const,
    avatarInitials: 'SA',
    avatarGradient: 'linear-gradient(135deg,#f59e0b,#d97706)',
    avatarTextColor: '#fff',
  } as AppUser;

  return <DashboardLayout role="admin" user={appUser}>{children}</DashboardLayout>;
}
