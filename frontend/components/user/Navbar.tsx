'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Library, Search, Bell, User, Menu, X, ChevronDown,
  BookOpen, Home, Star, History, Info, LogIn, LogOut,
  Moon, Sun,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { getInitials } from '@/lib/utils';

const navLinks = [
  { href: '/beranda', label: 'Beranda', icon: Home },
  { href: '/katalog', label: 'Katalog Buku', icon: BookOpen },
  { href: '/buku-populer', label: 'Buku Populer', icon: Star },
  { href: '/riwayat', label: 'Riwayat Peminjaman', icon: History },
  { href: '/tentang', label: 'Tentang Kami', icon: Info },
];

export default function UserNavbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);

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

  return (
    <>
      <nav
        style={{
          position: 'sticky', top: 0, zIndex: 50,
          background: 'var(--navbar-bg)', backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}
      >
        <div className="page-container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px' }}>
            {/* Logo */}
            <Link href="/beranda" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
              <div
                style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Library size={22} color="white" />
              </div>
              <div className="hidden lg:block">
                <p style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Perpustakaan
                </p>
                <p style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>
                  Kabupaten Bireuen
                </p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex" style={{ alignItems: 'center', gap: '4px' }}>
              {navLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{
                      padding: '8px 14px', borderRadius: '8px', fontSize: '0.875rem',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                      background: isActive ? '#EFF6FF' : 'transparent',
                      textDecoration: 'none', transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'var(--bg)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                      }
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Right Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Search */}
              <button
                id="btn-search"
                onClick={() => setSearchOpen(!searchOpen)}
                style={{
                  width: '38px', height: '38px', borderRadius: '10px', border: '1.5px solid var(--border)',
                  background: 'var(--card)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-secondary)', transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                <Search size={18} />
              </button>

              {/* Theme Toggle */}
              <button
                id="btn-theme-user"
                onClick={toggleDarkMode}
                style={{
                  width: '38px', height: '38px', borderRadius: '10px', border: '1.5px solid var(--border)',
                  background: 'var(--card)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-secondary)', transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {isAuthenticated && user ? (
                <>
                  {/* Notification */}
                  <Link
                    href="/riwayat"
                    style={{
                      width: '38px', height: '38px', borderRadius: '10px', border: '1.5px solid var(--border)',
                      background: 'var(--card)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--text-secondary)', position: 'relative', transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                  >
                    <Bell size={18} />
                    <span
                      style={{
                        position: 'absolute', top: '-4px', right: '-4px',
                        width: '16px', height: '16px', borderRadius: '50%',
                        background: 'var(--danger)', color: 'white', fontSize: '0.65rem',
                        fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '2px solid var(--card)',
                      }}
                    >2</span>
                  </Link>

                  {/* Profile dropdown */}
                  <div style={{ position: 'relative' }}>
                    <button
                      id="btn-profile"
                      onClick={() => setProfileOpen(!profileOpen)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '6px 12px 6px 6px', borderRadius: '10px',
                        border: '1.5px solid var(--border)', background: 'var(--card)',
                        cursor: 'pointer', transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                    >
                      <div
                        style={{
                          width: '28px', height: '28px', borderRadius: '8px',
                          background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'white', fontSize: '0.7rem', fontWeight: 700,
                        }}
                      >
                        {getInitials(user.name)}
                      </div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user.name.split(' ')[0]}
                      </span>
                      <ChevronDown size={14} color="var(--text-muted)" />
                    </button>

                    {profileOpen && (
                      <div
                        style={{
                          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                          width: '200px', background: 'var(--card)', borderRadius: '12px',
                          border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)',
                          padding: '8px', zIndex: 100,
                        }}
                        className="animate-scale-in"
                      >
                        <div style={{ padding: '8px 12px 12px', borderBottom: '1px solid var(--border)', marginBottom: '8px' }}>
                          <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{user.name}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</p>
                        </div>
                        {[
                          { href: '/profil', label: 'Profil Saya', icon: User },
                          { href: '/riwayat', label: 'Riwayat Peminjaman', icon: History },
                        ].map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setProfileOpen(false)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '10px',
                              padding: '8px 12px', borderRadius: '8px', fontSize: '0.875rem',
                              color: 'var(--text-secondary)', textDecoration: 'none',
                              transition: 'all 0.15s',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                          >
                            <item.icon size={16} />
                            {item.label}
                          </Link>
                        ))}
                        <div style={{ borderTop: '1px solid var(--border)', marginTop: '8px', paddingTop: '8px' }}>
                          <button
                            id="btn-logout"
                            onClick={() => { clearAuth(); setProfileOpen(false); }}
                            style={{
                              width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                              padding: '8px 12px', borderRadius: '8px', fontSize: '0.875rem',
                              color: 'var(--danger)', background: 'none', border: 'none',
                              cursor: 'pointer', transition: 'all 0.15s',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#FEE2E2'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                          >
                            <LogOut size={16} />
                            Keluar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Link href="/login" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '0.875rem' }}>
                  <LogIn size={16} /> Masuk
                </Link>
              )}

              {/* Mobile menu */}
              <button
                className="lg:hidden"
                onClick={() => setMobileOpen(!mobileOpen)}
                style={{
                  width: '38px', height: '38px', borderRadius: '10px', border: '1.5px solid var(--border)',
                  background: 'var(--card)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Search bar overlay */}
        {searchOpen && (
          <div style={{ borderTop: '1px solid var(--border)', padding: '12px 24px', background: 'var(--card)' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                id="search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul buku, penulis, kategori..."
                autoFocus
                className="input-base"
                style={{ paddingLeft: '44px', paddingRight: '44px' }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setSearchOpen(false);
                  if (e.key === 'Enter' && searchQuery) {
                    window.location.href = `/katalog?search=${searchQuery}`;
                  }
                }}
              />
              <button
                onClick={() => setSearchOpen(false)}
                style={{
                  position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{ borderTop: '1px solid var(--border)', background: 'var(--card)', padding: '12px 24px 20px' }} className="lg:hidden">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px', borderRadius: '10px', fontSize: '0.9rem',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                    background: isActive ? 'var(--bg)' : 'transparent',
                    textDecoration: 'none', marginBottom: '4px', transition: 'all 0.2s',
                  }}
                >
                  <link.icon size={18} />
                  {link.label}
                </Link>
              );
            })}
            {!isAuthenticated && (
              <Link href="/login" className="btn btn-primary" style={{ width: '100%', marginTop: '12px', justifyContent: 'center' }}>
                <LogIn size={16} /> Masuk
              </Link>
            )}
          </div>
        )}
      </nav>

      {/* Overlay for closing dropdowns */}
      {profileOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 40 }}
          onClick={() => setProfileOpen(false)}
        />
      )}
    </>
  );
}
