'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, BookOpen, Lock, Mail, ArrowRight, Library } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { mockUsers } from '@/data/mockData';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth, isAuthenticated, user } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated && user) {
      redirectByRole(user.role);
    }
  }, [isAuthenticated, user]);

  function redirectByRole(role: string) {
    if (role === 'super_admin' || role === 'admin') router.push('/admin/dashboard');
    else if (role === 'petugas') router.push('/petugas/dashboard');
    else router.push('/beranda');
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise((r) => setTimeout(r, 1200));

    // Demo accounts
    const demoAccounts: Record<string, { password: string; role: string }> = {
      'superadmin@bireuen.go.id': { password: 'password', role: 'super_admin' },
      'admin@bireuen.go.id': { password: 'password', role: 'admin' },
      'ahmad@bireuen.go.id': { password: 'password', role: 'petugas' },
      'rahmat@gmail.com': { password: 'password', role: 'user' },
    };

    const account = demoAccounts[email];
    if (account && account.password === password) {
      const foundUser = mockUsers.find((u) => u.email === email) || {
        id: Date.now(),
        name: email.split('@')[0],
        email,
        role: account.role as 'user',
        is_active: true,
        created_at: new Date().toISOString(),
      };
      setAuth(foundUser as typeof mockUsers[0], 'demo-token-' + Date.now());
      redirectByRole(account.role);
    } else {
      setError('Email atau password salah. Gunakan akun demo di bawah.');
    }
    setLoading(false);
  }

  const demoAccounts = [
    { label: 'Super Admin', email: 'superadmin@bireuen.go.id', color: '#EF4444' },
    { label: 'Admin', email: 'admin@bireuen.go.id', color: '#F59E0B' },
    { label: 'Petugas', email: 'ahmad@bireuen.go.id', color: '#3B82F6' },
    { label: 'User', email: 'rahmat@gmail.com', color: '#22C55E' },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>
      {/* Left Panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #0F172A 0%, #1E3A5F 60%, #1D4ED8 100%)' }}
      >
        {/* Background decorations */}
        <div
          style={{
            position: 'absolute', top: '-100px', right: '-100px',
            width: '400px', height: '400px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute', bottom: '-50px', left: '-50px',
            width: '300px', height: '300px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
          }}
        />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 1 }}>
          <div
            style={{
              width: '48px', height: '48px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Library size={28} color="white" />
          </div>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', fontWeight: 500 }}>
              SISTEM INFORMASI
            </p>
            <p style={{ color: 'white', fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.2 }}>
              Perpustakaan Kabupaten Bireuen
            </p>
          </div>
        </div>

        {/* Center content */}
        <div style={{ zIndex: 1 }}>
          <div style={{ marginBottom: '32px' }}>
            <div
              style={{
                width: '80px', height: '80px', borderRadius: '20px',
                background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '24px',
              }}
            >
              <BookOpen size={40} color="#93C5FD" />
            </div>
            <h1 style={{ color: 'white', fontSize: '2.25rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '16px' }}>
              Selamat Datang di<br />
              <span style={{ background: 'linear-gradient(135deg, #60A5FA, #818CF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                SLMS Bireuen
              </span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', lineHeight: 1.7, maxWidth: '380px' }}>
              Platform terpadu layanan perpustakaan digital. Akses ribuan koleksi buku, reservasi online, dan kelola keanggotaan dari mana saja.
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            {[
              { value: '1.5K+', label: 'Koleksi Buku' },
              { value: '847', label: 'Anggota Aktif' },
              { value: '24/7', label: 'Akses Digital' },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '12px', padding: '16px', textAlign: 'center',
                }}
              >
                <p style={{ color: '#60A5FA', fontSize: '1.5rem', fontWeight: 800 }}>{stat.value}</p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginTop: '4px' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', zIndex: 1 }}>
          © 2026 Perpustakaan Kabupaten Bireuen. All rights reserved.
        </p>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8" style={{ background: '#F8FAFC' }}>
        <div style={{ width: '100%', maxWidth: '440px' }} className="animate-fade-in">
          {/* Mobile logo */}
          <div className="lg:hidden" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
            <div
              style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Library size={22} color="white" />
            </div>
            <div>
              <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Perpustakaan Kabupaten Bireuen
              </p>
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Masuk ke Akun
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Masukkan kredensial Anda untuk mengakses sistem
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '10px',
                padding: '12px 16px', marginBottom: '20px', color: '#B91C1C',
                fontSize: '0.875rem', display: 'flex', alignItems: 'flex-start', gap: '8px',
              }}
            >
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  required
                  className="input-base"
                  style={{ paddingLeft: '44px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  required
                  className="input-base"
                  style={{ paddingLeft: '44px', paddingRight: '44px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                    display: 'flex', padding: 0,
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div style={{ textAlign: 'right', marginTop: '8px' }}>
                <Link href="/lupa-password" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 500, textDecoration: 'none' }}>
                  Lupa password?
                </Link>
              </div>
            </div>

            <button
              id="btn-login"
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '13px', fontSize: '0.95rem', marginTop: '4px', opacity: loading ? 0.8 : 1 }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                  Memproses...
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Masuk <ArrowRight size={18} />
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Akun Demo</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          </div>

          {/* Demo accounts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {demoAccounts.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => { setEmail(acc.email); setPassword('password'); }}
                style={{
                  padding: '10px', borderRadius: '10px', border: '1.5px solid var(--border)',
                  background: 'white', cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.2s', fontSize: '0.8rem',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = acc.color;
                  e.currentTarget.style.background = acc.color + '10';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.background = 'white';
                }}
              >
                <span
                  style={{
                    display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%',
                    background: acc.color, marginRight: '6px',
                  }}
                />
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{acc.label}</span>
              </button>
            ))}
          </div>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Belum punya akun?{' '}
            <Link href="/daftar" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
              Daftar Anggota
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
