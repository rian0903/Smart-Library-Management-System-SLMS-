'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Library, User, Phone, MapPin } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth, isAuthenticated, user } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated && user) {
      router.push('/profil');
    }
  }, [isAuthenticated, user]);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password !== passwordConfirm) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));

    const localUsers = localStorage.getItem('slms_registered_users');
    const registeredUsers = localUsers ? JSON.parse(localUsers) : [];

    const exists = registeredUsers.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (exists || email === 'rahmat@gmail.com' || email === 'admin@bireuen.go.id') {
      setError('Email sudah terdaftar. Silakan gunakan email lain atau masuk.');
      setLoading(false);
      return;
    }

    const newUserId = Date.now();
    const newUser = {
      id: newUserId,
      name,
      email,
      role: 'user' as const,
      avatar: '',
      is_active: true,
      created_at: new Date().toISOString().split('T')[0],
    };

    const newMember = {
      id: newUserId + 1,
      user_id: newUserId,
      member_code: `BRN-${Math.floor(10000 + Math.random() * 90000)}`,
      name,
      email,
      phone,
      address,
      joined_at: new Date().toISOString().split('T')[0],
      expired_at: new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString().split('T')[0],
      status: 'active' as const,
      total_borrows: 0,
    };

    registeredUsers.push({ user: newUser, member: newMember, password });
    localStorage.setItem('slms_registered_users', JSON.stringify(registeredUsers));

    setAuth(newUser, 'demo-token-' + newUserId);
    router.push('/profil');
    setLoading(false);
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #F0F4FF 0%, #EEF2FF 50%, #F5F3FF 100%)' }}
    >
      <div
        className="animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '480px',
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 8px 40px rgba(99,102,241,0.12)',
          padding: '40px',
          margin: '24px 0',
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
            Registrasi Anggota
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
            Lengkapi formulir untuk membuat kartu anggota baru
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
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}>
              Nama Lengkap
            </label>
            <div style={{ position: 'relative' }}>
              <User size={17} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                id="reg-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama lengkap Anda"
                required
                className="input-base"
                style={{ paddingLeft: '44px' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}>
              Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={17} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                id="reg-email"
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
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}>
              Nomor Telepon
            </label>
            <div style={{ position: 'relative' }}>
              <Phone size={17} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                id="reg-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Contoh: 08123456789"
                required
                className="input-base"
                style={{ paddingLeft: '44px' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}>
              Alamat Rumah
            </label>
            <div style={{ position: 'relative' }}>
              <MapPin size={17} style={{ position: 'absolute', left: '14px', top: '24px', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <textarea
                id="reg-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Masukkan alamat rumah lengkap Anda"
                required
                className="input-base"
                rows={2}
                style={{ paddingLeft: '44px', resize: 'none' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={17} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Buat password baru"
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
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}>
              Konfirmasi Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={17} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                id="reg-password-confirm"
                type={showPassword ? 'text' : 'password'}
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="Ulangi password"
                required
                className="input-base"
                style={{ paddingLeft: '44px' }}
              />
            </div>
          </div>

          <button
            id="btn-register"
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '13px', fontSize: '0.95rem', marginTop: '6px', opacity: loading ? 0.8 : 1 }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <span style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                Mendaftarkan...
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                Daftar Sekarang <ArrowRight size={18} />
              </span>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.875rem', color: '#64748B' }}>
          Sudah punya akun?{' '}
          <Link href="/login" style={{ color: '#6366F1', fontWeight: 600, textDecoration: 'none' }}>
            Masuk
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
