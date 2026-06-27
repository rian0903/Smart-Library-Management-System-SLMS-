'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, Moon, Sun, ChevronDown, LogOut, User, Menu } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { getInitials, getRoleLabel } from '@/lib/utils';

export default function PetugasTopbar({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const [profileOpen, setProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleDarkMode = () => {
    const isDark = !darkMode;
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('slms_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('slms_theme', 'light');
    }
  };

  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = segments.map((seg, i) => ({
    label: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' '),
    href: '/' + segments.slice(0, i + 1).join('/'),
  }));

  return (
    <header
      style={{
        height: '64px', background: 'var(--card)', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', paddingLeft: '16px', paddingRight: '16px',
        gap: '12px', position: 'sticky', top: 0, zIndex: 30,
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      }}
    >
      {/* Mobile hamburger */}
      <button className="lg:hidden" onClick={onMenuToggle}
        style={{
          width: '36px', height: '36px', borderRadius: '10px', border: '1.5px solid var(--border)',
          background: 'var(--card)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-secondary)', flexShrink: 0,
        }}
      >
        <Menu size={18} />
      </button>

      {/* Breadcrumb */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden', minWidth: 0 }}>
        {breadcrumbs.map((crumb, i) => (
          <span key={crumb.href} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {i < breadcrumbs.length - 1 ? (
              <>
                <Link href={crumb.href} style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500, whiteSpace: 'nowrap' }}>
                  {crumb.label}
                </Link>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>/</span>
              </>
            ) : (
              <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 700, whiteSpace: 'nowrap' }}>
                {crumb.label}
              </span>
            )}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Dark mode toggle */}
        <button onClick={toggleDarkMode}
          style={{
            width: '36px', height: '36px', borderRadius: '10px', border: '1.5px solid var(--border)',
            background: 'var(--card)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-muted)', transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Profile */}
        {user && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 10px 5px 5px',
                borderRadius: '10px', border: '1.5px solid var(--border)', background: 'var(--card)',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #22C55E, #16A34A)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.7rem', fontWeight: 700 }}>
                {getInitials(user.name)}
              </div>
              <div className="hidden sm:block" style={{ textAlign: 'left' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>{user.name.split(' ')[0]}</p>
                <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{getRoleLabel(user.role)}</p>
              </div>
              <ChevronDown size={14} color="var(--text-muted)" />
            </button>

            {profileOpen && (
              <div className="animate-scale-in" style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: '200px', background: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)', padding: '8px', zIndex: 100 }}>
                <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', marginBottom: '4px' }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{user.name}</p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user.email}</p>
                </div>
                <div style={{ borderTop: '1px solid var(--border)', marginTop: '4px', paddingTop: '4px' }}>
                  <button onClick={() => { clearAuth(); setProfileOpen(false); router.push('/beranda'); }}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '8px', fontSize: '0.875rem', color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.15s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#FEE2E2'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <LogOut size={16} />Keluar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {profileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setProfileOpen(false)} />
      )}
    </header>
  );
}
