'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PetugasSidebar from '@/components/petugas/Sidebar';
import PetugasTopbar from '@/components/petugas/Topbar';
import { useAuthStore } from '@/store/authStore';

export default function PetugasLayout({ children }: { children: React.ReactNode }) {
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
    // Only petugas can access /petugas routes; admin/super_admin go to admin
    if (user.role !== 'petugas') {
      router.replace('/admin/dashboard');
    }
  }, [_hasHydrated, isAuthenticated, user, router]);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, []);

  // Show loading while hydrating or unauthorized
  if (!_hasHydrated || !isAuthenticated || !user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '36px', height: '36px', border: '3px solid #E2E8F0', borderTopColor: '#22C55E', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 0.7s linear infinite' }} />
          <p style={{ color: '#64748B', fontSize: '0.875rem' }}>Memuat...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <PetugasSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto', minWidth: 0 }}>
        <PetugasTopbar onMenuToggle={() => setMobileSidebarOpen(true)} />
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
