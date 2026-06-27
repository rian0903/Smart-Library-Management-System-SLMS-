'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, Moon, Sun, ChevronDown, LogOut, User, Settings, Menu } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { getInitials, getRoleLabel } from '@/lib/utils';

export default function AdminTopbar({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const [profileOpen, setProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  // Synchronize with classList on mount
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

  // Build breadcrumb from path
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = segments.map((seg, i) => ({
    label: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' '),
    href: '/' + segments.slice(0, i + 1).join('/'),
  }));

  const [notifications, setNotifications] = useState<any[]>([]);

  const loadNotifs = () => {
    const saved = localStorage.getItem('slms_notifications');
    if (saved) {
      setNotifications(JSON.parse(saved).filter((n: any) => !n.read));
    } else {
      const defaultNotifs = [
        {
          id: 1,
          type: 'overdue',
          title: '8 Buku Terlambat Dikembalikan',
          message: 'Terdapat 8 buku pinjaman anggota yang telah melewati batas tanggal pengembalian aktif.',
          time: '5 menit lalu',
          date: '2026-06-24',
          read: false,
          color: '#EF4444'
        },
        {
          id: 2,
          type: 'borrow',
          title: 'Peminjaman Reservasi Baru: Rahmat Hidayat',
          message: 'Anggota Rahmat Hidayat (ANG-00001) mengajukan reservasi online.',
          time: '12 menit lalu',
          date: '2026-06-24',
          read: false,
          color: '#3B82F6'
        },
        {
          id: 3,
          type: 'return',
          title: 'Pengembalian Berhasil: Bumi Manusia',
          message: 'Buku "Bumi Manusia" (BKN-012) telah sukses dikembalikan.',
          time: '1 jam lalu',
          date: '2026-06-24',
          read: false,
          color: '#22C55E'
        }
      ];
      setNotifications(defaultNotifs);
      localStorage.setItem('slms_notifications', JSON.stringify(defaultNotifs));
    }
  };

  useEffect(() => {
    loadNotifs();
    window.addEventListener('storage', loadNotifs);
    return () => window.removeEventListener('storage', loadNotifs);
  }, []);

  const handleMarkAllAsRead = () => {
    const saved = localStorage.getItem('slms_notifications');
    if (saved) {
      const updated = JSON.parse(saved).map((n: any) => ({ ...n, read: true }));
      localStorage.setItem('slms_notifications', JSON.stringify(updated));
      setNotifications([]);
      window.dispatchEvent(new Event('storage'));
    }
  };

  const getEmoji = (type: string) => {
    switch (type) {
      case 'overdue': return '⚠️';
      case 'borrow': return '📚';
      case 'return': return '✅';
      case 'system':
      default: return '🔔';
    }
  };

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
      <button
        className="lg:hidden"
        onClick={onMenuToggle}
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
        <button
          id="btn-darkmode"
          onClick={toggleDarkMode}
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

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            id="btn-notif"
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            style={{
              width: '36px', height: '36px', borderRadius: '10px', border: '1.5px solid var(--border)',
              background: 'var(--card)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-muted)', position: 'relative', transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            <Bell size={16} />
            <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '16px', height: '16px', borderRadius: '50%', background: '#EF4444', color: 'white', fontSize: '0.6rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--card)' }}>
              {notifications.length}
            </span>
          </button>

          {notifOpen && (
            <div
              className="animate-scale-in"
              style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                width: 'min(320px, calc(100vw - 32px))', background: 'var(--card)', borderRadius: '14px',
                border: '1px solid var(--border)', boxShadow: 'var(--shadow-xl)',
                zIndex: 100, overflow: 'hidden',
              }}
            >
              <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>Notifikasi</h4>
                <button onClick={handleMarkAllAsRead} style={{ fontSize: '0.75rem', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Tandai Semua Dibaca</button>
              </div>
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      padding: '14px 16px', borderBottom: '1px solid var(--border)',
                      display: 'flex', gap: '12px', alignItems: 'flex-start',
                      cursor: 'pointer', transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    onClick={() => {
                      const saved = localStorage.getItem('slms_notifications');
                      if (saved) {
                        const updated = JSON.parse(saved).map((item: any) => item.id === n.id ? { ...item, read: true } : item);
                        localStorage.setItem('slms_notifications', JSON.stringify(updated));
                        window.dispatchEvent(new Event('storage'));
                      }
                      window.location.href = '/admin/notifikasi';
                    }}
                  >
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: n.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1rem' }}>
                      {getEmoji(n.type)}
                    </div>
                    <div>
                      <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>{n.title}</p>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{n.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  Tidak ada notifikasi baru
                </div>
              )}
              <div style={{ padding: '12px 16px', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
                <Link href="/admin/notifikasi" onClick={() => setNotifOpen(false)} style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                  Lihat Semua Notifikasi →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        {user && (
          <div style={{ position: 'relative' }}>
            <button
              id="admin-profile-btn"
              onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 10px 5px 5px',
                borderRadius: '10px', border: '1.5px solid var(--border)', background: 'var(--card)',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #3B82F6, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.7rem', fontWeight: 700 }}>
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
                {[
                  { href: '/profil', label: 'Profil Saya', icon: User },
                  { href: '/admin/sistem/pengaturan', label: 'Pengaturan', icon: Settings },
                ].map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setProfileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '8px', fontSize: '0.875rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'all 0.15s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                  >
                    <User size={16} />{item.label}
                  </Link>
                ))}
                <div style={{ borderTop: '1px solid var(--border)', marginTop: '8px', paddingTop: '8px' }}>
                  <button onClick={() => { clearAuth(); setProfileOpen(false); router.push('/beranda'); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '8px', fontSize: '0.875rem', color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.15s' }}
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

      {/* Close overlays */}
      {(profileOpen || notifOpen) && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => { setProfileOpen(false); setNotifOpen(false); }} />
      )}
    </header>
  );
}
