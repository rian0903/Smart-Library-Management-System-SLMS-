'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Library } from 'lucide-react';
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
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #F0F4FF 0%, #EEF2FF 50%, #F5F3FF 100%)' }}
    >
      <div
        className="animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 8px 40px rgba(99,102,241,0.12)',
          padding: '40px',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <div
            style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Library size={24} color="white" />
          </div>
          <div>
            <p style={{ fontSize: '0.7rem', fontWeight: 500, color: '#94A3B8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Sistem Informasi
            </p>
            <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1E293B', lineHeight: 1.3 }}>
              Perpustakaan Kabupaten Bireuen
            </p>
          </div>
        </div>

        {/* Heading */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
            Masuk ke Akun
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
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
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#1E293B', marginBottom: '8px' }}>
              Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={17} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
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
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#1E293B', marginBottom: '8px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={17} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
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
                  background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8',
                  display: 'flex', padding: 0,
                }}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            <div style={{ textAlign: 'right', marginTop: '8px' }}>
              <Link href="/lupa-password" style={{ fontSize: '0.8rem', color: '#6366F1', fontWeight: 500, textDecoration: 'none' }}>
                Lupa password?
              </Link>
            </div>
          </div>

          <button
            id="btn-login"
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '13px', fontSize: '0.95rem', opacity: loading ? 0.8 : 1 }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <span style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                Memproses...
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                Masuk <ArrowRight size={18} />
              </span>
            )}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
          <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
          <span style={{ color: '#94A3B8', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>Akun Demo</span>
          <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
        </div>

        {/* Demo accounts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {demoAccounts.map((acc) => (
            <button
              key={acc.email}
              type="button"
              onClick={() => { setEmail(acc.email); setPassword('password'); }}
              style={{
                padding: '10px', borderRadius: '10px', border: '1.5px solid #E2E8F0',
                background: 'white', cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.2s', fontSize: '0.8rem',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = acc.color;
                e.currentTarget.style.background = acc.color + '10';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E2E8F0';
                e.currentTarget.style.background = 'white';
              }}
            >
              <span
                style={{
                  display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%',
                  background: acc.color, marginRight: '6px',
                }}
              />
              <span style={{ fontWeight: 600, color: '#1E293B' }}>{acc.label}</span>
            </button>
          ))}
        </div>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.875rem', color: '#64748B' }}>
          Belum punya akun?{' '}
          <Link href="/daftar" style={{ color: '#6366F1', fontWeight: 600, textDecoration: 'none' }}>
            Daftar Anggota
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
