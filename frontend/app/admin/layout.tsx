'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/Sidebar';
import AdminTopbar from '@/components/admin/Topbar';
import { useAuthStore } from '@/store/authStore';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, user, _hasHydrated } = useAuthStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Auth guard: wait for hydration, then check access
  useEffect(() => {
    if (!_hasHydrated) return;
    if (!isAuthenticated || !user) {
      router.replace('/login');
      return;
    }
    const allowed = ['super_admin', 'admin', 'petugas'];
    if (!allowed.includes(user.role)) {
      router.replace('/beranda');
    }
  }, [_hasHydrated, isAuthenticated, user, router]);

  // Close mobile sidebar on route changes
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, []);

  // Show nothing while hydrating or unauthorized
  if (!_hasHydrated || !isAuthenticated || !user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '36px', height: '36px', border: '3px solid #E2E8F0', borderTopColor: '#3B82F6', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 0.7s linear infinite' }} />
          <p style={{ color: '#64748B', fontSize: '0.875rem' }}>Memuat...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto', minWidth: 0 }}>
        <AdminTopbar onMenuToggle={() => setMobileSidebarOpen(true)} />
        <main style={{
          flex: 1,
          padding: isMobile ? '16px' : '28px',
          minWidth: 0,
          width: '100%',
          overflow: 'hidden',
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}
