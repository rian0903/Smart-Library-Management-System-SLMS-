'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, BookOpen, Lock, Mail, ArrowRight, Library, User, Phone, MapPin, CheckSquare } from 'lucide-react';
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

    // Save to simulated localStorage database
    const localUsers = localStorage.getItem('slms_registered_users');
    const registeredUsers = localUsers ? JSON.parse(localUsers) : [];

    // Check if email already registered
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
      created_at: new Date().toISOString().split('T')[0]
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

    // Save user & member
    registeredUsers.push({ user: newUser, member: newMember, password });
    localStorage.setItem('slms_registered_users', JSON.stringify(registeredUsers));

    // Authenticate user
    setAuth(newUser, 'demo-token-' + newUserId);
    router.push('/profil');
    setLoading(false);
  }

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
              Daftar Anggota Baru<br />
              <span style={{ background: 'linear-gradient(135deg, #60A5FA, #818CF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Perpustakaan Digital
              </span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', lineHeight: 1.7, maxWidth: '380px' }}>
              Dapatkan Kartu Anggota Digital, nikmati kemudahan reservasi peminjaman online, dan usulkan buku baru secara digital.
            </p>
          </div>

          {/* Benefits List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              'Kartu Anggota Digital QR Code langsung aktif',
              'Reservasi peminjaman buku via web katalog',
              'Histori kunjungan dan peminjaman tercatat rapi',
            ].map((text, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#E2E8F0', fontSize: '0.9rem' }}>
                <CheckSquare size={16} color="#60A5FA" style={{ flexShrink: 0 }} />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', zIndex: 1 }}>
          © 2026 Perpustakaan Kabupaten Bireuen. All rights reserved.
        </p>
      </div>

      {/* Right Panel - Register Form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto" style={{ background: '#F8FAFC' }}>
        <div style={{ width: '100%', maxWidth: '460px', padding: '20px 0' }} className="animate-fade-in">
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

          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Registrasi Anggota
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
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
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Nama Lengkap
              </label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
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
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
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
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Nomor Telepon
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
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
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Alamat Rumah
              </label>
              <div style={{ position: 'relative' }}>
                <MapPin size={18} style={{ position: 'absolute', left: '14px', top: '24px', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
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
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
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
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                    display: 'flex', padding: 0,
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Konfirmasi Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
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
              style={{ width: '100%', padding: '13px', fontSize: '0.95rem', marginTop: '10px', opacity: loading ? 0.8 : 1 }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                  Mendaftarkan...
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Daftar Sekarang <ArrowRight size={18} />
                </span>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Sudah punya akun?{' '}
            <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
              Masuk
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
